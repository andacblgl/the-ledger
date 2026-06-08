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

const batch2Classics = [
  {
    name: "Negroni",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "London Dry Gin", measure: "1 oz" },
      { name: "Campari", measure: "1 oz" },
      { name: "Sweet Vermouth", measure: "1 oz" }
    ],
    flavor_tags: ["Bittersweet", "Botanical", "Spirit-Forward"],
    lore: "First popularized in Florence in the early 20th century by Count Camillo Negroni. He famously asked his bartender to strengthen his Americano by swapping soda water for gin.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the gin, Campari, and sweet vermouth.\n3. Stir gently until well-chilled.\n4. Strain into an Old-Fashioned glass over a large ice cube.\n5. Garnish with an orange peel.",
    related_classics: [
      { name: "Boulevardier", slug: "boulevardier", note: "Whiskey variant" },
      { name: "Americano", slug: "americano", note: "Lighter aperitif" }
    ]
  },
  {
    name: "Boulevardier",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Bourbon or Rye Whiskey", measure: "1.25 oz" },
      { name: "Campari", measure: "1 oz" },
      { name: "Sweet Vermouth", measure: "1 oz" }
    ],
    flavor_tags: ["Rich", "Bittersweet", "Warming"],
    lore: "The melancholic, autumnal cousin of the Negroni, born in Paris during the roaring twenties. Substituting gin with American whiskey transforms it into a profound, fireside companion.",
    preparation: "1. Fill a mixing glass with ice.\n2. Pour in the whiskey, Campari, and sweet vermouth.\n3. Stir until the glass is extremely cold.\n4. Strain over fresh ice in an Old-Fashioned glass.\n5. Garnish with an orange twist.",
    related_classics: [
      { name: "Negroni", slug: "negroni", note: "Gin original" },
      { name: "Old Fashioned", slug: "old-fashioned", note: "Classic whiskey preparation" }
    ]
  },
  {
    name: "Mojito",
    glass: "Highball",
    ingredients: [
      { name: "Light Rum", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "0.75 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Fresh Mint", measure: "6-8 leaves" },
      { name: "Club Soda", measure: "Top" }
    ],
    flavor_tags: ["Minty", "Refreshing", "Citrusy"],
    lore: "An artifact of Havana's sultry nightlife. The gentle muddling of mint releases a verdant aroma that is instantly intoxicating, acting as the ultimate weapon against the heat.",
    preparation: "1. Place mint leaves and simple syrup in a shaker and muddle very gently.\n2. Add the rum, lime juice, and a handful of ice.\n3. Shake briefly just to chill.\n4. Strain into a highball glass filled with fresh ice.\n5. Top generously with club soda and garnish with a mint sprig.",
    related_classics: [
      { name: "Daiquiri", slug: "daiquiri", note: "Mint-free Cuban classic" }
    ]
  },
  {
    name: "Moscow Mule",
    glass: "Copper Mug",
    ingredients: [
      { name: "Vodka", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "0.5 oz" },
      { name: "Ginger Beer", measure: "4 oz" }
    ],
    flavor_tags: ["Spicy", "Effervescent", "Crisp"],
    lore: "A brilliant stroke of mid-century marketing that introduced America to vodka. Served in its iconic copper vessel, the biting spice of ginger beer meets the sharp cut of citrus.",
    preparation: "1. Fill a copper mug completely with ice.\n2. Pour in the vodka and fresh lime juice.\n3. Top with ginger beer.\n4. Stir gently to incorporate.\n5. Garnish with a lime wedge.",
    related_classics: [
      { name: "Dark 'n' Stormy", slug: "dark-n-stormy", note: "Rum variant" }
    ]
  },
  {
    name: "Cosmopolitan",
    glass: "Martini",
    ingredients: [
      { name: "Citrus Vodka", measure: "1.5 oz" },
      { name: "Orange Liqueur", measure: "1 oz" },
      { name: "Fresh Lime Juice", measure: "0.5 oz" },
      { name: "Cranberry Juice", measure: "0.25 oz" }
    ],
    flavor_tags: ["Tart", "Fruity", "Vibrant"],
    lore: "The blushing crown jewel of 1990s cocktail culture. Beyond its cinematic fame lies a sharply constructed sour, where a mere whisper of cranberry provides a dry, tannic backbone.",
    preparation: "1. Add the vodka, orange liqueur, lime juice, and cranberry juice to a shaker.\n2. Fill with ice and shake vigorously.\n3. Double strain into a chilled martini glass.\n4. Garnish with a flamed orange peel.",
    related_classics: [
      { name: "Margarita", slug: "margarita", note: "Tequila-based sour" },
      { name: "Gimlet", slug: "gimlet", note: "Gin & lime classic" }
    ]
  },
  {
    name: "Paloma",
    glass: "Highball",
    ingredients: [
      { name: "Blanco Tequila", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "0.5 oz" },
      { name: "Grapefruit Soda", measure: "Top" }
    ],
    flavor_tags: ["Agave", "Effervescent", "Tart"],
    lore: "Often overshadowed by the Margarita abroad, it remains the beloved, unpretentious champion of Mexico. The marriage of earthy agave and the bittersweet snap of grapefruit soda is effortless perfection.",
    preparation: "1. Rim a highball glass with salt (optional).\n2. Fill the glass with ice.\n3. Add the tequila and fresh lime juice.\n4. Top with grapefruit soda.\n5. Stir briefly and garnish with a grapefruit slice.",
    related_classics: [
      { name: "Margarita", slug: "margarita", note: "Classic agave sour" }
    ]
  },
  {
    name: "Penicillin",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Blended Scotch Whisky", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" },
      { name: "Honey-Ginger Syrup", measure: "0.75 oz" },
      { name: "Islay Single Malt Scotch", measure: "0.25 oz" }
    ],
    flavor_tags: ["Smoky", "Spicy", "Medicinal"],
    lore: "A 21st-century modern classic that demands attention. The restorative warmth of honey and ginger is dramatically blanketed by a heavy mist of peated Islay scotch.",
    preparation: "1. Add the blended scotch, lemon juice, and honey-ginger syrup to a shaker.\n2. Fill with ice and shake vigorously.\n3. Strain into an Old-Fashioned glass over fresh ice.\n4. Gently pour the Islay scotch over the back of a spoon to float it on top.\n5. Garnish with candied ginger.",
    related_classics: [
      { name: "Whiskey Sour", slug: "whiskey-sour", note: "Traditional base" }
    ]
  },
  {
    name: "Sazerac",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Rye Whiskey", measure: "2 oz" },
      { name: "Simple Syrup", measure: "0.25 oz" },
      { name: "Peychaud's Bitters", measure: "3 dashes" },
      { name: "Absinthe", measure: "Rinse" }
    ],
    flavor_tags: ["Anise", "Spirit-Forward", "Aromatic"],
    lore: "The official cocktail of New Orleans, steeped in alchemy and tradition. The ritualistic absinthe rinse coats the glass with an ethereal botanical ghost.",
    preparation: "1. Rinse a chilled Old-Fashioned glass with a splash of absinthe, discard the excess, and set aside.\n2. In a separate mixing glass, combine the rye whiskey, simple syrup, and bitters.\n3. Add ice and stir until perfectly chilled.\n4. Strain into the absinthe-rinsed glass.\n5. Express a lemon peel over the top and discard the peel.",
    related_classics: [
      { name: "Old Fashioned", slug: "old-fashioned", note: "Original template" }
    ]
  },
  {
    name: "Mai Tai",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Aged Jamaican Rum", measure: "1 oz" },
      { name: "Martinique Rhum Agricole", measure: "1 oz" },
      { name: "Orange Curaçao", measure: "0.5 oz" },
      { name: "Orgeat Syrup", measure: "0.5 oz" },
      { name: "Fresh Lime Juice", measure: "0.75 oz" }
    ],
    flavor_tags: ["Tropical", "Nutty", "Complex"],
    lore: "The undisputed monarch of Tiki culture. Stripped of its neon-colored resort variations, the original recipe is a profoundly complex and dry rum showcase.",
    preparation: "1. Combine all ingredients in a shaker.\n2. Add crushed ice and shake vigorously until frost forms on the outside.\n3. Pour the entire contents (unstrained) into an Old-Fashioned glass.\n4. Garnish lavishly with a spent lime shell and a sprig of fresh mint.",
    related_classics: [
      { name: "Daiquiri", slug: "daiquiri", note: "Classic rum sour" }
    ]
  },
  {
    name: "Pisco Sour",
    glass: "Coupe",
    ingredients: [
      { name: "Pisco", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Egg White", measure: "0.5 oz" }
    ],
    flavor_tags: ["Silky", "Floral", "Tart"],
    lore: "A frothy, botanical triumph of South American origin. The unaged grape brandy provides a highly aromatic canvas bound together by an impossibly silken texture.",
    preparation: "1. Add the pisco, lime juice, simple syrup, and egg white to a shaker without ice.\n2. Dry shake vigorously for 15 seconds to emulsify the egg white.\n3. Add ice and shake again until thoroughly chilled.\n4. Strain into a chilled coupe glass.\n5. Carefully place 3 drops of Angostura bitters on the foam as a garnish.",
    related_classics: [
      { name: "Whiskey Sour", slug: "whiskey-sour", note: "Similar texture profile" }
    ]
  }
];

function getRole(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();
    if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('rye') || lower.includes('gin') || lower.includes('tequila') || lower.includes('rum') || lower.includes('vodka') || lower.includes('champagne') || lower.includes('prosecco') || lower.includes('pisco') || lower.includes('scotch')) return 'base_spirit';
    if (lower.includes('lemon') || lower.includes('lime')) return 'citrus';
    if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('agave')) return 'sweetener';
    if (lower.includes('cherry') || lower.includes('olive') || lower.includes('twist') || lower.includes('wheel') || lower.includes('bean') || lower.includes('mint') || lower.includes('peel') || lower.includes('wedge') || lower.includes('slice')) return 'garnish';
    return 'modifier';
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Starting Batch 2 seeding process...");
  
  for (const cocktail of batch2Classics) {
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
  
  console.log("\nBatch 2 seeding complete! ✅");
}

main().catch(console.error);
