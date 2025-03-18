// components/layout/footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">fashion.</h3>
            <p className="text-gray-600 mb-4">
              Your ultimate destination for premium fashion and style
              inspiration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/men"
                  className="text-gray-600 hover:text-black"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href="/category/women"
                  className="text-gray-600 hover:text-black"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  href="/category/accessories"
                  className="text-gray-600 hover:text-black"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/category/new"
                  className="text-gray-600 hover:text-black"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sale"
                  className="text-gray-600 hover:text-black"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-black"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-black"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-600 hover:text-black"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-600 hover:text-black"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-black">
                  Login / Register
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-black"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-gray-600 hover:text-black"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-black">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} fashion. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-black text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-600 hover:text-black text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
