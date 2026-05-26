import { Client } from 'pg';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function patchThumbnails() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ Error: DATABASE_URL is not set in .env.local");
        process.exit(1);
    }

    console.log("Connecting to the database to patch thumbnails...");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        console.log("Ensuring 'thumbnail_url' column exists...");
        await client.query(`ALTER TABLE public.cocktails ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;`);

        // 1. Read cocktails.csv to map idDrink -> strDrink (Cocktail Name)
        const cocktailsContent = fs.readFileSync(path.resolve(process.cwd(), 'Data/cocktails.csv'), 'utf8');
        const cocktailsRows = parse(cocktailsContent, { columns: true, skip_empty_lines: true });
        
        const idToNameMap: Record<string, string> = {};
        for (const row of cocktailsRows) {
            if (row.idDrink && row.strDrink) {
                idToNameMap[row.idDrink] = row.strDrink;
            }
        }

        // 2. Read cocktail_image_mapping.csv to map idDrink -> image_filename
        const mappingContent = fs.readFileSync(path.resolve(process.cwd(), 'Data/cocktail_image_mapping.csv'), 'utf8');
        const mappingRows = parse(mappingContent, { columns: true, skip_empty_lines: true });

        console.log(`Found ${mappingRows.length} image mappings to process.`);

        let count = 0;
        for (const row of mappingRows) {
            const cocktailName = idToNameMap[row.idDrink];
            
            if (cocktailName && row.image_filename) {
                // Construct the public Next.js path
                const localImagePath = `/cocktail_images/${row.image_filename}`;

                await client.query(`
                    UPDATE public.cocktails 
                    SET thumbnail_url = $1 
                    WHERE name = $2
                `, [localImagePath, cocktailName]);
                
                count++;
            }
        }
        
        console.log(`✅ Successfully patched ${count} cocktail thumbnails with local paths!`);
    } catch (e) {
        console.error("❌ Error during patching:", e);
    } finally {
        await client.end();
    }
}

patchThumbnails();
