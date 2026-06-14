import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useInventory } from '@/context/InventoryContext';

export interface ShoppingInsight {
    ingredientId: string;
    ingredientName: string;
    unlockCount: number;
    unlockedCocktails: string[];
}

export function useShoppingInsights() {
    const { inventory, ingredients } = useInventory();
    const [cocktails, setCocktails] = useState<{id: string, name: string, cocktail_ingredients: {ingredient_id: string, is_essential: boolean}[]}[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCocktails = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('cocktails')
                .select('id, name, cocktail_ingredients ( ingredient_id, is_essential )');
            
            if (data) {
                // Ensure data matches expected structure without using 'any'
                const typedData = data.map((item: unknown) => {
                    const row = item as { id: string, name: string, cocktail_ingredients: { ingredient_id: string, is_essential: boolean }[] };
                    return row;
                });
                setCocktails(typedData);
            }
            setIsLoading(false);
        };
        fetchCocktails();
    }, []);

    const insights = useMemo(() => {
        if (!cocktails.length || !ingredients.length) return [];

        const missingCounts: Record<string, string[]> = {}; // ingredient_id -> cocktail names

        cocktails.forEach(cocktail => {
            const missingEssential: string[] = [];
            
            cocktail.cocktail_ingredients.forEach(ci => {
                if (ci.is_essential && !inventory.has(ci.ingredient_id)) {
                    missingEssential.push(ci.ingredient_id);
                }
            });

            // Exactly ONE essential ingredient missing
            if (missingEssential.length === 1) {
                const missingId = missingEssential[0];
                if (!missingCounts[missingId]) {
                    missingCounts[missingId] = [];
                }
                missingCounts[missingId].push(cocktail.name);
            }
        });

        const results: ShoppingInsight[] = Object.entries(missingCounts)
            .map(([ingredientId, unlockedCocktails]) => {
                const ing = ingredients.find(i => i.id === ingredientId);
                return {
                    ingredientId,
                    ingredientName: ing ? ing.name : 'Unknown Ingredient',
                    unlockCount: unlockedCocktails.length,
                    unlockedCocktails
                };
            })
            .sort((a, b) => b.unlockCount - a.unlockCount);

        return results;
    }, [cocktails, inventory, ingredients]);

    return { insights, isLoading };
}
