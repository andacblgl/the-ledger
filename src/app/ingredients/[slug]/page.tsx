import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Wine } from 'lucide-react';

export const revalidate = 0; // Bypass route cache to ensure fresh data

export default async function IngredientPage({ params }: { params: { slug: string } }) {
    // Await params if using Next 15+ layout config, otherwise standard destructuring
    const { slug } = await Promise.resolve(params);
    const supabase = await createClient();

    // Fetch Ingredient
    const { data: ingredient, error: ingredientError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('slug', slug)
        .single();

    if (ingredientError || !ingredient) {
        return notFound();
    }

    // Fetch cocktails using this ingredient
    const { data: relatedCocktails, error: cocktailsError } = await supabase
        .from('cocktail_ingredients')
        .select(`
            measure,
            is_essential,
            cocktails (
                id,
                name,
                thumbnail_url,
                glass_type
            )
        `)
        .eq('ingredient_id', ingredient.id);

    // Extract the cocktails from the junction table
    const cocktails = relatedCocktails?.map(rc => rc.cocktails).filter(Boolean) || [];

    return (
        <div className="flex flex-col h-full bg-[#1A1C19] text-stone-200">
            {/* Minimalist Top Nav */}
            <div className="flex items-center justify-between p-6 pb-2">
                <Link href="/" className="p-2 -ml-2 text-stone-500 hover:text-stone-300 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="text-[10px] font-sans tracking-widest uppercase text-stone-600">
                    Ingredient Archive
                </div>
                <div className="w-9" /> {/* Spacer to perfectly center the title */}
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-16 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                
                {/* Hero Header */}
                <div className="mt-8 mb-12 text-center">
                    {ingredient.image_url ? (
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border border-stone-800 shadow-md relative">
                            <Image 
                                src={ingredient.image_url} 
                                alt={ingredient.name} 
                                fill
                                sizes="96px"
                                className="object-cover grayscale-[0.2]" 
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-stone-800 flex items-center justify-center bg-stone-900/50">
                            <Wine className="w-8 h-8 text-stone-700" />
                        </div>
                    )}
                    <h1 className="text-4xl font-serif tracking-wide text-stone-100 mb-2">{ingredient.name}</h1>
                </div>

                {/* Lore / Description */}
                {ingredient.description && (
                    <div className="mb-16">
                        <div className="border-l border-amber-500/30 pl-6 py-2">
                            <p className="text-sm font-serif text-stone-300 leading-relaxed italic">
                                "{ingredient.description}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Related Cocktails Grid */}
                {cocktails.length > 0 && (
                    <div>
                        <h4 className="font-sans text-[10px] tracking-widest uppercase text-stone-500 mb-6 flex items-center gap-3">
                            Featured In
                            <span className="h-[1px] bg-stone-800 flex-1"></span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {cocktails.map((cocktail: any) => (
                                <Link key={cocktail.id} href={`/?cocktailId=${cocktail.id}`} className="group block">
                                    <div className="w-full aspect-[4/5] bg-stone-900 rounded-lg overflow-hidden border border-stone-800 shadow-sm relative transition-transform duration-300 group-hover:scale-[1.02]">
                                        {cocktail.thumbnail_url ? (
                                            <img 
                                                src={cocktail.thumbnail_url} 
                                                alt={cocktail.name} 
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Wine className="w-6 h-6 text-stone-700" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C19] via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-0 left-0 w-full p-3">
                                            <h5 className="font-serif text-sm text-stone-200 line-clamp-1">{cocktail.name}</h5>
                                            <p className="text-[9px] font-sans uppercase tracking-widest text-stone-500 mt-1 line-clamp-1">
                                                {cocktail.glass_type || 'Classic'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
