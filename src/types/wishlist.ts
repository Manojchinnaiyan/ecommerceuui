// types/wishlist.ts
import { Product } from "./product";

export interface WishlistItem {
  id: number;
  product: Product;
  created_at: string;
}

export interface WishlistState {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}
