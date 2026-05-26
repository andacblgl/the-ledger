-- Run this in your Supabase SQL Editor to add the missing column:
ALTER TABLE public.cocktails ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
