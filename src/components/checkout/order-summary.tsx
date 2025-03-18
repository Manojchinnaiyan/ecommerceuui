// components/checkout/order-summary.tsx
import { CartItem } from "@/types/cart";
import Image from "next/image";

interface OrderSummaryProps {
  cartItems: CartItem[];
  shippingAddress?: any;
}

export const OrderSummary = ({
  cartItems,
  shippingAddress,
}: OrderSummaryProps) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
    0
  );

  // Determine shipping cost (free shipping over $100)
  const isFreeShipping = subtotal >= 100;
  const shippingCost = isFreeShipping ? 0 : 10;

  // Calculate tax (assume 8%)
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;

  // Calculate total
  const total = subtotal + shippingCost + taxAmount;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      {/* Items in cart */}
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex py-3 border-b border-gray-100">
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
              <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl">
                {item.quantity}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.selectedSize && `Size: ${item.selectedSize}`}
                {item.selectedSize && item.selectedColor && ", "}
                {item.selectedColor && `Color: ${item.selectedColor}`}
              </p>
              <p className="text-sm mt-1">
                $
                {((item.discount_price || item.price) * item.quantity).toFixed(
                  2
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-2 py-4 border-b border-gray-200 text-sm">
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
      </div>

      {/* Total */}
      <div className="flex justify-between py-4 font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Shipping Address Preview */}
      {shippingAddress && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium mb-2">Shipping to:</h3>
          <address className="text-sm text-gray-600 not-italic">
            {shippingAddress.full_name}
            <br />
            {shippingAddress.street_address}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postal_code}
            <br />
            {shippingAddress.country}
          </address>
        </div>
      )}
    </div>
  );
};
