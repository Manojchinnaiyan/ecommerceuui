// components/cart/cart-summary.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-toastify";

export const CartSummary = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Shipping is free over $100
  const isFreeShipping = cartTotal >= 100;
  const shippingCost = isFreeShipping ? 0 : 10;

  // Calculate tax (assume 8%)
  const taxRate = 0.08;
  const taxAmount = (cartTotal - discount) * taxRate;

  // Calculate order total
  const orderTotal = cartTotal - discount + shippingCost + taxAmount;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    try {
      // Simulate API call to validate promo code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, let's assume WELCOME10 gives 10% off
      if (promoCode.trim().toUpperCase() === "WELCOME10") {
        const discountAmount = cartTotal * 0.1;
        setDiscount(discountAmount);
        toast.success("Promo code applied successfully!");
      } else {
        toast.error("Invalid promo code");
      }
    } catch (error) {
      toast.error("Error applying promo code");
      console.error(error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to continue with checkout");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Navigate to checkout page
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          {isFreeShipping ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>${shippingCost.toFixed(2)}</span>
          )}
        </div>

        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <form onSubmit={handleApplyPromo} className="mb-6">
        <div className="flex mb-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={isApplyingPromo}
            className="px-4 py-2 bg-gray-900 text-white rounded-r-md font-medium hover:bg-black disabled:bg-gray-400"
          >
            {isApplyingPromo ? "Applying..." : "Apply"}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Try code "WELCOME10" for 10% off your order
        </p>
      </form>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full py-3 px-4 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
      >
        Proceed to Checkout
      </button>

      {/* Payment Methods */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-2">Secure checkout powered by</p>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-5 bg-blue-900 rounded"></div>
          <div className="w-8 h-5 bg-red-500 rounded"></div>
          <div className="w-8 h-5 bg-yellow-400 rounded"></div>
          <div className="w-8 h-5 bg-green-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};
