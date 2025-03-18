// store/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import apiClient from "@/lib/api/client";
import { CartItem, CartState } from "@/types/cart";
import { Product } from "@/types/product";

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,
      error: null,

      // Fetch the cart from the API
      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const response = await apiClient.get("/cart/cart/my-cart/");
          set({ cartItems: response.data.items, isLoading: false });
        } catch (error) {
          console.error("Error fetching cart:", error);
          set({ error: "Failed to fetch cart", isLoading: false });
        }
      },

      // Add an item to the cart
      addToCart: async (product: Product, quantity = 1) => {
        try {
          set({ isLoading: true });

          // Check if the product is already in the cart
          const existingItem = get().cartItems.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            // Update quantity instead of adding a new item
            return get().updateCartItemQuantity(
              product.id,
              existingItem.quantity + quantity
            );
          }

          // API call to add to cart
          const response = await apiClient.post("/cart/cart/add-item/", {
            product_id: product.id,
            quantity,
          });

          // Update the cart
          set({
            cartItems: response.data.items,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error adding to cart:", error);
          set({ error: "Failed to add item to cart", isLoading: false });
          toast.error("Failed to add item to cart");
        }
      },

      // Update cart item quantity
      updateCartItemQuantity: async (itemId: number, quantity: number) => {
        try {
          set({ isLoading: true });

          // API call to update cart item
          const response = await apiClient.patch(
            `/cart/cart-items/${itemId}/update-quantity/`,
            { quantity }
          );

          // In a real app, you would refresh the entire cart here
          // For simplicity, we'll manually update the item
          const updatedCartItems = get().cartItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity: response.data.quantity }
              : item
          );

          set({ cartItems: updatedCartItems, isLoading: false });
        } catch (error) {
          console.error("Error updating cart item:", error);
          set({ error: "Failed to update item quantity", isLoading: false });
          toast.error("Failed to update item quantity");
        }
      },

      // Remove an item from the cart
      removeFromCart: async (itemId: number) => {
        try {
          set({ isLoading: true });

          // API call to remove from cart
          await apiClient.delete(`/cart/cart-items/${itemId}/remove/`);

          // Update the cart state
          const updatedCartItems = get().cartItems.filter(
            (item) => item.id !== itemId
          );
          set({ cartItems: updatedCartItems, isLoading: false });
        } catch (error) {
          console.error("Error removing from cart:", error);
          set({ error: "Failed to remove item from cart", isLoading: false });
          toast.error("Failed to remove item from cart");
        }
      },

      // Clear the entire cart
      clearCart: async () => {
        try {
          set({ isLoading: true });

          // API call to clear cart
          await apiClient.delete("/cart/cart/clear/");

          // Update the cart state
          set({ cartItems: [], isLoading: false });
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ error: "Failed to clear cart", isLoading: false });
          toast.error("Failed to clear cart");
        }
      },

      // Get the cart total
      get cartTotal() {
        return get().cartItems.reduce(
          (total, item) =>
            total + (item.discount_price || item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      // Don't persist loading state or error messages
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

export default useCartStore;
