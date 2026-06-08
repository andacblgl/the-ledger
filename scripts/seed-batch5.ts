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

const batch5Classics = [
  {
    name: "Piña Colada",
    glass: "Highball",
    ingredients: [
      { name: "Light Rum", measure: "2 oz" },
      { name: "Cream of Coconut", measure: "1.5 oz" },
      { name: "Fresh Pineapple Juice", measure: "1.5 oz" },
      { name: "Fresh Lime Juice", measure: "0.5 oz" }
    ],
    flavor_tags: ["Tropical", "Creamy", "Sweet"],
    lore: "Created in 1954 at the Caribe Hilton in San Juan. Stripped of artificial slushy mixers, a properly crafted Piña Colada is a luxurious, velvety wave of island escapism.",
    preparation: "1. Add all ingredients to a shaker with plenty of ice.\n2. Shake vigorously until extremely cold and frothy.\n3. Strain into a tall highball glass filled with fresh ice.\n4. Garnish with a pineapple wedge and a cocktail umbrella.",
    related_classics: [
      { name: "Daiquiri", slug: "daiquiri", note: "Classic rum sour" },
      { name: "Mai Tai", slug: "mai-tai", note: "Tiki heavyweight" }
    ]
  },
  {
    name: "Dark 'n' Stormy",
    glass: "Highball",
    ingredients: [
      { name: "Dark Rum", measure: "2 oz" },
      { name: "Ginger Beer", measure: "3 oz" },
      { name: "Fresh Lime Juice", measure: "0.5 oz" }
    ],
    flavor_tags: ["Spicy", "Refreshing", "Rich"],
    lore: "The official drink of Bermuda, fiercely guarded by trademark. The ominous cloud of dark rum floating over biting ginger beer mirrors the turbulent Atlantic weather that surrounds its birthplace.",
    preparation: "1. Fill a highball glass with ice.\n2. Pour in the ginger beer and fresh lime juice.\n3. Gently pour the dark rum over the back of a spoon so it floats on top.\n4. Garnish with a lime wedge.",
    related_classics: [
      { name: "Moscow Mule", slug: "moscow-mule", note: "Vodka & ginger equivalent" }
    ]
  },
  {
    name: "Mint Julep",
    glass: "Copper Mug",
    ingredients: [
      { name: "Bourbon", measure: "2.5 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Fresh Mint", measure: "8-10 leaves" }
    ],
    flavor_tags: ["Minty", "Spirit-Forward", "Sweet"],
    lore: "The undisputed monarch of the American South. Served in a frosty metal cup, it forces the drinker to bury their nose in bruised mint, delivering an aromatic shock before the bourbon hits.",
    preparation: "1. Place the mint leaves and simple syrup in the bottom of a Julep cup.\n2. Muddle gently to release the mint oils without shredding the leaves.\n3. Add the bourbon and pack the cup tightly with crushed ice.\n4. Stir rapidly until the outside of the cup frosts over.\n5. Top with more crushed ice and garnish with a lavish bouquet of mint.",
    related_classics: [
      { name: "Old Fashioned", slug: "old-fashioned", note: "Classic bourbon preparation" },
      { name: "Mojito", slug: "mojito", note: "Rum & mint highball" }
    ]
  },
  {
    name: "Clover Club",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "0.5 oz" },
      { name: "Raspberry Syrup", measure: "0.5 oz" },
      { name: "Egg White", measure: "0.5 oz" }
    ],
    flavor_tags: ["Fruity", "Silky", "Tart"],
    lore: "Named after a pre-Prohibition men's club in Philadelphia. Beneath its delicate, blushing pink foam lies a sturdy, sharp, and intensely botanical gin sour.",
    preparation: "1. Add the gin, lemon juice, raspberry syrup, and egg white to a shaker without ice.\n2. Dry shake vigorously to emulsify the egg white.\n3. Add ice and shake again until chilled.\n4. Double strain into a chilled coupe glass.\n5. Garnish with a few fresh raspberries on a pick.",
    related_classics: [
      { name: "Gimlet", slug: "gimlet", note: "Gin sour base" },
      { name: "Whiskey Sour", slug: "whiskey-sour", note: "Similar egg white texture" }
    ]
  },
  {
    name: "Rob Roy",
    glass: "Coupe",
    ingredients: [
      { name: "Blended Scotch Whisky", measure: "2 oz" },
      { name: "Sweet Vermouth", measure: "1 oz" },
      { name: "Angostura Bitters", measure: "2 dashes" }
    ],
    flavor_tags: ["Smoky", "Rich", "Spirit-Forward"],
    lore: "Created at the Waldorf Astoria in 1894. By swapping the rye of a Manhattan for the peaty depth of Scotch whisky, it takes on a rugged, heather-scented complexity.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the Scotch whisky, sweet vermouth, and bitters.\n3. Stir until properly chilled and diluted.\n4. Strain into a chilled coupe glass.\n5. Garnish with a brandied cherry.",
    related_classics: [
      { name: "Manhattan", slug: "manhattan", note: "The American cousin" },
      { name: "Rusty Nail", slug: "rusty-nail", note: "Scotch companion" }
    ]
  },
  {
    name: "French Martini",
    glass: "Coupe",
    ingredients: [
      { name: "Vodka", measure: "2 oz" },
      { name: "Pineapple Juice", measure: "1.5 oz" },
      { name: "Chambord", measure: "0.5 oz" }
    ],
    flavor_tags: ["Fruity", "Velvet", "Sweet"],
    lore: "A product of the late 1980s cocktail renaissance in New York. The vigorous shaking of pineapple juice creates a luxurious, frothy crown over a deep purple, raspberry-laced elixir.",
    preparation: "1. Add the vodka, pineapple juice, and Chambord to a shaker.\n2. Fill with ice and shake exceptionally hard to create a thick foam.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a single raspberry.",
    related_classics: [
      { name: "Espresso Martini", slug: "espresso-martini", note: "Modern classic sibling" },
      { name: "Aviation", slug: "aviation", note: "Classic purple floral" }
    ]
  },
  {
    name: "Bellini",
    glass: "Flute",
    ingredients: [
      { name: "White Peach Purée", measure: "2 oz" },
      { name: "Prosecco", measure: "4 oz" }
    ],
    flavor_tags: ["Fruity", "Effervescent", "Light"],
    lore: "Invented by Giuseppe Cipriani at Harry's Bar in Venice, 1948. Named after the Venetian artist Giovanni Bellini, this delicate fusion of fresh peach and dry prosecco is pure romance.",
    preparation: "1. Add the cold white peach purée to the bottom of a chilled flute.\n2. Slowly top with Prosecco to prevent it from overflowing.\n3. Gently stir to integrate the purée with the wine.\n4. Garnish with a slice of fresh peach.",
    related_classics: [
      { name: "Aperol Spritz", slug: "aperol-spritz", note: "Italian prosecco classic" },
      { name: "French 75", slug: "french-75", note: "Champagne cocktail" }
    ]
  },
  {
    name: "Zombie",
    glass: "Highball",
    ingredients: [
      { name: "Jamaican Rum", measure: "1 oz" },
      { name: "Puerto Rican Gold Rum", measure: "1.5 oz" },
      { name: "Overproof Rum", measure: "0.5 oz" },
      { name: "Fresh Lime Juice", measure: "0.75 oz" },
      { name: "Grapefruit Juice", measure: "0.5 oz" },
      { name: "Cinnamon Syrup", measure: "0.5 oz" }
    ],
    flavor_tags: ["Potent", "Tropical", "Complex"],
    lore: "Don the Beachcomber's notorious 1934 creation. Famously limited to two per customer, it is an unapologetically lethal blend of rums masked by an intricate web of tropical spices and citrus.",
    preparation: "1. Add all ingredients to a shaker.\n2. Fill with crushed ice and shake vigorously.\n3. Pour the entire contents (unstrained) into a tall Tiki or highball glass.\n4. Garnish lavishly with mint and a grapefruit slice.",
    related_classics: [
      { name: "Mai Tai", slug: "mai-tai", note: "Tiki monarch" }
    ]
  },
  {
    name: "Irish Coffee",
    glass: "Irish Coffee Mug",
    ingredients: [
      { name: "Irish Whiskey", measure: "1.5 oz" },
      { name: "Hot Brewed Coffee", measure: "4 oz" },
      { name: "Brown Sugar Syrup", measure: "0.5 oz" },
      { name: "Lightly Whipped Cream", measure: "Float" }
    ],
    flavor_tags: ["Warming", "Caffeinated", "Rich"],
    lore: "Conceived at a freezing airbase in Ireland to warm weary transatlantic travelers. Drinking hot, spiked coffee through a collar of ice-cold cream is a profound textural experience.",
    preparation: "1. Warm a glass mug with hot water, then discard the water.\n2. Add the Irish whiskey and brown sugar syrup to the glass.\n3. Pour in the hot coffee and stir to combine.\n4. Gently pour the lightly whipped cream over the back of a spoon to float it on top.\n5. Do not stir before drinking.",
    related_classics: [
      { name: "Espresso Martini", slug: "espresso-martini", note: "Cold coffee variant" },
      { name: "White Russian", slug: "white-russian", note: "Creamy coffee classic" }
    ]
  },
  {
    name: "Gin Fizz",
    glass: "Highball",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Egg White", measure: "0.5 oz" },
      { name: "Club Soda", measure: "Top" }
    ],
    flavor_tags: ["Effervescent", "Silky", "Citrusy"],
    lore: "The effervescent cousin of the gin sour. The addition of soda water lifts the heavy egg white foam completely above the rim of the glass like a crisp, white cumulus cloud.",
    preparation: "1. Add the gin, lemon juice, simple syrup, and egg white to a shaker without ice.\n2. Dry shake vigorously for 15 seconds.\n3. Add ice and shake again until very cold.\n4. Strain into a tall highball glass (no ice).\n5. Simultaneously pour the club soda from high above to lift the foam above the rim.",
    related_classics: [
      { name: "Tom Collins", slug: "tom-collins", note: "No egg-white variant" },
      { name: "Gimlet", slug: "gimlet", note: "Gin sour base" }
    ]
  }
];

function getRole(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();
    if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('rye') || lower.includes('gin') || lower.includes('tequila') || lower.includes('rum') || lower.includes('vodka') || lower.includes('champagne') || lower.includes('prosecco') || lower.includes('pisco') || lower.includes('scotch') || lower.includes('cachaça') || lower.includes('cognac')) return 'base_spirit';
    if (lower.includes('lemon') || lower.includes('lime') || lower.includes('orange juice') || lower.includes('pineapple juice') || lower.includes('grapefruit juice')) return 'citrus';
    if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('agave') || lower.includes('purée')) return 'sweetener';
    if (lower.includes('cherry') || lower.includes('olive') || lower.includes('twist') || lower.includes('wheel') || lower.includes('bean') || lower.includes('mint') || lower.includes('peel') || lower.includes('wedge') || lower.includes('slice')) return 'garnish';
    return 'modifier';
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Starting Batch 5 seeding process...");
  
  for (const cocktail of batch5Classics) {
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
  
  console.log("\nBatch 5 seeding complete! ✅");
}

main().catch(console.error);
