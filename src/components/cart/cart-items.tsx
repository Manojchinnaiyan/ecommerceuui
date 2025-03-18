// components/cart/cart-items.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { toast } from "react-toastify";

export const CartItems = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (
    itemId: number,
    currentQuantity: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > 10) {
      toast.warning("Maximum quantity allowed is 10");
      return;
    }

    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: number, productName: string) => {
    removeFromCart(itemId);
    toast.info(`${productName} removed from cart`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="py-6 px-4 md:px-6 flex flex-col md:flex-row"
          >
            {/* Product Image */}
            <div className="md:w-24 md:h-24 flex-shrink-0 mb-4 md:mb-0">
              <div className="relative h-24 w-full md:w-24">
                <Link href={`/product/${item.slug}`}>
                  <Image
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].image
                        : "/images/product-placeholder.jpg"
                    }
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 96px"
                    className="object-cover rounded"
                  />
                </Link>
              </div>
            </div>

            {/* Product Details */}
            <div className="md:ml-4 flex-1">
              <div className="flex flex-col md:flex-row md:justify-between">
                {/* Product Info */}
                <div className="mb-4 md:mb-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-black"
                  >
                    {item.name}
                  </Link>

                  <div className="mt-1 text-sm text-gray-500 space-y-1">
                    {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    <p>Price: ${item.discount_price || item.price}</p>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded mr-4">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity,
                          item.quantity - 1
                        )
                      }
                      className="px-2 py-1 text-gray-600 hover:text-black"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2 py-1 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity,
                          item.quantity + 1
                        )
                      }
                      className="px-2 py-1 text-gray-600 hover:text-black"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-medium text-black">
                      $
                      {(
                        (item.discount_price || item.price) * item.quantity
                      ).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="text-sm text-red-500 hover:text-red-700 mt-1 flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
