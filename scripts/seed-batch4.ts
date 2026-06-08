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

const batch4Classics = [
  {
    name: "Aviation",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Maraschino Liqueur", measure: "0.5 oz" },
      { name: "Crème de Violette", measure: "0.25 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" }
    ],
    flavor_tags: ["Floral", "Tart", "Botanical"],
    lore: "Created in 1916 by Hugo Ensslin in New York. The addition of Crème de Violette gives this sharp, floral gin sour a mesmerizing sky-blue hue, capturing the early romance of flight.",
    preparation: "1. Add the gin, maraschino liqueur, crème de violette, and lemon juice to a shaker.\n2. Fill with ice and shake vigorously.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a brandied cherry dropped to the bottom.",
    related_classics: [
      { name: "Gimlet", slug: "gimlet", note: "Simpler gin sour" },
      { name: "Last Word", slug: "last-word", note: "Complex gin classic" }
    ]
  },
  {
    name: "Martinez",
    glass: "Coupe",
    ingredients: [
      { name: "Old Tom Gin", measure: "1.5 oz" },
      { name: "Sweet Vermouth", measure: "1.5 oz" },
      { name: "Maraschino Liqueur", measure: "0.25 oz" },
      { name: "Angostura Bitters", measure: "2 dashes" }
    ],
    flavor_tags: ["Sweet", "Botanical", "Complex"],
    lore: "Widely considered the evolutionary missing link between the Manhattan and the Martini. The use of slightly sweetened Old Tom gin paired with rich vermouth creates a luscious, historical profile.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the Old Tom gin, sweet vermouth, maraschino liqueur, and bitters.\n3. Stir until well-chilled and properly diluted.\n4. Strain into a chilled coupe glass.\n5. Garnish with an orange twist.",
    related_classics: [
      { name: "Manhattan", slug: "manhattan", note: "Whiskey cousin" },
      { name: "Dry Martini", slug: "dry-martini", note: "Dry gin descendant" }
    ]
  },
  {
    name: "Last Word",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "0.75 oz" },
      { name: "Green Chartreuse", measure: "0.75 oz" },
      { name: "Maraschino Liqueur", measure: "0.75 oz" },
      { name: "Fresh Lime Juice", measure: "0.75 oz" }
    ],
    flavor_tags: ["Herbal", "Tart", "Potent"],
    lore: "A Prohibition-era marvel from the Detroit Athletic Club that fell into obscurity before a massive 21st-century revival. Its equal-parts formula yields an aggressively herbaceous and unforgettable sharp bite.",
    preparation: "1. Add the gin, Green Chartreuse, maraschino liqueur, and lime juice to a shaker.\n2. Fill with ice and shake vigorously.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a brandied cherry.",
    related_classics: [
      { name: "Aviation", slug: "aviation", note: "Maraschino & gin sibling" },
      { name: "Paper Plane", slug: "paper-plane", note: "Modern equal-parts riff" }
    ]
  },
  {
    name: "Sidecar",
    glass: "Coupe",
    ingredients: [
      { name: "Cognac", measure: "2 oz" },
      { name: "Orange Liqueur", measure: "0.75 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" },
      { name: "Fine Sugar", measure: "Rim" }
    ],
    flavor_tags: ["Citrusy", "Rich", "Tart"],
    lore: "Born in Paris during the roaring twenties, purportedly named after an eccentric American captain's motorcycle attachment. The sugared rim is essential to balance the austere dryness of the cognac and lemon.",
    preparation: "1. Rim a chilled coupe glass with fine sugar.\n2. Add the cognac, orange liqueur, and lemon juice to a shaker.\n3. Fill with ice and shake vigorously.\n4. Double strain into the prepared glass.\n5. Garnish with an orange twist.",
    related_classics: [
      { name: "Margarita", slug: "margarita", note: "Tequila equivalent" },
      { name: "White Lady", slug: "white-lady", note: "Gin variant" }
    ]
  },
  {
    name: "Blood and Sand",
    glass: "Coupe",
    ingredients: [
      { name: "Blended Scotch Whisky", measure: "0.75 oz" },
      { name: "Sweet Vermouth", measure: "0.75 oz" },
      { name: "Cherry Heering", measure: "0.75 oz" },
      { name: "Fresh Orange Juice", measure: "0.75 oz" }
    ],
    flavor_tags: ["Fruity", "Smoky", "Sweet"],
    lore: "Named after Rudolph Valentino's 1922 bullfighter movie. It is one of the few classic cocktails that successfully tames the smoky bite of Scotch with vibrant citrus and deep cherry sweetness.",
    preparation: "1. Add the Scotch, sweet vermouth, Cherry Heering, and orange juice to a shaker.\n2. Fill with ice and shake vigorously to aerate the juice.\n3. Double strain into a chilled coupe glass.\n4. Garnish with a flamed orange peel or a brandied cherry.",
    related_classics: [
      { name: "Rob Roy", slug: "rob-roy", note: "Classic Scotch & vermouth" }
    ]
  },
  {
    name: "Vieux Carré",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Rye Whiskey", measure: "0.75 oz" },
      { name: "Cognac", measure: "0.75 oz" },
      { name: "Sweet Vermouth", measure: "0.75 oz" },
      { name: "Bénédictine", measure: "1 tsp" },
      { name: "Peychaud's Bitters", measure: "2 dashes" },
      { name: "Angostura Bitters", measure: "2 dashes" }
    ],
    flavor_tags: ["Complex", "Herbal", "Spirit-Forward"],
    lore: "Created in the 1930s at the Hotel Monteleone in New Orleans. The name translates to 'Old Square,' perfectly reflecting the rich, multicultural, and fiercely potent character of the French Quarter.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the rye, cognac, sweet vermouth, Bénédictine, and both bitters.\n3. Stir until exceptionally cold.\n4. Strain into an Old-Fashioned glass over a large ice cube.\n5. Garnish with a lemon twist and a cherry.",
    related_classics: [
      { name: "Sazerac", slug: "sazerac", note: "New Orleans sibling" },
      { name: "Manhattan", slug: "manhattan", note: "Simpler whiskey classic" }
    ]
  },
  {
    name: "Hanky Panky",
    glass: "Coupe",
    ingredients: [
      { name: "London Dry Gin", measure: "1.5 oz" },
      { name: "Sweet Vermouth", measure: "1.5 oz" },
      { name: "Fernet-Branca", measure: "2 dashes" }
    ],
    flavor_tags: ["Bitter", "Botanical", "Complex"],
    lore: "Conceived by Ada Coleman, head bartender at the Savoy Hotel in the early 1900s. The strategic drops of intensely bitter Fernet-Branca elevate a simple gin and vermouth mix into absolute alchemy.",
    preparation: "1. Fill a mixing glass with ice.\n2. Add the gin, sweet vermouth, and Fernet-Branca.\n3. Stir until thoroughly chilled.\n4. Strain into a chilled coupe glass.\n5. Express the oils from an orange peel over the glass and drop it in.",
    related_classics: [
      { name: "Martinez", slug: "martinez", note: "Gin & vermouth base" },
      { name: "Negroni", slug: "negroni", note: "Bitter gin classic" }
    ]
  },
  {
    name: "Paper Plane",
    glass: "Coupe",
    ingredients: [
      { name: "Bourbon", measure: "0.75 oz" },
      { name: "Amaro Nonino", measure: "0.75 oz" },
      { name: "Aperol", measure: "0.75 oz" },
      { name: "Fresh Lemon Juice", measure: "0.75 oz" }
    ],
    flavor_tags: ["Bittersweet", "Citrusy", "Modern"],
    lore: "A modern masterpiece crafted by Sam Ross in 2007. Named after the M.I.A. song, this equal-parts marvel strikes a breathtaking balance between the oak of bourbon and the bittersweet complexity of Italian amari.",
    preparation: "1. Add the bourbon, Amaro Nonino, Aperol, and lemon juice to a shaker.\n2. Fill with ice and shake vigorously.\n3. Double strain into a chilled coupe glass.\n4. No garnish is needed, but a small lemon twist is acceptable.",
    related_classics: [
      { name: "Last Word", slug: "last-word", note: "Equal-parts inspiration" },
      { name: "Aperol Spritz", slug: "aperol-spritz", note: "Aperol companion" }
    ]
  },
  {
    name: "Rusty Nail",
    glass: "Old-Fashioned",
    ingredients: [
      { name: "Blended Scotch Whisky", measure: "2 oz" },
      { name: "Drambuie", measure: "0.75 oz" }
    ],
    flavor_tags: ["Sweet", "Smoky", "Spirit-Forward"],
    lore: "The quintessential 1960s Rat Pack cooler. The rugged smoke of Scotch whisky is elegantly softened by Drambuie, a legendary liqueur flavored with heather honey, herbs, and spices.",
    preparation: "1. Fill an Old-Fashioned glass with a large ice cube.\n2. Pour in the Scotch and Drambuie.\n3. Stir gently until chilled and properly diluted.\n4. Garnish with a lemon twist.",
    related_classics: [
      { name: "Rob Roy", slug: "rob-roy", note: "Scotch classic" },
      { name: "Old Fashioned", slug: "old-fashioned", note: "Similar build" }
    ]
  },
  {
    name: "Tom Collins",
    glass: "Highball",
    ingredients: [
      { name: "London Dry Gin", measure: "2 oz" },
      { name: "Fresh Lemon Juice", measure: "1 oz" },
      { name: "Simple Syrup", measure: "0.5 oz" },
      { name: "Club Soda", measure: "Top" }
    ],
    flavor_tags: ["Refreshing", "Citrusy", "Effervescent"],
    lore: "The ultimate gin punch, immortalized in the late 19th century. Served tall over ice, it is a brilliantly simple, effervescent thirst-quencher that has outlived countless cocktail trends.",
    preparation: "1. Add the gin, lemon juice, and simple syrup to a shaker with ice.\n2. Shake briefly to chill.\n3. Strain into a highball glass filled with fresh ice.\n4. Top generously with club soda and stir gently.\n5. Garnish with a lemon wheel and a cherry.",
    related_classics: [
      { name: "French 75", slug: "french-75", note: "Champagne variant" },
      { name: "Gimlet", slug: "gimlet", note: "Gin sour base" }
    ]
  }
];

function getRole(ingredientName: string): string {
    const lower = ingredientName.toLowerCase();
    if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('rye') || lower.includes('gin') || lower.includes('tequila') || lower.includes('rum') || lower.includes('vodka') || lower.includes('champagne') || lower.includes('prosecco') || lower.includes('pisco') || lower.includes('scotch') || lower.includes('cachaça') || lower.includes('cognac')) return 'base_spirit';
    if (lower.includes('lemon') || lower.includes('lime') || lower.includes('orange juice')) return 'citrus';
    if (lower.includes('syrup') || lower.includes('sugar') || lower.includes('agave')) return 'sweetener';
    if (lower.includes('cherry') || lower.includes('olive') || lower.includes('twist') || lower.includes('wheel') || lower.includes('bean') || lower.includes('mint') || lower.includes('peel') || lower.includes('wedge') || lower.includes('slice')) return 'garnish';
    return 'modifier';
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Starting Batch 4 seeding process...");
  
  for (const cocktail of batch4Classics) {
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
  
  console.log("\nBatch 4 seeding complete! ✅");
}

main().catch(console.error);
