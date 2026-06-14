'use client';

import { useInventory } from '@/context/InventoryContext';
import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useShoppingInsights } from '@/hooks/useShoppingInsights';

// Helper to convert to Title Case
const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
};

export default function MyBarPage() {
    const { ingredients, inventory, toggleIngredient, isLoading } = useInventory();
    const [search, setSearch] = useState('');
    const { insights, isLoading: isInsightsLoading } = useShoppingInsights();

    // 1. Frontend Data Cleaning (Deduplication & Formatting)
    const cleanedIngredients = useMemo(() => {
        const unique = new Map();
        ingredients.forEach(ing => {
            const cleanName = toTitleCase(ing.name.trim());
            // Store the first one we see for each name, so we don't have duplicates
            if (!unique.has(cleanName.toLowerCase())) {
                unique.set(cleanName.toLowerCase(), {
                    ...ing,
                    name: cleanName
                });
            }
        });
        return Array.from(unique.values());
    }, [ingredients]);

    const categories = useMemo(() => {
        const cats = {
            'Base Spirits': cleanedIngredients.filter(i => i.category === 'base_spirit'),
            'Citrus': cleanedIngredients.filter(i => i.category === 'citrus'),
            'Sweeteners': cleanedIngredients.filter(i => i.category === 'sweetener'),
            'Modifiers': cleanedIngredients.filter(i => i.category === 'modifier'),
            'Garnishes': cleanedIngredients.filter(i => i.category === 'garnish'),
        };
        return cats;
    }, [cleanedIngredients]);

    const filterIngredients = (list: typeof cleanedIngredients) => 
        list.filter(i => i.name.toLowerCase().includes(search.trim().toLowerCase()));

    // Split into selected and unselected
    const selectedIngredients = cleanedIngredients.filter(i => inventory.has(i.id));

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-background text-foreground">
                <div className="animate-pulse font-serif text-xl text-stone-400">Accessing the Archive...</div>
            </div>
        );
    }

    const isSearching = search.trim().length > 0;

    return (
        <div className="p-6 pt-10 flex flex-col h-full bg-background text-foreground max-w-3xl mx-auto w-full">
            <header className="mb-8 shrink-0">
                <h1 className="text-4xl font-serif text-primary mb-3">Inventory Ledger</h1>
                <p className="text-sm text-stone-400 font-sans tracking-wide">Maintain your provisions in the archive.</p>
            </header>

            <div className="relative mb-8 shrink-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-stone-500" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search provisions..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-stone-900/50 border border-stone-800 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-stone-200 placeholder:text-stone-600 font-sans"
                />
            </div>

            {/* NEW SECTION: Curator's Insight */}
            {insights.length > 0 && !isSearching && (
                <section className="mb-10 shrink-0">
                    <h2 className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4 flex items-center gap-3">
                        💡 Curator's Insight
                        <span className="h-[1px] bg-amber-500/20 flex-1"></span>
                    </h2>
                    <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 border border-amber-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <p className="text-sm text-stone-300 font-serif leading-relaxed flex flex-wrap items-center">
                                <span>Acquiring</span>
                                <button 
                                    onClick={() => toggleIngredient(insights[0].ingredientId)}
                                    className="font-sans font-bold text-amber-500 tracking-wide uppercase text-xs mx-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 cursor-pointer transition-all hover:scale-105 hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_10px_rgba(245,166,35,0.2)] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                                    aria-label={`Add ${insights[0].ingredientName} to your cabinet`}
                                >
                                    {insights[0].ingredientName}
                                </button> 
                                <span>will unlock <strong className="text-stone-200">{insights[0].unlockCount}</strong> new classic {insights[0].unlockCount === 1 ? 'cocktail' : 'cocktails'}</span>

                                <span className="text-stone-500 italic text-xs ml-1">
                                    (e.g., {insights[0].unlockedCocktails.slice(0, 2).join(', ')}{insights[0].unlockedCocktails.length > 2 ? '...' : ''})
                                </span>.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Your Cabinet (Selected State) */}
            <section className="mb-10 shrink-0">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                    In Your Cabinet
                    <span className="h-[1px] bg-stone-800 flex-1"></span>
                </h2>
                
                {selectedIngredients.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-stone-700">
                        {selectedIngredients.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 border border-stone-700/50 rounded-md shadow-sm group hover:border-stone-600 transition-colors"
                            >
                                <span className="text-xs font-medium text-stone-200 font-sans">{item.name}</span>
                                <button 
                                    onClick={() => toggleIngredient(item.id)}
                                    className="text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded p-0.5 transition-colors"
                                    aria-label={`Remove ${item.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 px-4 border border-dashed border-stone-800 rounded-lg text-center bg-stone-900/20">
                        <p className="text-sm text-stone-500 font-sans italic">Your cabinet is empty. Add provisions below.</p>
                    </div>
                )}
            </section>

            {/* 3. Collapsible Categories & 4. Clean Row Layout */}
            <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-stone-700">
                {isSearching ? (
                    <div className="space-y-6">
                        {Object.entries(categories).map(([category, items]) => {
                            const filtered = filterIngredients(items).filter(i => !inventory.has(i.id));
                            if (filtered.length === 0) return null;
                            
                            return (
                                <div key={category} className="space-y-3">
                                    <h3 className="text-sm font-medium tracking-wide text-stone-400 uppercase border-b border-stone-800/60 pb-2">{category}</h3>
                                    <div className="flex flex-col gap-1">
                                        {filtered.map((item) => (
                                            <div 
                                                key={item.id}
                                                className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-stone-900/60 transition-colors group border border-transparent hover:border-stone-800/60"
                                            >
                                                <span className="text-sm font-sans text-stone-300 font-medium">
                                                    {item.name}
                                                </span>
                                                <button
                                                    onClick={() => toggleIngredient(item.id)}
                                                    className="relative flex items-center justify-center w-6 h-6 rounded-md border border-stone-700 bg-stone-900 hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    aria-label={`Add ${item.name}`}
                                                >
                                                    <div className="w-2.5 h-2.5 rounded-sm bg-transparent group-hover:bg-primary/30 transition-colors"></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {Object.values(categories).every(items => filterIngredients(items).filter(i => !inventory.has(i.id)).length === 0) && (
                            <div className="py-10 text-center">
                                <p className="text-stone-500 font-sans">No provisions match your search.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <Accordion className="w-full space-y-4">
                        {Object.entries(categories).map(([category, items]) => {
                            const filtered = filterIngredients(items).filter(i => !inventory.has(i.id));
                            
                            if (filtered.length === 0) return null;
                            
                            return (
                                <AccordionItem value={category} key={category} className="border border-stone-800/60 rounded-lg overflow-hidden bg-stone-950/40">
                                    <AccordionTrigger className="px-5 py-4 hover:bg-stone-900/50 transition-colors">
                                        <span className="text-sm font-medium tracking-wide text-stone-300 uppercase">{category}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-0 pb-2 px-2">
                                        <div className="flex flex-col gap-1">
                                            {filtered.map((item) => {
                                                return (
                                                    <div 
                                                        key={item.id}
                                                        className="flex items-center justify-between py-3 px-3 rounded-md hover:bg-stone-900/60 transition-colors group"
                                                    >
                                                        <span className="text-sm font-sans text-stone-300 font-medium">
                                                            {item.name}
                                                        </span>
                                                        <button
                                                            onClick={() => toggleIngredient(item.id)}
                                                            className="relative flex items-center justify-center w-6 h-6 rounded-md border border-stone-700 bg-stone-900 hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                            aria-label={`Add ${item.name}`}
                                                        >
                                                            <div className="w-2.5 h-2.5 rounded-sm bg-transparent group-hover:bg-primary/30 transition-colors"></div>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </div>
        </div>
    );
}
