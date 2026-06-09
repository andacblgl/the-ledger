export interface BaseCocktail {
  id: string;
  name: string;
  thumbnail_url: string | null;
}

export interface TopShelfRecord {
  cocktail_id: string;
  user_id: string;
  added_at: string;
}

export interface BookmarkRecord {
  id: string;
  user_id: string;
  cocktail_id: string;
  created_at: string;
  rating: number;
  note: string | null;
}

export interface HydratedTopShelfSlot {
  cocktail_id: string;
  added_at: string;
  cocktail: BaseCocktail;
}

export interface HydratedDiaryEntry extends BookmarkRecord {
  cocktail: BaseCocktail;
}
