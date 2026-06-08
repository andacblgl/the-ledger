import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables. Please check your .env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ingredientMetadata = [
  {
    name: 'Gin',
    slug: 'gin',
    description: "The botanical backbone of cocktail culture. Born from Dutch Jenever and refined in London, this juniper-forward spirit provides a crystalline, aromatic canvas that defines the structural integrity of the Martini and the Negroni.",
    image_url: "https://images.unsplash.com/photo-1606775927503-45fa8790089a?w=400&q=80"
  },
  {
    name: 'Campari',
    slug: 'campari',
    description: "A brilliant ruby-red Italian amaro defined by its uncompromising, bitter-sweet complexity. Infused with a secret blend of herbs and fruit, it is the uncompromising soul of the aperitivo hour.",
    image_url: "https://images.unsplash.com/photo-1555581920-53dbce9f75ec?w=400&q=80"
  },
  {
    name: 'Sweet Vermouth',
    slug: 'sweet-vermouth',
    description: "A fortified wine aromatized with a complex array of botanicals. Originating from Turin, its rich, spiced sweetness acts as the vital bridge connecting bold spirits in classic cocktails like the Manhattan.",
    image_url: "https://images.unsplash.com/photo-1560508180-03f285f67ed1?w=400&q=80"
  }
];

async function seedIngredients() {
  console.log("Seeding Phase 4 Ingredient Metadata...");

  for (const item of ingredientMetadata) {
    const searchName = item.name;
    console.log(`\nSearching database for '%${searchName}%'...`);
    
    // 1. Fetch before updating to see what matches
    const { data: found, error: searchError } = await supabase
      .from('ingredients')
      .select('id, name')
      .ilike('name', `%${searchName}%`);

    if (searchError) {
      console.error(`❌ Search failed for ${searchName}:`, searchError.message);
      continue;
    }

    if (!found || found.length === 0) {
      console.log(`⚠️ No ingredient found matching '%${searchName}%'`);
      continue;
    }

    console.log(`🔍 Found matches:`, found.map(i => i.name).join(', '));
    
    // 2. Safely pick the EXACT match to update
    const target = found.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    
    if (!target) {
        console.log(`⚠️ No EXACT match found for '${item.name}'. Skipping.`);
        continue;
    }

    console.log(`Updating '${target.name}' with new metadata...`);

    const { data: updatedRows, error: updateError } = await supabase
      .from('ingredients')
      .update({
        slug: item.slug,
        description: item.description,
        image_url: item.image_url
      })
      .eq('id', target.id)
      .select('id, name');

    if (updateError) {
      console.error(`❌ Error updating ${target.name}:`, updateError.message);
    } else if (!updatedRows || updatedRows.length === 0) {
      console.error(`❌ Update SILENTLY FAILED for '${target.name}' (0 rows affected).`);
      console.error(`   👉 This is caused by Row Level Security (RLS) blocking the anon key.`);
      console.error(`   👉 Fix: Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file to bypass RLS.\n`);
    } else {
      console.log(`✅ Successfully updated ${target.name} (ID: ${target.id})`);
    }
  }

  console.log("\nSeeding complete!");
}

seedIngredients().catch(console.error);
