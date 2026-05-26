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
