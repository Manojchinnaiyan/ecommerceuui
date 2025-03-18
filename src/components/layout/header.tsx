// components/layout/header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";

export const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage =
    pathname?.includes("/login") || pathname?.includes("/register");

  if (isAuthPage) {
    return (
      <header className="py-4 px-6 flex justify-center items-center border-b">
        <Link href="/" className="text-2xl font-bold">
          <span className="bg-black text-white rounded-full px-3 py-1 mr-1">
            f
          </span>
          ashion.
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-black text-white rounded-full px-3 py-1 mr-1">
              f
            </span>
            ashion.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/category/men"
              className="text-gray-700 hover:text-black"
            >
              Men
            </Link>
            <Link
              href="/category/women"
              className="text-gray-700 hover:text-black"
            >
              Women
            </Link>
            <Link
              href="/category/accessories"
              className="text-gray-700 hover:text-black"
            >
              Accessories
            </Link>
            <Link
              href="/category/new"
              className="text-gray-700 hover:text-black"
            >
              New Arrivals
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="p-2 text-gray-700 hover:text-black">
              <Search size={20} />
            </Link>
            <Link
              href="/wishlist"
              className="p-2 text-gray-700 hover:text-black"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-black relative"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="p-2 text-gray-700 hover:text-black"
              >
                <User size={20} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/category/men"
                className="py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/category/women"
                className="py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/category/accessories"
                className="py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                href="/category/new"
                className="py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <div className="border-t pt-4 mt-2 flex items-center justify-between">
                <Link
                  href="/search"
                  className="p-2 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search size={20} />
                </Link>
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-700 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={20} />
                </Link>
                <Link
                  href="/cart"
                  className="p-2 text-gray-700 hover:text-black relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="p-2 text-gray-700 hover:text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
