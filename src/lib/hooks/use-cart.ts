// lib/hooks/use-cart.ts
"use client";

import { useEffect } from "react";
import useCartStore from "@/store/cart-store";
import { useAuth } from "@/lib/hooks/use-auth";

export const useCart = () => {
  const cartStore = useCartStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is authenticated, fetch their cart
    if (isAuthenticated) {
      cartStore.fetchCart();
    }
  }, [isAuthenticated]);

  return {
    cartItems: cartStore.cartItems,
    isLoading: cartStore.isLoading,
    error: cartStore.error,
    cartTotal: cartStore.cartTotal,
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    updateCartItemQuantity: cartStore.updateCartItemQuantity,
    clearCart: cartStore.clearCart,
  };
};
