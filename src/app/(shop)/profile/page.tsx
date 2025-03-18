// app/(shop)/profile/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  Home,
  Package,
  Heart,
  LogOut,
  Shield,
} from "lucide-react";

import { useAuth } from "@/lib/hooks/use-auth";
import { ProfileInfo } from "@/components/profile/profile-info";
import { AddressBook } from "@/components/profile/address-book";
import { PaymentMethods } from "@/components/profile/payment-methods";
import { AccountSettings } from "@/components/profile/account-settings";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile-info");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out");
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-2">
              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "profile-info"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("profile-info")}
              >
                <User size={18} className="mr-3" />
                My Profile
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "orders"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => router.push("/orders")}
              >
                <Package size={18} className="mr-3" />
                Orders
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "addresses"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                <Home size={18} className="mr-3" />
                Addresses
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "payment-methods"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("payment-methods")}
              >
                <CreditCard size={18} className="mr-3" />
                Payment Methods
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "wishlist"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => router.push("/wishlist")}
              >
                <Heart size={18} className="mr-3" />
                Wishlist
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "account-settings"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("account-settings")}
              >
                <Settings size={18} className="mr-3" />
                Account Settings
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  activeTab === "privacy-security"
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("privacy-security")}
              >
                <Shield size={18} className="mr-3" />
                Privacy & Security
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-md flex items-center text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile-info" && <ProfileInfo user={user} />}

          {activeTab === "addresses" && <AddressBook />}

          {activeTab === "payment-methods" && <PaymentMethods />}

          {activeTab === "account-settings" && <AccountSettings />}

          {activeTab === "privacy-security" && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Privacy & Security</h2>
              </div>
              <div className="p-6">
                <h3 className="font-medium mb-4">Password & Authentication</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-500">
                        Update your password regularly for better security
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                      Update
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Enable
                    </button>
                  </div>
                </div>

                <h3 className="font-medium mt-8 mb-4">Privacy Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-start p-4 border rounded-md">
                    <input
                      type="checkbox"
                      id="marketing-emails"
                      className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                      defaultChecked
                    />
                    <div className="ml-3">
                      <label htmlFor="marketing-emails" className="font-medium">
                        Marketing Emails
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails about new products, offers and promotions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 border rounded-md">
                    <input
                      type="checkbox"
                      id="order-updates"
                      className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                      defaultChecked
                    />
                    <div className="ml-3">
                      <label htmlFor="order-updates" className="font-medium">
                        Order Updates
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails about your order status and tracking
                        information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 border rounded-md">
                    <input
                      type="checkbox"
                      id="data-collection"
                      className="mt-1 h-4 w-4 text-black rounded focus:ring-black"
                      defaultChecked
                    />
                    <div className="ml-3">
                      <label htmlFor="data-collection" className="font-medium">
                        Data Collection
                      </label>
                      <p className="text-sm text-gray-500">
                        Allow us to collect data about your browsing behavior to
                        improve your shopping experience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
