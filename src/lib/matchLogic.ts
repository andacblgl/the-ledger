export type MatchState = 'Perfect Match' | 'Bar Ready' | 'Almost There' | 'Missing Ingredients';

export interface CocktailIngredient {
    ingredient_id: string;
    is_essential: boolean;
    role: string;
    ingredients: {
        name: string;
    };
}

export interface Cocktail {
    id: string;
    name: string;
    description: string;
    instructions: string;
    glass_type: string;
    thumbnail_url?: string;
    flavor_tags?: { slug: string; label: string }[];
    lore?: { text: string; source?: string };
    related_classics?: { slug: string; name: string; shared_trait: string; thumbnail_url: string }[];
    cocktail_ingredients: CocktailIngredient[];
}

export interface MatchResult {
    cocktail: Cocktail;
    state: MatchState;
    missingIngredients: string[];
}

export function evaluateCocktailMatch(cocktail: Cocktail, userInventory: Set<string>): MatchResult {
    let missingEssential: string[] = [];
    let missingNonEssential: string[] = [];

    for (const ci of cocktail.cocktail_ingredients) {
        if (!userInventory.has(ci.ingredient_id)) {
            if (ci.is_essential) {
                missingEssential.push(ci.ingredients.name);
            } else {
                missingNonEssential.push(ci.ingredients.name);
            }
        }
    }

    let state: MatchState = 'Missing Ingredients';

    if (missingEssential.length === 0 && missingNonEssential.length === 0) {
        state = 'Perfect Match';
    } else if (missingEssential.length === 0 && missingNonEssential.length > 0) {
        state = 'Bar Ready';
    } else if (missingEssential.length === 1) {
        state = 'Almost There';
    }

    const missingIngredients = [...missingEssential, ...missingNonEssential];

    return {
        cocktail,
        state,
        missingIngredients
    };
}
