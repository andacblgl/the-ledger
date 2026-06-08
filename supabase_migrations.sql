-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. User Ingredients (Cloud Inventory)
CREATE TABLE public.user_ingredients (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ingredient_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, ingredient_id)
);

-- Enable RLS
ALTER TABLE public.user_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own ingredients" 
  ON public.user_ingredients FOR ALL USING (auth.uid() = user_id);

-- 3. Tasting Notes (The Digital Notebook)
CREATE TABLE public.tasting_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cocktail_id TEXT NOT NULL,
  notes TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tasting_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasting notes" 
  ON public.tasting_notes FOR ALL USING (auth.uid() = user_id);

-- 4. Top Shelf Table (Max 4 per user)
CREATE TABLE public.top_shelf (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cocktail_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, cocktail_id)
);

-- Enable RLS
ALTER TABLE public.top_shelf ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own top shelf" 
  ON public.top_shelf FOR ALL USING (auth.uid() = user_id);

-- 5. Phase 3.5: Identity Layer (Cocktails Metadata)
ALTER TABLE public.cocktails 
ADD COLUMN IF NOT EXISTS flavor_tags JSONB,
ADD COLUMN IF NOT EXISTS lore JSONB,
ADD COLUMN IF NOT EXISTS related_classics JSONB;

-- 6. Phase 4: Ingredient Pages Architecture
-- We use ALTER TABLE to add the new scalable columns, as the base tables already exist for the matching engine.
ALTER TABLE public.ingredients 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.cocktail_ingredients
ADD COLUMN IF NOT EXISTS measure TEXT;

-- Enable RLS and guarantee public read access for the catalog
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for ingredients" ON public.ingredients;
CREATE POLICY "Public read access for ingredients" 
  ON public.ingredients FOR SELECT USING (true);

ALTER TABLE public.cocktail_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for cocktail_ingredients" ON public.cocktail_ingredients;
CREATE POLICY "Public read access for cocktail_ingredients" 
  ON public.cocktail_ingredients FOR SELECT USING (true);
