// components/checkout/payment-method-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, AlertCircle, ArrowLeft } from "lucide-react";

interface PaymentMethodFormProps {
  onSubmit: (paymentMethod: string) => void;
  selectedMethod: string;
  onBack: () => void;
}

export const PaymentMethodForm = ({
  onSubmit,
  selectedMethod,
  onBack,
}: PaymentMethodFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState(
    selectedMethod || "credit_card"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      card_number: "",
      card_holder: "",
      expiry_date: "",
      cvv: "",
    },
  });

  const onSubmitForm = (data: any) => {
    // In a real application, you would validate and tokenize card details
    // before sending to the server. Never send raw card details.
    onSubmit(paymentMethod);
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium">Payment Method</h2>
        </div>

        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Credit Card Option */}
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "credit_card"
                    ? "border-black ring-1 ring-black"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="ml-2 flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    Credit / Debit Card
                  </span>
                </div>
              </div>

              {/* PayPal Option (disabled in demo) */}
              <div className="border border-gray-200 rounded-md p-4 cursor-not-allowed bg-gray-50 opacity-60">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="paypal"
                    disabled
                    className="h-4 w-4 text-gray-400 border-gray-300 focus:ring-gray-400"
                  />
                  <span className="ml-2">PayPal</span>
                </div>
              </div>

              {/* Apple Pay Option (disabled in demo) */}
              <div className="border border-gray-200 rounded-md p-4 cursor-not-allowed bg-gray-50 opacity-60">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="apple_pay"
                    disabled
                    className="h-4 w-4 text-gray-400 border-gray-300 focus:ring-gray-400"
                  />
                  <span className="ml-2">Apple Pay</span>
                </div>
              </div>
            </div>

            {/* Demo Note */}
            <div className="mt-4 flex items-start bg-blue-50 p-3 rounded-md">
              <AlertCircle
                size={16}
                className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-blue-700">
                For demo purposes, only Credit/Debit Card option is enabled. No
                actual payment will be processed.
              </p>
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === "credit_card" && (
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    {...register("card_number", {
                      required: "Card number is required",
                      pattern: {
                        value: /^[0-9]{13,19}$/,
                        message: "Please enter a valid card number",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    maxLength={16}
                  />
                  {errors.card_number && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.card_number.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    {...register("card_holder", {
                      required: "Card holder name is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors.card_holder && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.card_holder.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    {...register("expiry_date", {
                      required: "Expiry date is required",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: "Please enter a valid expiry date (MM/YY)",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors.expiry_date && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.expiry_date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="•••"
                    {...register("cvv", {
                      required: "CVV is required",
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: "Please enter a valid CVV",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Demo Cards Note */}
              <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Use these test card numbers:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Visa: 4111 1111 1111 1111</li>
                  <li>Mastercard: 5555 5555 5555 4444</li>
                  <li>Any future expiry date and any 3-digit CVV will work</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Shipping
        </button>

        <button
          onClick={handleSubmit(onSubmitForm)}
          className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};
