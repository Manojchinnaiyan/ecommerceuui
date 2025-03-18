// components/products/product-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { Product } from "@/types/product";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const { id, name, slug, price, discount_price, images } = product;
  const imageUrl =
    images && images.length > 0
      ? images[0].image
      : "/images/product-placeholder.jpg";

  const isDiscounted = discount_price && discount_price < price;
  const finalPrice = isDiscounted ? discount_price : price;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${name} added to cart!`);
  };

  const toggleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast.info(`${name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${name} added to wishlist!`);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={`/product/${slug}`}
        className="block aspect-[3/4] relative overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(((price - discount_price) / price) * 100)}% OFF
          </div>
        )}

        {/* Quick Action Buttons - Shown on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 flex justify-between transform transition-transform duration-300 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-black text-white px-3 py-2 rounded text-sm font-medium flex-1 mr-2"
          >
            <ShoppingBag size={16} className="mr-1" />
            Add to Cart
          </button>
          <button
            onClick={toggleWishlist}
            className={`flex items-center justify-center p-2 rounded ${
              isInWishlist(id)
                ? "bg-red-50 text-red-500"
                : "bg-gray-100 text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart
              size={16}
              fill={isInWishlist(id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="text-gray-800 font-medium mb-1 hover:text-black transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center">
            <span className="font-semibold text-black">
              ${finalPrice.toFixed(2)}
            </span>
            {isDiscounted && (
              <span className="ml-2 text-gray-500 text-sm line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};
