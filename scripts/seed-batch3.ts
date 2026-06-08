import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide __dirname equivalent for ES modules/TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const batch3Classics = [
  {
    name: "Vesper",
    glass: "Martini",
    ingredients: [
      { name: "London Dry Gin", measure: "3 oz" },
      { name: "Vodka", measure: "1 oz" },
      { name: "Lillet Blanc", measure: "0.5 oz" }
    ],
    flavor_tags: ["Potent", "Botanical", "Crisp"],
    lore: "Invented by Ian Fleming in 1953 for his legendary spy, James Bond. It is a dangerously smooth, razor-sharp libation that commands absolute attention and a very high tolerance.",
    preparation: "1. Add the gin, vodka, and Lillet Blanc to a shaker.\n2. Fill with ice and shake vigorously until extremely cold.\n3. Double strain into a chilled martini glass.\n4. Garnish with a large, thin slice of lemon peel.",
    related_classics: [
      { name: "Dry Martini", slug: "dry-martini", note: "Classic gin original" },
      { name: "Corpse Reviver", slug: "corpse-reviver", note: "Lillet variant" }
    ]
  },
  {
    name: "Corpse Reviver No. 2",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "0.75 oz" },
      { name: "Orange Liqueur", measure: "0.75 oz" },
      { name: "Lillet Blanc", measure: "0.75 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" },
      { name: "Absinthe", measure: "Rinse" }
    ],
    flavor_tags: ["Citrusy", "Anise", "Complex"],
    lore: "A legendary hair-of-the-dog remedy from the Savoy Cocktail Book. Harry Craddock famously warned that consuming four of these in swift succession would swiftly un-revive the corpse.",
    preparation: "1. Rinse a chilled coupe with absinthe and discard the excess.\n2. Add gin, orange liqueur, Lillet, and lemon juice to a shaker.\n3. Fill with ice and shake vigorously.\n4. Strain into the absinthe-rinsed coupe.\n5. Garnish with an orange twist.",
    related_classics: [
      { name: "Sazerac", slug: "sazerac", note: "Absinthe rinse cousin" }
    ]
  },
  {
    name: "Bramble",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Crème de Mûre", measure: "0.5 oz" }
    ],
    flavor_tags: ["Fruity", "Tart", "Refreshing"],
    lore: "Created in 1980s London by Dick Bradsell. It captures the essence of British hedgerows in spring, marrying sharp gin and lemon with a dramatic, bleeding crown of dark blackberry liqueur.",
    preparation: "1. Add gin, lemon juice, and simple syrup to a shaker with ice and shake well.\n2. Strain into an Old-Fashioned glass filled with crushed ice.\n3. Gently drizzle the Crème de Mûre over the top so it bleeds down through the ice.\n4. Garnish with a fresh blackberry and a lemon slice.",
    related_classics: [
      { name: "Gimlet", slug: "gimlet", note: "Gin sour base" }
    ]
  },
  {
    name: "White Russian",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Vodka", measure: "2 oz" },
      { name: "Coffee Liqueur", measure: "1 oz" },
      { name: "Heavy Cream", measure: "1 oz" }
    ],
    flavor_tags: ["Rich", "Creamy", "Sweet"],
    lore: "A decadent, dessert-like indulgence that unexpectedly became an enduring pop culture icon. It is a plush, velvet-textured blanket of cream resting softly over a dark, caffeinated vodka base.",
    preparation: "1. Fill an Old-Fashioned glass with large ice cubes.\n2. Pour in the vodka and coffee liqueur.\n3. Gently pour the heavy cream over the back of a spoon to float it on top.\n4. Stir gently before drinking.",
    related_classics: [
      { name: "Espresso Martini", slug: "espresso-martini", note: "Coffee vodka sibling" }
    ]
  },
  {
    name: "Caipirinha",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Cachaça", measure: "2 oz" },
      { name: "Fresh Lime", measure: "Half, cut into wedges" },
      { name: "Fine Sugar", measure: "2 tsp" }
    ],
    flavor_tags: ["Tart", "Agricole", "Vibrant"],
    lore: "The national spirit of Brazil in its most pure, unadulterated form. The rough muddling of lime wedges extracts bitter aromatic oils from the skin, perfectly balancing the raw, grassy heat of the cachaça.",
    preparation: "1. Place the lime wedges and sugar into an Old-Fashioned glass.\n2. Muddle aggressively to dissolve the sugar and extract the lime oils.\n3. Fill the glass to the brim with crushed ice.\n4. Pour in the cachaça and stir well from the bottom up.",
    related_classics: [
      { name: "Mojito", slug: "mojito", note: "Cuban muddled cousin" },
      { name: "Daiquiri", slug: "daiquiri", note: "Rum sour equivalent" }
    ]
  },
  {
    name: "Amaretto Sour",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Amaretto Liqueur", measure: "1.5 oz" },
      { name: "Cask-Proof Bourbon", measure: "0.75 oz" },
      { name: "Fresh Lemon Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.25 oz" },
      { name: "Egg White", measure: "0.5 oz" }
    ],
    flavor_tags: ["Nutty", "Sweet", "Silky"],
    lore: "A misunderstood classic rescued by modern bartenders. The addition of high-proof bourbon cuts through the cloying sweetness of the almond liqueur, while egg white provides a magnificent, meringue-like texture.",
    preparation: "1. Add all ingredients to a shaker without ice.\n2. Dry shake vigorously for 15 seconds to whip the egg white.\n3. Add ice and shake again until very cold.\n4. Strain into an Old-Fashioned glass over fresh ice.\n5. Garnish with a brandied cherry.",
    related_classics: [
      { name: "Whiskey Sour", slug: "whiskey-sour", note: "Traditional base" }
    ]
  },
  {
    name: "Dirty Martini",
    glass: "Martini",
    ingredients: [
      { name: "Vodka or Gin", measure: "2.5 oz" },
      { name: "Dry Vermouth", measure: "0.5 oz" },
      { name: "Olive Brine", measure: "0.5 oz" }
    ],
    flavor_tags: ["Savory", "Salty", "Potent"],
    lore: "A polarizing, savory rebellion against the purity of the classic dry martini. The infusion of olive brine transforms a crystalline spirit into a cloudy, deeply umami elixir.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the spirit, vermouth, and olive brine.\n3. Stir until properly chilled and slightly diluted.\n4. Strain into a chilled martini glass.\n5. Garnish with three plump olives on a cocktail pick.",
    related_classics: [
      { name: "Dry Martini", slug: "dry-martini", note: "The pristine original" }
    ]
  },
  {
    name: "Stinger",
    glass: "Coupe",
    ingredients: [
      { name: "Cognac", measure: "2 oz" },
      { name: "White Crème de Menthe", measure: "1 oz" }
    ],
    flavor_tags: ["Minty", "Rich", "Aromatic"],
    lore: "A pre-prohibition nightcap favored by high society aristocrats. It is a surprisingly bracing digestive that pits the deep, oaky warmth of French brandy against an icy blast of sweet mint.",
    preparation: "1. Add the Cognac and white crème de menthe to a mixing glass with ice.\n2. Stir well until chilled.\n3. Strain into a chilled coupe glass.\n4. No garnish is strictly necessary, though a mint leaf is acceptable.",
    related_classics: [
      { name: "Old Fashioned", slug: "old-fashioned", note: "Spirit-forward sibling" }
    ]
  },
  {
    name: "Pegu Club",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Orange Liqueur", measure: "0.75 oz" },
      { name: "Fresh Lime Juice", measure: "0.75 oz" },
      { name: "Angostura Bitters", measure: "1 dash" },
      { name: "Orange Bitters", measure: "1 dash" }
    ],
    flavor_tags: ["Botanical", "Tart", "Complex"],
    lore: "The signature drink of the British colonial club in Rangoon, Burma. It is an impeccably balanced, sharply acidic palate cleanser designed to cut through the oppressive heat of the tropics.",
    preparation: "1. Add all ingredients to a shaker with ice.\n2. Shake vigorously until chilled.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a lime twist.",
    related_classics: [
      { name: "Margarita", slug: "margarita", note: "Agave equivalent" },
      { name: "Gimlet", slug: "gimlet", note: "Simpler gin sour" }
    ]
  },
  {
    name: "Salty Dog",
    glass: "Highball",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Fresh Grapefruit Juice", measure: "4 oz" },
      { name: "Coarse Salt", measure: "Rim" }
    ],
    flavor_tags: ["Bitter", "Salty", "Citrusy"],
    lore: "A mid-century evolution of the Greyhound. The ingenious addition of a salted rim acts as a culinary bridge, suppressing the bitter compounds of the grapefruit while amplifying its bright, tart flavor.",
    preparation: "1. Wet the rim of a highball glass with grapefruit and dip it in coarse salt.\n2. Fill the prepared glass with ice.\n3. Pour in the gin and grapefruit juice.\n4. Stir gently to combine.\n5. Garnish with a grapefruit slice.",
    related_classics: [
      { name: "Paloma", slug: "paloma", note: "Agave & grapefruit variant" }
    ]
  }
];

function getRole(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();
    if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('rye') || lower.includes('gin') || lower.includes('tequila') || lower.includes('rum') || lower.includes('vodka') || lower.includes('champagne') || lower.includes('prosecco') || lower.includes('pisco') || lower.includes('scotch') || lower.includes('cachaça') || lower.includes('cognac')) return 'base_spirit';
    if (lower.includes('lemon') || lower.includes('lime')) return 'citrus';
    if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('agave')) return 'sweetener';
    if (lower.includes('cherry') || lower.includes('olive') || lower.includes('twist') || lower.includes('wheel') || lower.includes('bean') || lower.includes('mint') || lower.includes('peel') || lower.includes('wedge') || lower.includes('slice')) return 'garnish';
    return 'modifier';
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Starting Batch 3 seeding process...");
  
  for (const cocktail of batch3Classics) {
    console.log(`\nProcessing Cocktail: ${cocktail.name}`);
    
    // 1. Map tags and lore to DB schema structure
    const flavorTags = cocktail.flavor_tags.map(t => ({
      label: t,
      slug: generateSlug(t)
    }));
    
    const loreJson = { text: cocktail.lore, source: "Timeless Archive" };
    
    // 2. Upsert Cocktail (matching by 'name' as it's UNIQUE in schema)
    const { data: cocktailData, error: cocktailError } = await supabase
      .from('cocktails')
      .upsert({
        name: cocktail.name,
        glass_type: cocktail.glass,
        instructions: cocktail.preparation, // Preserves \n seamlessly
        flavor_tags: flavorTags,
        lore: loreJson,
        related_classics: cocktail.related_classics // Mapped directly to JSONB column
      }, { onConflict: 'name' })
      .select('id')
      .single();
      
    if (cocktailError || !cocktailData) {
      console.error(`[ERROR] Failed to upsert cocktail ${cocktail.name}:`, cocktailError);
      continue;
    }
    
    const cocktailId = cocktailData.id;
    console.log(`✓ Upserted cocktail ${cocktail.name} (${cocktailId})`);

    // 2.5 Delete existing relations for a clean slate on this cocktail
    const { error: deleteError } = await supabase
      .from('cocktail_ingredients')
      .delete()
      .eq('cocktail_id', cocktailId);
      
    if (deleteError) {
      console.error(`[ERROR] Failed to clear old ingredients for ${cocktail.name}:`, deleteError);
    } else {
      console.log(`  ✓ Cleared existing ingredient links`);
    }

    // 3. Process Ingredients
    for (const ing of cocktail.ingredients) {
      const ingSlug = generateSlug(ing.name);
      
      const { data: ingData, error: ingError } = await supabase
        .from('ingredients')
        .upsert({
          name: ing.name,
          slug: ingSlug,
        }, { onConflict: 'name' })
        .select('id')
        .single();
        
      if (ingError || !ingData) {
        console.error(`[ERROR] Failed to upsert ingredient ${ing.name}:`, ingError);
        continue;
      }
      
      const ingredientId = ingData.id;
      
      // 4. Create Relational Link
      const { error: linkError } = await supabase
        .from('cocktail_ingredients')
        .upsert({
          cocktail_id: cocktailId,
          ingredient_id: ingredientId,
          amount: ing.measure, // Required by the app's current implementation
          measure: ing.measure,
          role: getRole(ing.name),
          is_essential: true
        }, { onConflict: 'cocktail_id,ingredient_id' });
        
      if (linkError) {
        console.error(`[ERROR] Failed to link ${ing.name} to ${cocktail.name}:`, linkError);
      } else {
        console.log(`  ✓ Linked ${ing.name} (${ing.measure})`);
      }
    }
  }
  
  console.log("\nBatch 3 seeding complete! ✅");
}

main().catch(console.error);
