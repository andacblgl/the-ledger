-- Create enum for ingredient roles
CREATE TYPE ingredient_role AS ENUM ('base_spirit', 'citrus', 'sweetener', 'modifier', 'garnish');

-- Ingredients Table
CREATE TABLE public.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cocktails Table
CREATE TABLE public.cocktails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    instructions TEXT,
    garnish TEXT,
    glass_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cocktail Ingredients Table (Join Table)
CREATE TABLE public.cocktail_ingredients (
    cocktail_id UUID REFERENCES public.cocktails(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
    amount TEXT,
    role ingredient_role NOT NULL,
    is_essential BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (cocktail_id, ingredient_id)
);

-- User Inventory Table
CREATE TABLE public.user_inventory (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, ingredient_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocktail_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Ingredients, Cocktails, and Cocktail Ingredients are readable by everyone
CREATE POLICY "Enable read access for all users" ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.cocktails FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.cocktail_ingredients FOR SELECT USING (true);

-- User Inventory is only readable/writable by the authenticated user
CREATE POLICY "Users can manage their own inventory" ON public.user_inventory
    FOR ALL USING (auth.uid() = user_id);
