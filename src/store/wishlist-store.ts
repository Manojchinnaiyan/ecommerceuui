// store/wishlist-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import apiClient from "@/lib/api/client";
import { WishlistState, WishlistItem } from "@/types/wishlist";
import { Product } from "@/types/product";

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isLoading: false,
      error: null,

      // Fetch wishlist from API
      fetchWishlist: async () => {
        try {
          set({ isLoading: true });
          const response = await apiClient.get(
            "/wishlist/wishlist/my-wishlist/"
          );
          set({ wishlistItems: response.data.items, isLoading: false });
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          set({ error: "Failed to fetch wishlist", isLoading: false });
        }
      },

      // Add to wishlist
      addToWishlist: async (product: Product) => {
        try {
          set({ isLoading: true });

          // Check if product is already in wishlist
          if (get().isInWishlist(product.id)) {
            set({ isLoading: false });
            return;
          }

          // API call to add to wishlist
          const response = await apiClient.post(
            "/wishlist/wishlist/add-item/",
            {
              product_id: product.id,
            }
          );

          // Update wishlist state
          set({ wishlistItems: response.data.items, isLoading: false });
        } catch (error) {
          console.error("Error adding to wishlist:", error);
          set({ error: "Failed to add to wishlist", isLoading: false });
          toast.error("Failed to add item to wishlist");
        }
      },

      // Remove from wishlist
      removeFromWishlist: async (productId: number) => {
        try {
          set({ isLoading: true });

          // Find the wishlist item with the product ID
          const item = get().wishlistItems.find(
            (item) => item.product.id === productId
          );

          if (!item) {
            set({ isLoading: false });
            return;
          }

          // API call to remove from wishlist
          await apiClient.delete(`/wishlist/wishlist-items/${item.id}/remove/`);

          // Update wishlist state
          const updatedItems = get().wishlistItems.filter(
            (item) => item.product.id !== productId
          );
          set({ wishlistItems: updatedItems, isLoading: false });
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          set({ error: "Failed to remove from wishlist", isLoading: false });
          toast.error("Failed to remove item from wishlist");
        }
      },

      // Clear wishlist
      clearWishlist: async () => {
        try {
          set({ isLoading: true });

          // API call to clear wishlist
          await apiClient.delete("/wishlist/wishlist/clear/");

          // Update wishlist state
          set({ wishlistItems: [], isLoading: false });
        } catch (error) {
          console.error("Error clearing wishlist:", error);
          set({ error: "Failed to clear wishlist", isLoading: false });
          toast.error("Failed to clear wishlist");
        }
      },

      // Check if a product is in the wishlist
      isInWishlist: (productId: number) => {
        return get().wishlistItems.some(
          (item) => item.product.id === productId
        );
      },
    }),
    {
      name: "wishlist-storage",
      // Don't persist loading state or error messages
      partialize: (state) => ({ wishlistItems: state.wishlistItems }),
    }
  )
);

export default useWishlistStore;
