// components/products/product-details.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Minus, Plus, Share2, Check } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { Product } from "@/types/product";
import { toast } from "react-toastify";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    id,
    name,
    price,
    discount_price,
    description,
    stock,
    images,
    category,
    average_rating,
  } = product;

  const isDiscounted = discount_price && discount_price < price;
  const finalPrice = isDiscounted ? discount_price : price;

  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Brown", "Black", "Blue", "Grey"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });

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

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.warning(`Sorry, only ${stock} items available`);
    }
  };

  // Get product images or use placeholders
  const productImages =
    images && images.length > 0
      ? images.map((img) => img.image)
      : ["/images/product-placeholder.jpg"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={productImages[activeImageIndex]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Thumbnail Images */}
        {productImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                  activeImageIndex === idx ? "border-black" : "border-gray-200"
                }`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <Image
                  src={img}
                  alt={`${name} - image ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex flex-wrap items-center">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-black"
              >
                {category.name}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-800">{name}</li>
          </ol>
        </nav>

        {/* Product Name */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Math.round(average_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {average_rating ? average_rating.toFixed(1) : "No ratings"} (
            {product.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-6">
          <span className="text-2xl font-bold text-gray-900">
            ${finalPrice.toFixed(2)}
          </span>
          {isDiscounted && (
            <span className="ml-2 text-lg text-gray-500 line-through">
              ${price.toFixed(2)}
            </span>
          )}
          {isDiscounted && (
            <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 text-xs font-bold rounded">
              {Math.round(((price - discount_price) / price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-sm mb-6">
          <p>{description}</p>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Size</span>
            <Link
              href="/size-guide"
              className="text-sm text-gray-500 hover:text-black"
            >
              Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`min-w-[4rem] h-10 px-4 border ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-900"
                } rounded-md font-medium`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-900 mb-2">
            Color: {selectedColor || "Select a color"}
          </span>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                className={`px-4 py-2 border rounded-md ${
                  selectedColor === color
                    ? "border-black bg-gray-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <span className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></span>
                  {color}
                  {selectedColor === color && (
                    <Check size={16} className="ml-1" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-900 mb-2">
            Quantity
          </span>
          <div className="flex items-center">
            <button
              onClick={decreaseQuantity}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
            >
              <Minus size={16} />
            </button>
            <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
              {quantity}
            </div>
            <button
              onClick={increaseQuantity}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
            <span className="ml-4 text-sm text-gray-500">
              {stock} items available
            </span>
          </div>
        </div>

        {/* Add to Cart & Wishlist */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={toggleWishlist}
            className={`w-full sm:w-12 h-12 flex items-center justify-center rounded-md ${
              isInWishlist(id)
                ? "bg-red-50 text-red-500 border border-red-200"
                : "border border-gray-300 text-gray-700 hover:border-gray-900"
            }`}
          >
            <Heart
              size={20}
              fill={isInWishlist(id) ? "currentColor" : "none"}
            />
          </button>
          <button className="w-full sm:w-12 h-12 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:border-gray-900">
            <Share2 size={20} />
          </button>
        </div>

        {/* Product Details */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Material</span>
              <p className="text-gray-900">Cotton, Polyester</p>
            </div>
            <div>
              <span className="text-gray-500">Shipping</span>
              <p className="text-gray-900">Free shipping on orders over $100</p>
            </div>
            <div>
              <span className="text-gray-500">SKU</span>
              <p className="text-gray-900">
                PRD-{id.toString().padStart(6, "0")}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Return Policy</span>
              <p className="text-gray-900">30-day easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
