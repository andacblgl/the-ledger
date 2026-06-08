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

const canonSetMetadata = [
  {
    name: 'Negroni',
    flavor_tags: [
      { slug: 'spirit-forward', label: 'Spirit-Forward' },
      { slug: 'bittersweet', label: 'Bittersweet' },
      { slug: 'classic', label: 'Classic' }
    ],
    lore: {
      text: "First popularized in Florence in the early 20th century by Count Camillo Negroni, who asked his bartender to strengthen his Americano by swapping soda water for gin.",
      source: "The Timeless Archive"
    },
    related_classics: [
      { slug: 'boulevardier', name: 'Boulevardier', shared_trait: 'Whiskey variant', thumbnail_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
      { slug: 'americano', name: 'Americano', shared_trait: 'Lighter aperitif', thumbnail_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' }
    ]
  },
  {
    name: 'Dry Martini',
    flavor_tags: [
      { slug: 'botanical', label: 'Botanical' },
      { slug: 'dry', label: 'Bone Dry' },
      { slug: 'elegant', label: 'Elegant' }
    ],
    lore: {
      text: "A crystalline archetype of the cocktail renaissance. Its origins are clouded in 19th-century myth, evolving from the sweet Martinez into the bracingly dry icon we know today.",
      source: "The Timeless Archive"
    },
    related_classics: [
      { slug: 'martinez', name: 'Martinez', shared_trait: 'The sweet ancestor', thumbnail_url: 'https://images.unsplash.com/photo-1615887023516-9eaacbac7037?w=400&q=80' },
      { slug: 'vesper', name: 'Vesper', shared_trait: 'The Bond variant', thumbnail_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' }
    ]
  },
  {
    name: 'Old Fashioned',
    flavor_tags: [
      { slug: 'spirit-forward', label: 'Spirit-Forward' },
      { slug: 'complex', label: 'Complex' },
      { slug: 'classic', label: 'Classic' }
    ],
    lore: {
      text: "The definition of the word 'cocktail' from 1806: spirits of any kind, sugar, water, and bitters. It is the primordial drink, elegant in its elemental simplicity.",
      source: "The Timeless Archive"
    },
    related_classics: [
      { slug: 'sazerac', name: 'Sazerac', shared_trait: 'New Orleans cousin', thumbnail_url: 'https://images.unsplash.com/photo-1570598912132-0ba1dc95ceb7?w=400&q=80' },
      { slug: 'manhattan', name: 'Manhattan', shared_trait: 'Vermouth variation', thumbnail_url: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400&q=80' }
    ]
  }
];

async function seedIdentity() {
  console.log("Seeding Identity Layer Metadata for The Canon Set...");

  for (const cocktail of canonSetMetadata) {
    const searchName = cocktail.name;

    console.log(`\nSearching database for '%${searchName}%'...`);
    
    // 1. Fetch before updating to see what matches
    const { data: found, error: searchError } = await supabase
      .from('cocktails')
      .select('id, name')
      .ilike('name', `%${searchName}%`);

    if (searchError) {
      console.error(`❌ Search failed for ${searchName}:`, searchError.message);
      continue;
    }

    if (!found || found.length === 0) {
      console.log(`⚠️ No cocktail found matching '%${searchName}%'`);
      continue;
    }

    console.log(`🔍 Found matches:`, found.map(c => c.name).join(', '));
    
    // 2. Safely pick the EXACT match to update
    const target = found.find(c => c.name.toLowerCase() === cocktail.name.toLowerCase());
    
    if (!target) {
        console.log(`⚠️ No EXACT match found for '${cocktail.name}'. Skipping.`);
        continue;
    }

    console.log(`Updating '${target.name}' with new metadata...`);

    const { data: updatedRows, error: updateError } = await supabase
      .from('cocktails')
      .update({
        flavor_tags: cocktail.flavor_tags,
        lore: cocktail.lore,
        related_classics: cocktail.related_classics
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

seedIdentity().catch(console.error);
