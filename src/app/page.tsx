'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import { useInventory } from '@/context/InventoryContext';
import { Cocktail, evaluateCocktailMatch, MatchResult } from '@/lib/matchLogic';
import { Search, Loader2, Wine, Circle, Bookmark, Star } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from 'next/link';
import { toast } from 'sonner';

// Extracted Component for Modal Content to manage its own form state
function CocktailModalContent({ match, inventory, user, topShelf, toggleTopShelf }: any) {
    const [rating, setRating] = useState(0);
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const supabaseClient = createClient();

    const handleSaveDiary = async () => {
        if (!user) {
            toast.error('You must be logged in to save tasting notes.');
            return;
        }
        if (rating === 0 || !note.trim()) {
            toast.error('Please provide a rating and a note.');
            return;
        }

        setIsSaving(true);
        const { error } = await supabaseClient.from('tasting_notes').insert({
            user_id: user.id,
            cocktail_id: match.cocktail.id,
            rating,
            notes: note.trim()
        });
        
        setIsSaving(false);
        if (error) {
            console.error('Supabase Insert Error:', error);
            toast.error('Failed to save note. Check console.');
        } else {
            toast.success('Saved to your Tasting Diary.');
            setNote('');
            setRating(0);
        }
    };

    const isTopShelf = topShelf.has(match.cocktail.id);

    return (
        <DialogContent className="bg-[#1A1C19] border-stone-800 sm:max-w-md w-[95vw] rounded-2xl p-0 text-stone-200 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {match.cocktail.thumbnail_url && (
                <div className="w-full h-48 relative shrink-0">
                    <img 
                        src={match.cocktail.thumbnail_url} 
                        alt={match.cocktail.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C19] to-transparent"></div>
                </div>
            )}
            
            <div className="p-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                <DialogHeader className={`text-left ${match.cocktail.thumbnail_url ? 'mt-[-30px] relative z-10' : ''} mb-6`}>
                    <div className="flex items-start justify-between w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <DialogTitle className="font-serif text-3xl tracking-wide text-stone-100">{match.cocktail.name}</DialogTitle>
                                {match.state === 'Perfect Match' && (
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,166,35,0.3)] shrink-0" />
                                )}
                            </div>
                            <p className="text-xs font-sans tracking-widest uppercase text-stone-500">
                                {match.cocktail.glass_type ? `Serve in a ${match.cocktail.glass_type}` : 'Speakeasy selection'}
                            </p>
                        </div>
                        {user && (
                            <button 
                                onClick={() => toggleTopShelf(match.cocktail.id)}
                                className={`p-2 rounded-full border transition-all ${isTopShelf ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,166,35,0.1)]' : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-600'}`}
                            >
                                <Bookmark className="w-4 h-4" fill={isTopShelf ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-8">
                    <div>
                        <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                            Ingredients
                            <span className="h-[1px] bg-stone-800 flex-1"></span>
                        </h4>
                        <ul className="space-y-3">
                            {match.cocktail.cocktail_ingredients.map((ci: any, idx: number) => {
                                const hasIngredient = inventory.has(ci.ingredient_id);
                                return (
                                    <li 
                                        key={idx} 
                                        className={`flex items-start text-sm font-serif ${
                                            hasIngredient 
                                            ? 'text-stone-200' 
                                            : 'text-stone-500 italic'
                                        }`}
                                    >
                                        {hasIngredient ? (
                                            <span className="mr-3 mt-[6px] block w-1 h-1 rounded-full bg-amber-500/80 shrink-0" />
                                        ) : (
                                            <Circle className="mr-3 mt-[4px] w-2 h-2 text-stone-600 shrink-0" />
                                        )}
                                        <span className="leading-relaxed">
                                            {ci.amount ? `${ci.amount} ` : ''}
                                            {ci.ingredients.name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {match.cocktail.instructions && (
                        <div>
                            <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                                Preparation
                                <span className="h-[1px] bg-stone-800 flex-1"></span>
                            </h4>
                            <p className="text-sm font-serif text-stone-300 leading-relaxed italic">
                                {match.cocktail.instructions}
                            </p>
                        </div>
                    )}

                    {/* Curator's Experience Form */}
                    {user && (
                        <div className="mt-8 pt-8 border-t border-stone-800/60">
                            <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                                Curator's Note
                                <span className="h-[1px] bg-stone-800 flex-1"></span>
                            </h4>
                            
                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >
                                        <Star 
                                            className={`w-5 h-5 transition-colors ${rating >= star ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]' : 'text-stone-700 hover:text-stone-500'}`} 
                                            fill={rating >= star ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Log your tasting experience..."
                                className="w-full bg-stone-900/40 border border-stone-800 rounded-lg p-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-stone-600 transition-colors mb-4 resize-none h-24 font-serif"
                            />

                            <button 
                                onClick={handleSaveDiary}
                                disabled={isSaving}
                                className="w-full py-2.5 px-4 bg-stone-900 border border-stone-800 hover:border-stone-600 text-stone-300 font-sans tracking-wide uppercase text-[10px] rounded shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save to Diary'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}

export default function ArchivePage() {
    const { inventory } = useInventory();
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState<any>(null);
    const [topShelf, setTopShelf] = useState<Set<string>>(new Set());
    const supabaseClient = createClient();

    useEffect(() => {
        async function fetchCocktails() {
            const { data, error } = await supabase
                .from('cocktails')
                .select(`
                    *,
                    cocktail_ingredients (
                        ingredient_id,
                        is_essential,
                        role,
                        ingredients (
                            name
                        )
                    )
                `);
            
            if (data && !error) {
                // @ts-ignore
                setCocktails(data);
            }
            setIsLoading(false);
        }
        
        fetchCocktails();

        // Check Auth and Top Shelf
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchTopShelf(session.user.id);
            }
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchTopShelf(session.user.id);
            } else {
                setUser(null);
                setTopShelf(new Set());
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchTopShelf(userId: string) {
        const { data } = await supabaseClient.from('top_shelf').select('cocktail_id').eq('user_id', userId);
        if (data) {
            setTopShelf(new Set(data.map(d => d.cocktail_id)));
        }
    }

    const toggleTopShelf = async (cocktailId: string) => {
        if (!user) return;
        
        if (topShelf.has(cocktailId)) {
            setTopShelf(prev => {
                const next = new Set(prev);
                next.delete(cocktailId);
                return next;
            });
            const { error } = await supabaseClient.from('top_shelf').delete().eq('user_id', user.id).eq('cocktail_id', cocktailId);
            if (error) console.error('Supabase Delete Error:', error);
        } else {
            if (topShelf.size >= 4) {
                toast.error('Your Top Shelf is full.', { description: 'Remove a cocktail to add a new one.' });
                return;
            }
            setTopShelf(prev => {
                const next = new Set(prev);
                next.add(cocktailId);
                return next;
            });
            toast.success('Added to Top Shelf');
            const { error } = await supabaseClient.from('top_shelf').insert({ user_id: user.id, cocktail_id: cocktailId });
            if (error) console.error('Supabase Insert Error:', error);
        }
    }

    const matchedCocktails = useMemo(() => {
        if (inventory.size === 0) return [];

        const matches: MatchResult[] = cocktails.map(c => evaluateCocktailMatch(c, inventory));
        
        const filtered = matches.filter(m => m.cocktail.name.toLowerCase().includes(search.toLowerCase()));

        const order = {
            'Perfect Match': 1,
            'Bar Ready': 2,
            'Almost There': 3,
            'Missing Ingredients': 4
        };

        return filtered.sort((a, b) => order[a.state] - order[b.state]);
    }, [cocktails, inventory, search]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-stone-600" />
            </div>
        );
    }

    // Empty Glass State
    if (inventory.size === 0) {
        return (
            <div className="p-6 pt-10 flex flex-col h-full items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full border border-stone-800 flex items-center justify-center mb-8">
                    <Wine className="w-8 h-8 text-stone-600" />
                </div>
                <h2 className="text-3xl font-serif text-stone-200 mb-4 tracking-wide">The archive awaits.</h2>
                <p className="text-stone-400 mb-10 text-sm max-w-[280px] font-sans font-light leading-relaxed">
                    Add provisions to your bar to unveil what you can craft tonight.
                </p>
                <Link 
                    href="/my-bar"
                    className="border border-stone-700 text-stone-300 px-8 py-3 rounded-sm font-sans text-xs tracking-widest uppercase hover:bg-stone-900 transition-colors"
                >
                    Stock My Bar
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 pt-10 flex flex-col h-full">
            <header className="mb-8">
                <h1 className="text-4xl font-serif text-stone-200 mb-2 tracking-wide">The Archive</h1>
                <p className="text-xs font-sans uppercase tracking-widest text-stone-500">Curated Libations</p>
            </header>

            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-stone-500" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search the archive..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#1E2320]/50 border border-stone-800/80 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-stone-500 transition-all text-stone-200 placeholder:text-stone-600 font-sans shadow-inner"
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-10 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                {matchedCocktails.map((match) => {
                    const ingredientPreview = match.cocktail.cocktail_ingredients
                        .map(ci => ci.ingredients.name)
                        .slice(0, 3)
                        .join(', ') + (match.cocktail.cocktail_ingredients.length > 3 ? '...' : '');

                    const isDimmed = match.state === 'Missing Ingredients';

                    return (
                        <Dialog key={match.cocktail.id}>
                            <DialogTrigger asChild>
                                <div className={`w-full text-left bg-[#1E2320] border border-stone-800/40 p-4 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-[#252b27] active:scale-[0.98] shadow-sm flex items-center
                                    ${isDimmed ? 'opacity-50 grayscale-[0.3]' : 'opacity-100'}
                                `}>
                                    {/* Thumbnail Image */}
                                    <div className="w-20 h-20 shrink-0 bg-stone-900 rounded-xl overflow-hidden relative border border-stone-800/80">
                                        {match.cocktail.thumbnail_url ? (
                                            <img 
                                                src={match.cocktail.thumbnail_url} 
                                                alt={match.cocktail.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-stone-900/50">
                                                <Wine className="w-6 h-6 text-stone-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 flex flex-col justify-center ml-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-serif text-xl text-stone-200 tracking-wide line-clamp-1">{match.cocktail.name}</h3>
                                            
                                            {/* Minimalist Status Dots */}
                                            {match.state === 'Perfect Match' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,166,35,0.4)] shrink-0" />
                                            )}
                                            {match.state === 'Bar Ready' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-600/60 shrink-0" />
                                            )}
                                            {match.state === 'Almost There' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-stone-600 shrink-0" />
                                            )}
                                        </div>

                                        {/* Minimalist Ingredients Preview */}
                                        <p className="font-sans text-xs text-stone-400 mb-2 line-clamp-1">
                                            {ingredientPreview}
                                        </p>

                                        {/* Simplified Needs Text */}
                                        {match.state !== 'Perfect Match' && match.state !== 'Missing Ingredients' && (
                                            <p className="text-amber-600/80 text-xs font-serif italic line-clamp-1">
                                                Missing {match.missingIngredients[0]}
                                                {match.missingIngredients.length > 1 ? ` +${match.missingIngredients.length - 1}` : ''}
                                            </p>
                                        )}
                                        {match.state === 'Perfect Match' && (
                                            <p className="text-amber-500/80 text-xs font-serif italic line-clamp-1">
                                                Ready to mix
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </DialogTrigger>

                            <CocktailModalContent 
                                match={match} 
                                inventory={inventory} 
                                user={user}
                                topShelf={topShelf}
                                toggleTopShelf={toggleTopShelf}
                            />
                        </Dialog>
                    );
                })}
                
                {matchedCocktails.length === 0 && search && (
                    <div className="text-center text-stone-500 py-10 font-serif italic">
                        No cocktails found matching your query.
                    </div>
                )}
            </div>
        </div>
    );
}
