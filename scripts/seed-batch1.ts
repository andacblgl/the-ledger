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

const batch1Classics = [
  {
    name: "Old Fashioned",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Bourbon or Rye Whiskey", measure: "2 oz" },
      { name: "Simple Syrup", measure: "0.25 oz" },
      { name: "Angostura Bitters", measure: "2 dashes" }
    ],
    flavor_tags: ["Spirit-Forward", "Oak", "Aromatic"],
    lore: "The undisputed patriarch of the cocktail family. It is a slow, meditative libation that commands respect and rewards patience, marrying the raw fire of American whiskey with sophisticated botanical spice.",
    preparation: "1. Place the simple syrup and bitters in an Old-Fashioned glass.\n2. Add the whiskey and a large ice cube.\n3. Stir gently until well-chilled and diluted.\n4. Express the oils of an orange peel over the glass.\n5. Drop the peel in as a garnish.",
    related_classics: [
      { name: "Manhattan", slug: "manhattan", note: "Rye and vermouth cousin" },
      { name: "Sazerac", slug: "sazerac", note: "New Orleans variant" }
    ]
  },
  {
    name: "Manhattan",
    glass: "Coupe",
    ingredients: [
      { name: "Rye Whiskey", measure: "2 oz" },
      { name: "Sweet Vermouth", measure: "1 oz" },
      { name: "Angostura Bitters", measure: "2 dashes" }
    ],
    flavor_tags: ["Spirit-Forward", "Herbal", "Complex"],
    lore: "Born in the gaslit parlors of late 19th-century New York. It remains an enduring symbol of urbanity, balancing the agrarian bite of rye with the herbaceous velvet of Italian vermouth.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the rye whiskey, sweet vermouth, and bitters.\n3. Stir until thoroughly chilled.\n4. Strain into a chilled coupe glass.\n5. Garnish with a brandied cherry.",
    related_classics: [
      { name: "Boulevardier", slug: "boulevardier", note: "Campari variant" },
      { name: "Old Fashioned", slug: "old-fashioned", note: "Classic whiskey base" }
    ]
  },
  {
    name: "Dry Martini",
    glass: "Martini",
    ingredients: [
      { name: "London Dry Gin", measure: "2.5 oz" },
      { name: "Dry Vermouth", measure: "0.5 oz" },
      { name: "Orange Bitters", measure: "1 dash" }
    ],
    flavor_tags: ["Crisp", "Botanical", "Potent"],
    lore: "An icy, crystal-clear testament to the beauty of restraint. It is less a beverage and more an exercise in precision, demanding the utmost respect for temperature and ratio.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the London dry gin, dry vermouth, and orange bitters.\n3. Stir until bracingly cold.\n4. Strain into a chilled martini glass.\n5. Garnish with a lemon twist or an olive.",
    related_classics: [
      { name: "Gimlet", slug: "gimlet", note: "Gin & lime classic" }
    ]
  },
  {
    name: "Margarita",
    glass: "Coupe",
    ingredients: [
      { name: "Blanco Tequila", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "1 oz" },
      { name: "Orange Liqueur", measure: "0.5 oz" },
      { name: "Agave Syrup", measure: "0.25 oz" }
    ],
    flavor_tags: ["Citrusy", "Agave", "Refreshing"],
    lore: "A bright and spirited masterpiece from mid-century Mexico. It strikes a flawless equilibrium between tart citrus, sweet orange, and earthy agave.",
    preparation: "1. Rim a coupe glass with salt (optional).\n2. Add the tequila, lime juice, orange liqueur, and agave syrup to a shaker.\n3. Fill with ice and shake vigorously.\n4. Strain into the prepared glass.\n5. Garnish with a lime wheel.",
    related_classics: [
      { name: "Paloma", slug: "paloma", note: "Grapefruit variant" },
      { name: "Daiquiri", slug: "daiquiri", note: "Rum sour equivalent" }
    ]
  },
  {
    name: "Daiquiri",
    glass: "Coupe",
    ingredients: [
      { name: "Light Rum", measure: "2 oz" },
      { name: "Fresh Lime Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.75 oz" }
    ],
    flavor_tags: ["Crisp", "Tart", "Tropical"],
    lore: "Forged in the humid heat of a Cuban mining town. This sublime triad of rum, lime, and sugar strips away all pretense, leaving only transcendent refreshment.",
    preparation: "1. Add the light rum, fresh lime juice, and simple syrup to a shaker.\n2. Fill with ice and shake vigorously until the tin is frosted.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a lime wedge.",
    related_classics: [
      { name: "Mojito", slug: "mojito", note: "Mint highball variant" },
      { name: "Margarita", slug: "margarita", note: "Tequila cousin" }
    ]
  },
  {
    name: "Whiskey Sour",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Bourbon", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Egg White", measure: "0.5 oz" }
    ],
    flavor_tags: ["Silky", "Tart", "Rich"],
    lore: "A majestic survivor from the golden age of the American saloon. The inclusion of egg white transforms it from a simple sour into a luxurious, cloud-topped confection.",
    preparation: "1. Add the bourbon, lemon juice, simple syrup, and egg white to a shaker without ice.\n2. Dry shake vigorously for 15 seconds to emulsify the egg white.\n3. Add ice and shake again until thoroughly chilled.\n4. Strain into an Old-Fashioned glass over fresh ice.\n5. Meticulously garnish the foam with drops of Angostura bitters.",
    related_classics: [
      { name: "Penicillin", slug: "penicillin", note: "Scotch & ginger variant" },
      { name: "Pisco Sour", slug: "pisco-sour", note: "Pisco base" }
    ]
  },
  {
    name: "Gimlet",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Lime Cordial", measure: "0.75 oz" },
      { name: "Fresh Lime Juice", measure: "0.25 oz" }
    ],
    flavor_tags: ["Tart", "Botanical", "Sharp"],
    lore: "Originally prescribed to British sailors to ward off scurvy, it quickly evolved into a high-society staple. Its piercing citrus profile cuts through the fog of the mind.",
    preparation: "1. Add the gin, lime cordial, and fresh lime juice to a shaker.\n2. Fill with ice and shake vigorously.\n3. Strain into a chilled coupe glass.\n4. Garnish with a lime wheel.",
    related_classics: [
      { name: "Dry Martini", slug: "dry-martini", note: "Classic gin preparation" },
      { name: "Cosmopolitan", slug: "cosmopolitan", note: "Vodka & cranberry variant" }
    ]
  },
  {
    name: "French 75",
    glass: "Flute",
    ingredients: [
      { name: "London Dry Gin", measure: "1 oz" },
      { name: "Fresh Lemon Juice", measure: "0.5 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Champagne", measure: "3 oz" }
    ],
    flavor_tags: ["Effervescent", "Citrusy", "Celebratory"],
    lore: "Named after the formidable French 75mm field gun of World War I. It is the epitome of roaring twenties exuberance, pairing the botanical austerity of gin with decadent fizz.",
    preparation: "1. Add the gin, lemon juice, and simple syrup to a shaker.\n2. Fill with ice and shake well to chill.\n3. Strain into a chilled flute.\n4. Top gracefully with Champagne.\n5. Garnish with a lemon twist.",
    related_classics: [
      { name: "Tom Collins", slug: "tom-collins", note: "Tall gin sour" }
    ]
  },
  {
    name: "Aperol Spritz",
    glass: "Wine Glass",
    ingredients: [
      { name: "Aperol", measure: "2 oz" },
      { name: "Prosecco", measure: "3 oz" },
      { name: "Club Soda", measure: "1 oz" }
    ],
    flavor_tags: ["Bittersweet", "Effervescent", "Light"],
    lore: "The quintessential aperitivo, effortlessly invoking the Mediterranean twilight. It gently stimulates the appetite with botanical bitterness and lively effervescence.",
    preparation: "1. Fill a large wine glass with ice.\n2. Pour in the Aperol and Prosecco.\n3. Add the club soda.\n4. Stir gently to combine.\n5. Garnish with a fresh orange slice.",
    related_classics: [
      { name: "Negroni", slug: "negroni", note: "Stronger aperitif" },
      { name: "Americano", slug: "americano", note: "Campari & soda" }
    ]
  },
  {
    name: "Espresso Martini",
    glass: "Coupe",
    ingredients: [
      { name: "Vodka", measure: "2 oz" },
      { name: "Coffee Liqueur", measure: "1 oz" },
      { name: "Fresh Espresso", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.25 oz" }
    ],
    flavor_tags: ["Rich", "Roasted", "Energizing"],
    lore: "Conceived in the neon-lit frenzy of 1980s London, this modern classic was born to wake the senses. A luxurious synthesis of stark vodka and deep, roasted espresso.",
    preparation: "1. Add the vodka, coffee liqueur, fresh espresso, and simple syrup to a shaker.\n2. Fill with ice and shake vigorously to achieve a thick, foamy head.\n3. Double strain into a chilled coupe glass.\n4. Garnish with three coffee beans.",
    related_classics: [
      { name: "White Russian", slug: "white-russian", note: "Creamy coffee classic" }
    ]
  }
];

function getRole(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();
    if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('rye') || lower.includes('gin') || lower.includes('tequila') || lower.includes('rum') || lower.includes('vodka') || lower.includes('champagne') || lower.includes('prosecco')) return 'base_spirit';
    if (lower.includes('lemon') || lower.includes('lime')) return 'citrus';
    if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('agave')) return 'sweetener';
    if (lower.includes('cherry') || lower.includes('olive') || lower.includes('twist') || lower.includes('wheel') || lower.includes('bean')) return 'garnish';
    return 'modifier';
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Starting Batch 1 seeding process...");
  
  for (const cocktail of batch1Classics) {
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
        instructions: cocktail.preparation,
        flavor_tags: flavorTags,
        lore: loreJson,
        related_classics: cocktail.related_classics
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
  
  console.log("\nBatch 1 seeding complete! ✅");
}

main().catch(console.error);
