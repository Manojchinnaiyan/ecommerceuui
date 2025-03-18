// components/checkout/order-review.tsx
import {
  ArrowLeft,
  Edit2,
  AlertCircle,
  CreditCard,
  Truck,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/cart";

interface OrderReviewProps {
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  cartItems: CartItem[];
  onEditAddress: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OrderReview = ({
  shippingAddress,
  billingAddress,
  paymentMethod,
  cartItems,
  onEditAddress,
  onEditPayment,
  onPlaceOrder,
  onBack,
  isSubmitting,
}: OrderReviewProps) => {
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= 100;
  const shippingCost = isFreeShipping ? 0 : 10;

  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;

  const total = subtotal + shippingCost + taxAmount;

  // Format credit card number for display
  const formatCardNumber = (cardNumber: string) => {
    // In a real app, this would be the last 4 digits of the card
    return `•••• •••• •••• 1111`;
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium">Review Your Order</h2>
        </div>

        <div className="p-6">
          {/* Shipping Address */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium flex items-center">
                <MapPin size={18} className="mr-2" />
                Shipping Address
              </h3>
              <button
                onClick={onEditAddress}
                className="text-sm text-gray-600 hover:text-black flex items-center"
              >
                <Edit2 size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{shippingAddress.full_name}</p>
              <address className="text-sm text-gray-600 not-italic mt-1">
                {shippingAddress.street_address}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postal_code}
                <br />
                {shippingAddress.country}
                <br />
                {shippingAddress.phone}
              </address>
            </div>
          </div>

          {/* Billing Address */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium flex items-center">
                <MapPin size={18} className="mr-2" />
                Billing Address
              </h3>
              <button
                onClick={onEditAddress}
                className="text-sm text-gray-600 hover:text-black flex items-center"
              >
                <Edit2 size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{billingAddress.full_name}</p>
              <address className="text-sm text-gray-600 not-italic mt-1">
                {billingAddress.street_address}
                <br />
                {billingAddress.city}, {billingAddress.state}{" "}
                {billingAddress.postal_code}
                <br />
                {billingAddress.country}
                <br />
                {billingAddress.phone}
              </address>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium flex items-center">
                <CreditCard size={18} className="mr-2" />
                Payment Method
              </h3>
              <button
                onClick={onEditPayment}
                className="text-sm text-gray-600 hover:text-black flex items-center"
              >
                <Edit2 size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Credit Card</p>
              <p className="text-sm text-gray-600 mt-1">
                {formatCardNumber("4111111111111111")}
              </p>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium flex items-center">
                <Truck size={18} className="mr-2" />
                Shipping Method
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">
                {isFreeShipping ? "Free Shipping" : "Standard Shipping"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {isFreeShipping
                  ? "Delivery in 3-5 business days"
                  : "Delivery in 5-7 business days - $10.00"}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-md font-medium mb-3">Order Items</h3>
            <div className="border rounded-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex p-4 border-b last:border-b-0"
                >
                  <div className="h-16 w-16 flex-shrink-0 relative rounded overflow-hidden">
                    <Image
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0].image
                          : "/images/product-placeholder.jpg"
                      }
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ", "}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          $
                          {(
                            (item.discount_price || item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${(item.discount_price || item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {isFreeShipping ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Demo Disclaimer */}
          <div className="mt-6 flex items-start bg-blue-50 p-4 rounded-md">
            <AlertCircle
              size={18}
              className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-blue-700">
              <span className="font-medium">Demo Mode:</span> No actual payment
              will be processed. This is a demonstration of the checkout
              experience only.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Payment
        </button>

        <button
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};
