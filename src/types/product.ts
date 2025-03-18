// types/product.ts
import { Category } from "./category";
import { User } from "./user";

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price: number;
  discount_price?: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  images: ProductImage[];
  is_in_stock: boolean;
  discount_percentage: number;
  final_price: number;
  average_rating: number;
  reviews?: Review[];

  // Added for cart and checkout functionality
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}
