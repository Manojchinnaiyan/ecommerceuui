// src/app/cart/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { CartItems } from "@/components/cart/cart-items";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { cartItems, isLoading, error } = useCart();

  // Empty cart state
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <ShoppingBag size={24} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/category/all"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="underline ml-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            <CartItems />
          </div>

          {/* Cart Summary - Right Column */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}

      {/* Continue Shopping */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <Link
          href="/category/all"
          className="inline-flex items-center text-black hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
