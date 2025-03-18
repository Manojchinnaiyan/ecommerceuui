// app/(shop)/wishlist/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCart } from "@/lib/hooks/use-cart";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } =
    useWishlist();
  const { addToCart } = useCart();

  // If wishlist is empty and not loading, show empty state
  if (!isLoading && wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <Heart size={24} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">
            Save items you love to your wishlist. Review them anytime and easily
            add to cart.
          </p>
          <Link
            href="/category/all"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId, productName) => {
    removeFromWishlist(productId);
    toast.info(`${productName} removed from wishlist`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.info("Wishlist cleared");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>

        {wishlistItems.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.product.slug}`}
                className="block relative aspect-square"
              >
                <Image
                  src={
                    item.product.images && item.product.images.length > 0
                      ? item.product.images[0].image
                      : "/images/product-placeholder.jpg"
                  }
                  alt={item.product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {item.product.discount_price &&
                  item.product.discount_price < item.product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(
                        ((item.product.price - item.product.discount_price) /
                          item.product.price) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.product.slug}`}>
                  <h2 className="text-lg font-medium text-gray-900 mb-1">
                    {item.product.name}
                  </h2>
                </Link>

                <div className="flex items-center mb-4">
                  <span className="font-bold text-black mr-2">
                    $
                    {(
                      item.product.discount_price || item.product.price
                    ).toFixed(2)}
                  </span>

                  {item.product.discount_price &&
                    item.product.discount_price < item.product.price && (
                      <span className="text-gray-500 text-sm line-through">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(
                        item.product.id,
                        item.product.name
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
