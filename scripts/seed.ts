import { Client } from 'pg';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function getIngredientRoleAndEssentiality(name: string): { is_essential: boolean, role: string } {
    const lowerName = name.toLowerCase();
    
    // Rule 1: Non-essential heuristic
    if (lowerName.match(/bitters|peel|twist|zest|garnish|leaf|sprig|dash/)) {
        let role = 'modifier';
        if (lowerName.match(/peel|twist|zest|garnish|leaf|sprig/)) role = 'garnish';
        return { is_essential: false, role };
    }
    
    // Rule 2: Base Spirits
    if (lowerName.match(/rum|vodka|whiskey|whisky|gin|tequila|brandy|scotch|bourbon|mezcal|cognac/)) {
        return { is_essential: true, role: 'base_spirit' };
    }
    
    // Rule 3: Citrus
    if (lowerName.match(/lemon|lime|orange|grapefruit|citrus|yuzu/)) {
        return { is_essential: true, role: 'citrus' };
    }
    
    // Rule 4: Sweeteners & Liqueurs
    if (lowerName.match(/sugar|syrup|honey|agave|liqueur|vermouth|amaretto|cointreau|triple sec/)) {
        return { is_essential: true, role: 'sweetener' };
    }
    
    // Default
    return { is_essential: true, role: 'modifier' };
}

async function seed() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ Error: DATABASE_URL is not set in .env.local");
        console.error("Please add your Supabase connection string to .env.local as DATABASE_URL, for example:");
        console.error('DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"');
        process.exit(1);
    }

    console.log("Connecting to the database...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    console.log("✅ Connected successfully!");

    try {
        console.log("Reading CSVs...");
        
        const cocktailsContent = fs.readFileSync(path.resolve(process.cwd(), 'Data/cocktails.csv'), 'utf8');
        const cocktailsRows = parse(cocktailsContent, { columns: true, skip_empty_lines: true });

        const ingredientsContent = fs.readFileSync(path.resolve(process.cwd(), 'Data/cocktail_ingredients.csv'), 'utf8');
        const ingredientsRows = parse(ingredientsContent, { columns: true, skip_empty_lines: true });

        console.log(`Found ${cocktailsRows.length} cocktails and ${ingredientsRows.length} ingredient associations.`);

        // Clear existing data (optional, but good for idempotency during development)
        console.log("Cleaning up existing data...");
        await client.query('DELETE FROM public.cocktails');
        await client.query('DELETE FROM public.ingredients');
        
        // Maps to store relationships
        const dbCocktails = new Map<string, string>(); // idDrink -> uuid
        const dbIngredients = new Map<string, string>(); // lowerName -> uuid
        
        // 1. Process Cocktails
        console.log("Seeding cocktails...");
        let cocktailCount = 0;
        for (const row of cocktailsRows) {
            const uuid = crypto.randomUUID();
            dbCocktails.set(row.idDrink, uuid);
            
            await client.query(`
                INSERT INTO public.cocktails (id, name, description, instructions, garnish, glass_type)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (name) DO NOTHING
            `, [
                uuid, 
                row.strDrink, 
                row.strCategory, // using category as a short description for now
                row.strInstructions, 
                null, 
                row.strGlass
            ]);
            cocktailCount++;
        }
        
        // 2. Process Unique Ingredients
        console.log("Seeding ingredients...");
        const uniqueIngredientNames = new Set<string>();
        for (const row of ingredientsRows) {
            if (row.Ingredient) {
                uniqueIngredientNames.add(row.Ingredient.trim());
            }
        }
        
        let ingredientCount = 0;
        for (const name of uniqueIngredientNames) {
            const uuid = crypto.randomUUID();
            dbIngredients.set(name.toLowerCase(), uuid);
            
            // Deduce a simple category based on the role heuristic
            const { role } = getIngredientRoleAndEssentiality(name);
            
            await client.query(`
                INSERT INTO public.ingredients (id, name, category)
                VALUES ($1, $2, $3)
                ON CONFLICT (name) DO NOTHING
            `, [uuid, name, role]);
            ingredientCount++;
        }
        
        // 3. Process Cocktail Ingredients (Relationships)
        console.log("Seeding cocktail ingredient relationships...");
        let assocCount = 0;
        for (const row of ingredientsRows) {
            if (!row.Ingredient || !row.idDrink) continue;
            
            const cocktailId = dbCocktails.get(row.idDrink);
            const ingredientId = dbIngredients.get(row.Ingredient.trim().toLowerCase());
            
            if (!cocktailId || !ingredientId) continue;
            
            const { is_essential, role } = getIngredientRoleAndEssentiality(row.Ingredient.trim());
            
            await client.query(`
                INSERT INTO public.cocktail_ingredients (cocktail_id, ingredient_id, amount, role, is_essential)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING
            `, [cocktailId, ingredientId, row.Measure ? row.Measure.trim() : null, role, is_essential]);
            assocCount++;
        }
        
        console.log(`✅ Seeding Complete!`);
        console.log(`- Inserted ${cocktailCount} cocktails`);
        console.log(`- Inserted ${ingredientCount} ingredients`);
        console.log(`- Inserted ${assocCount} relationships`);
        
    } catch (e) {
        console.error("❌ Error during seeding:", e);
    } finally {
        await client.end();
    }
}

seed();
