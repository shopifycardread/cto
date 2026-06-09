/* ── API Response Types ──────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

export interface WardrobeItem {
  id: string;
  user_id: string;
  photo_url: string;
  name?: string;          // Display name (populated by AI or user)
  category?: string;
  color?: string;
  style_tags: string[];
  season?: string;
  occasion?: string;
  brand?: string;
  created_at: string;
}

export interface WardrobeItemCreate {
  photo_url: string;
  category?: string;
  color?: string;
  style_tags?: string[];
  season?: string;
  occasion?: string;
  brand?: string;
}

export interface StyleProfile {
  user_id: string;
  body_type?: string;
  style_tags: string[];
  size_preferences: Record<string, string>;
  lifestyle_tags: string[];
  weather_location?: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  items: string[];
  status: string;
  date: string;
  created_at: string;
}

/* ─── UI Types ────────────────────────────────────────────── */

export type OnboardingStep = "welcome" | "photos" | "style";

export interface OutfitDisplay {
  id: string;
  title: string;
  items: string[];
  occasion?: string;
}

export interface ShopRecommendation {
  id: string;
  title: string;
  reason: string;
  price: string;
  brand: string;
  category: string;
}

export interface WardrobeFilter {
  search: string;
  category: string;
}