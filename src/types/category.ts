// types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  image?: string; // URL to the category image
  created_at: string;
  updated_at: string;
}
