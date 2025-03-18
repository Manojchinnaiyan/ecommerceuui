// lib/hooks/use-wishlist.ts
"use client";

import { useEffect } from "react";
import useWishlistStore from "@/store/wishlist-store";
import { useAuth } from "@/lib/hooks/use-auth";

export const useWishlist = () => {
  const wishlistStore = useWishlistStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is authenticated, fetch their wishlist
    if (isAuthenticated) {
      wishlistStore.fetchWishlist();
    }
  }, [isAuthenticated]);

  return {
    wishlistItems: wishlistStore.wishlistItems,
    isLoading: wishlistStore.isLoading,
    error: wishlistStore.error,
    addToWishlist: wishlistStore.addToWishlist,
    removeFromWishlist: wishlistStore.removeFromWishlist,
    clearWishlist: wishlistStore.clearWishlist,
    isInWishlist: wishlistStore.isInWishlist,
  };
};
