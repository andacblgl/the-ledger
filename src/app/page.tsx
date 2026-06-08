'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import { useInventory } from '@/context/InventoryContext';
import { Cocktail, evaluateCocktailMatch, MatchResult } from '@/lib/matchLogic';
import { Search, Loader2, Wine, Circle, Bookmark, Star, Pin } from 'lucide-react';
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
function CocktailModalContent({ match, inventory, user, bookmarks, setBookmarks, topShelf, toggleTopShelf, allCocktails, onTagClick }: any) {
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
        const { error } = await supabaseClient.from('bookmarks').insert({
            user_id: user.id,
            cocktail_id: match.cocktail.id,
            rating,
            note: note.trim()
        });
        
        setIsSaving(false);
        if (error) {
            console.error('Supabase Insert Error:', error);
            toast.error('Failed to save note. Check console.');
        } else {
            toast.success('Saved to your Tasting Diary.');
            setNote('');
            setRating(0);
            if (setBookmarks) {
                setBookmarks((prev: Set<string>) => {
                    const next = new Set(prev);
                    next.add(match.cocktail.id);
                    return next;
                });
            }
        }
    };

    const isTopShelf = topShelf?.has(match.cocktail.id) || false;

    const flavorTags = match.cocktail.flavor_tags || null;
    const lore = match.cocktail.lore || null;
    const relatedClassics = match.cocktail.related_classics || null;

    console.log('====================================');
    console.log('MODAL DATA:', match.cocktail.name, match.cocktail);
    console.log('Flavor Tags:', flavorTags);
    console.log('Lore:', lore);
    console.log('Related Classics:', relatedClassics);
    console.log('====================================');

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
                                type="button"
                                onClick={() => toggleTopShelf(match.cocktail.id)}
                                className={`p-2 rounded-full border transition-all ${isTopShelf ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,166,35,0.1)]' : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-600'}`}
                            >
                                <Pin className="w-4 h-4" fill={isTopShelf ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Semantic Identity: Flavor Tags */}
                    {flavorTags && flavorTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {flavorTags.slice(0, 3).map((tag: any) => {
                                const tagText = typeof tag === 'string' ? tag : (tag?.label || tag?.slug || '');
                                return (
                                    <button 
                                        key={tagText} 
                                        onClick={() => onTagClick(tagText)}
                                        className="border border-stone-800 text-stone-400 text-xs px-3 py-1 rounded-full font-sans tracking-wide hover:border-amber-500/50 hover:text-amber-500 transition-colors cursor-pointer"
                                    >
                                        {tagText}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Core: Ingredients */}
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
                                            <Link href={`/ingredients/${ci.ingredients.slug || ci.ingredients.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-amber-500 hover:underline transition-colors">
                                                {ci.ingredients.name}
                                            </Link>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Semantic Identity: Lore */}
                    {lore && (
                        <div>
                            <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                                From the Archives
                                <span className="h-[1px] bg-stone-800 flex-1"></span>
                            </h4>
                            <div className="border-l border-amber-500/30 pl-4 py-1">
                                <p className="text-sm font-serif text-stone-300 leading-relaxed italic">
                                    "{lore.text}"
                                </p>
                                {lore.source && (
                                    <p className="text-[10px] font-sans uppercase tracking-widest text-stone-500 mt-2">
                                        — {lore.source}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Core: Preparation */}
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

                    {/* Semantic Identity: Related Classics */}
                    {relatedClassics && relatedClassics.length > 0 && (
                        <div>
                            <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-4 flex items-center gap-3">
                                Related Classics
                                <span className="h-[1px] bg-stone-800 flex-1"></span>
                            </h4>
                            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {relatedClassics.map((related: any) => {
                                    const matchedCocktail = allCocktails?.find((c: any) => {
                                        const cSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                        return cSlug === related.slug;
                                    });
                                    const thumbnailUrl = matchedCocktail?.thumbnail_url;
                                    const imageSrc = thumbnailUrl 
                                        ? (thumbnailUrl.startsWith('/') || thumbnailUrl.startsWith('http') ? thumbnailUrl : `/${thumbnailUrl}`)
                                        : null;

                                    return (
                                        <div 
                                            key={related.slug} 
                                            className="min-w-[110px] max-w-[140px] flex-1 group cursor-pointer"
                                        >
                                            <div className="w-full aspect-square bg-stone-900 rounded-md overflow-hidden relative border border-stone-800 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                                                {imageSrc ? (
                                                    <img 
                                                        src={imageSrc} 
                                                        alt={related.name} 
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#151714] text-stone-500 font-serif text-4xl font-light">
                                                        {related.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <h5 className="mt-2.5 font-serif text-sm text-stone-200 truncate">{related.name}</h5>
                                            <p className="text-[10px] font-sans tracking-wide uppercase text-stone-500 truncate mt-0.5">
                                                {related.note || related.shared_trait}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
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
                                        type="button"
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
                                type="button"
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
    const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [topShelf, setTopShelf] = useState<Set<string>>(new Set());
    const [selectedCocktailId, setSelectedCocktailId] = useState<string | null>(null);
    const supabaseClient = createClient();

    console.log("Current Active Filter:", activeTagFilter);

    useEffect(() => {
        // Handle URL parameters for cocktail modal
        const params = new URLSearchParams(window.location.search);
        const id = params.get('cocktailId');
        if (id) {
            setSelectedCocktailId(id);
        }
        async function fetchCocktails() {
            const { data, error } = await supabase
                .from('cocktails')
                .select(`
                    id,
                    name,
                    description,
                    instructions,
                    glass_type,
                    thumbnail_url,
                    flavor_tags,
                    lore,
                    related_classics,
                    cocktail_ingredients (
                        ingredient_id,
                        is_essential,
                        role,
                        ingredients (
                            name,
                            slug
                        )
                    )
                `);
            
            if (error) {
                console.error("Error fetching cocktails:", error);
            }

            if (data && !error) {
                // @ts-ignore
                setCocktails(data);
            }
            setIsLoading(false);
        }
        
        fetchCocktails();

        // Check Auth and User States
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchUserStates(session.user.id);
            }
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchUserStates(session.user.id);
            } else {
                setUser(null);
                setBookmarks(new Set());
                setTopShelf(new Set());
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchUserStates(userId: string) {
        const [bm, ts] = await Promise.all([
            supabaseClient.from('bookmarks').select('cocktail_id').eq('user_id', userId),
            supabaseClient.from('top_shelf').select('cocktail_id').eq('user_id', userId)
        ]);
        if (bm.data) setBookmarks(new Set(bm.data.map(d => d.cocktail_id)));
        if (ts.data) setTopShelf(new Set(ts.data.map(d => d.cocktail_id)));
    }

    const toggleTopShelf = async (cocktailId: string) => {
        if (!user) return;
        
        if (topShelf.has(cocktailId)) {
            setTopShelf(prev => {
                const next = new Set(prev);
                next.delete(cocktailId);
                return next;
            });
            await supabaseClient.from('top_shelf').delete().eq('user_id', user.id).eq('cocktail_id', cocktailId);
        } else {
            if (topShelf.size >= 4) {
                toast.error('Top Shelf full');
                return;
            }
            setTopShelf(prev => {
                const next = new Set(prev);
                next.add(cocktailId);
                return next;
            });
            toast.success('Pinned to Top Shelf');
            await supabaseClient.from('top_shelf').insert({ user_id: user.id, cocktail_id: cocktailId });
        }
    }

    const matchedCocktails = useMemo(() => {
        if (inventory.size === 0) return [];

        const matches: MatchResult[] = cocktails.map(c => evaluateCocktailMatch(c, inventory));
        
        const filtered = matches.filter(m => {
            const matchesSearch = m.cocktail.name.toLowerCase().includes(search.toLowerCase());
            
            let matchesTag = true;
            if (activeTagFilter) {
                if (!m.cocktail.flavor_tags) {
                    matchesTag = false;
                } else {
                    let tagsArray: string[] = [];
                    try {
                        tagsArray = Array.isArray(m.cocktail.flavor_tags) 
                            ? m.cocktail.flavor_tags 
                            : typeof m.cocktail.flavor_tags === 'string' 
                                ? JSON.parse(m.cocktail.flavor_tags) 
                                : [];
                    } catch (e) {
                        tagsArray = [];
                    }

                    matchesTag = tagsArray.some((tag: any) => {
                        const tagText = typeof tag === 'string' ? tag : (tag?.label || tag?.slug || '');
                        return tagText.toLowerCase().trim() === activeTagFilter.toLowerCase().trim();
                    });
                }
            }

            return matchesSearch && matchesTag;
        });

        const order = {
            'Perfect Match': 1,
            'Bar Ready': 2,
            'Almost There': 3,
            'Missing Ingredients': 4
        };

        return filtered.sort((a, b) => order[a.state] - order[b.state]);
    }, [cocktails, inventory, search, activeTagFilter]);

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

            {activeTagFilter && (
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-stone-500 text-[10px] font-sans tracking-widest uppercase">Filtered by:</span>
                    <button 
                        onClick={() => setActiveTagFilter(null)} 
                        className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full text-xs font-sans tracking-wide flex items-center gap-2 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all shadow-[0_0_10px_rgba(245,166,35,0.05)]"
                    >
                        {activeTagFilter}
                        <span className="text-amber-500/70 hover:text-amber-500 ml-1 leading-none text-sm font-light">×</span>
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 pb-10 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                {matchedCocktails.map((match) => {
                    const ingredientPreview = match.cocktail.cocktail_ingredients
                        .map(ci => ci.ingredients.name)
                        .slice(0, 3)
                        .join(', ') + (match.cocktail.cocktail_ingredients.length > 3 ? '...' : '');

                    const isDimmed = match.state === 'Missing Ingredients';

                    return (
                        <Dialog 
                            key={match.cocktail.id}
                            open={selectedCocktailId === match.cocktail.id}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setSelectedCocktailId(null);
                                    const url = new URL(window.location.href);
                                    url.searchParams.delete('cocktailId');
                                    window.history.replaceState({}, '', url.toString());
                                } else {
                                    setSelectedCocktailId(match.cocktail.id);
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('cocktailId', match.cocktail.id);
                                    window.history.replaceState({}, '', url.toString());
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <div role="button" tabIndex={0} className={`w-full text-left bg-[#1E2320] border border-stone-800/40 p-4 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-[#252b27] active:scale-[0.98] shadow-sm flex items-center
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
                                bookmarks={bookmarks}
                                setBookmarks={setBookmarks}
                                topShelf={topShelf}
                                toggleTopShelf={toggleTopShelf}
                                allCocktails={cocktails}
                                onTagClick={(tagLabel: string) => {
                                    setActiveTagFilter(tagLabel);
                                    setSearch('');
                                    setSelectedCocktailId(null);
                                    const url = new URL(window.location.href);
                                    url.searchParams.delete('cocktailId');
                                    window.history.replaceState({}, '', url.toString());
                                }}
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
