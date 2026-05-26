'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Ingredient {
    id: string;
    name: string;
    category: string;
}

interface InventoryContextType {
    ingredients: Ingredient[];
    inventory: Set<string>; // Set of ingredient IDs
    toggleIngredient: (id: string) => void;
    isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [inventory, setInventory] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        // Fetch all generic ingredients
        async function fetchIngredients() {
            const { data, error } = await supabase
                .from('ingredients')
                .select('*')
                .order('name');
                
            if (data && !error) {
                setIngredients(data);
            } else {
                console.error('Error fetching ingredients:', error);
            }
            setIsLoading(false);
        }
        
        fetchIngredients();

        // Check active session and listen to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Handle user inventory syncing whenever user changes
    useEffect(() => {
        async function syncUserInventory() {
            if (!userId) {
                // Not logged in: try to load from local storage
                const saved = localStorage.getItem('my_bar_inventory');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setInventory(new Set(parsed));
                    } catch (e) {
                        console.error('Failed to parse saved inventory', e);
                    }
                } else {
                    setInventory(new Set());
                }
                return;
            }

            // User is logged in!
            // First, migrate any local storage data to the cloud
            const saved = localStorage.getItem('my_bar_inventory');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as string[];
                    if (parsed.length > 0) {
                        const inserts = parsed.map(id => ({
                            user_id: userId,
                            ingredient_id: id
                        }));
                        
                        // Insert migrating items (ignore duplicates if they already exist)
                        await supabase
                            .from('user_ingredients')
                            .upsert(inserts, { onConflict: 'user_id, ingredient_id' });
                    }
                    // Clear local storage after successful migration
                    localStorage.removeItem('my_bar_inventory');
                } catch (e) {
                    console.error('Migration failed', e);
                }
            }

            // Fetch current cloud inventory
            const { data, error } = await supabase
                .from('user_ingredients')
                .select('ingredient_id')
                .eq('user_id', userId);

            if (data && !error) {
                setInventory(new Set(data.map(d => d.ingredient_id)));
            }
        }

        syncUserInventory();
    }, [userId, supabase]);

    const toggleIngredient = async (id: string) => {
        setInventory(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                // Fire and forget db deletion
                if (userId) {
                    supabase.from('user_ingredients')
                        .delete()
                        .eq('user_id', userId)
                        .eq('ingredient_id', id)
                        .then();
                }
            } else {
                next.add(id);
                // Fire and forget db insertion
                if (userId) {
                    supabase.from('user_ingredients')
                        .insert({ user_id: userId, ingredient_id: id })
                        .then();
                }
            }
            
            // If not logged in, persist to local storage
            if (!userId) {
                localStorage.setItem('my_bar_inventory', JSON.stringify(Array.from(next)));
            }
            
            return next;
        });
    };

    return (
        <InventoryContext.Provider value={{ ingredients, inventory, toggleIngredient, isLoading }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
}
