// components/profile/payment-methods.tsx
"use client";

import { useState } from "react";
import { CreditCard, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Mock payment method type
interface PaymentMethod {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
  cardType: "visa" | "mastercard" | "amex" | "discover";
}

export const PaymentMethods = () => {
  // Mock data - in a real app, this would come from an API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      cardNumber: "**** **** **** 1234",
      cardholderName: "John Doe",
      expiryDate: "12/25",
      isDefault: true,
      cardType: "visa",
    },
    {
      id: 2,
      cardNumber: "**** **** **** 5678",
      cardholderName: "John Doe",
      expiryDate: "06/24",
      isDefault: false,
      cardType: "mastercard",
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<PaymentMethod> & { cvv: string }>();

  // Handle adding a new payment method
  const onSubmitNew = async (data: any) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new payment method object
      const newPaymentMethod: PaymentMethod = {
        id: Math.max(0, ...paymentMethods.map((p) => p.id)) + 1,
        cardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`,
        cardholderName: data.cardholderName,
        expiryDate: data.expiryDate,
        isDefault: paymentMethods.length === 0, // Make default if it's the first
        cardType: detectCardType(data.cardNumber),
      };

      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setIsAddingNew(false);
      reset();
      toast.success("Payment method added successfully!");
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a payment method
  const onSubmitEdit = async (data: any) => {
    if (!editingId) return;

    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedMethod = paymentMethods.map((method) =>
        method.id === editingId
          ? {
              ...method,
              cardholderName: data.cardholderName,
              expiryDate: data.expiryDate,
            }
          : method
      );

      setPaymentMethods(updatedMethod);
      setEditingId(null);
      reset();
      toast.success("Payment method updated successfully!");
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a payment method
  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If we're deleting the default, make the first remaining one default
      const deletingDefault = paymentMethods.find(
        (m) => m.id === id
      )?.isDefault;

      let updatedMethods = paymentMethods.filter((method) => method.id !== id);

      if (deletingDefault && updatedMethods.length > 0) {
        updatedMethods = updatedMethods.map((method, index) =>
          index === 0 ? { ...method, isDefault: true } : method
        );
      }

      setPaymentMethods(updatedMethods);
      toast.success("Payment method deleted successfully!");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting a payment method as default
  const handleSetDefault = async (id: number) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }));

      setPaymentMethods(updatedMethods);
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to update default payment method");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect card type from number
  const detectCardType = (cardNumber: string): PaymentMethod["cardType"] => {
    // Basic detection logic
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    if (cardNumber.startsWith("3")) return "amex";
    if (cardNumber.startsWith("6")) return "discover";
    return "visa"; // Default
  };

  // Prepare form for editing
  const startEditing = (method: PaymentMethod) => {
    reset({
      cardholderName: method.cardholderName,
      expiryDate: method.expiryDate,
    });
    setEditingId(method.id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    reset();
  };

  // Start adding new
  const startAddingNew = () => {
    reset();
    setIsAddingNew(true);
  };

  // Cancel adding new
  const cancelAddingNew = () => {
    setIsAddingNew(false);
    reset();
  };

  // Payment method form (reused for both new and edit)
  const PaymentMethodForm = ({
    onSubmit,
    onCancel,
    isEditing = false,
  }: {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
  }) => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 p-4 rounded-md"
    >
      {!isEditing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            placeholder="**** **** **** ****"
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^[0-9]{13,19}$/,
                message: "Please enter a valid card number",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.cardNumber.message}
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="Name on card"
          {...register("cardholderName", {
            required: "Cardholder name is required",
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.cardholderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.cardholderName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            {...register("expiryDate", {
              required: "Expiry date is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                message: "Please enter a valid expiry date (MM/YY)",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.expiryDate.message}
            </p>
          )}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              placeholder="***"
              {...register("cvv", {
                required: "CVV is required",
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "Please enter a valid CVV",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Card" : "Add Card"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  // Render payment method card
  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <div className="border rounded-md p-4">
      {editingId === method.id ? (
        <PaymentMethodForm
          onSubmit={onSubmitEdit}
          onCancel={cancelEditing}
          isEditing={true}
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-6 mr-3 flex items-center justify-center">
                {method.cardType === "visa" && (
                  <div className="text-blue-600 font-bold">VISA</div>
                )}
                {method.cardType === "mastercard" && (
                  <div className="text-red-600 font-bold">MC</div>
                )}
                {method.cardType === "amex" && (
                  <div className="text-blue-800 font-bold">AMEX</div>
                )}
                {method.cardType === "discover" && (
                  <div className="text-orange-600 font-bold">DISC</div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{method.cardNumber}</h3>
                {method.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEditing(method)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(method.id)}
                disabled={isLoading}
                className="p-1 text-gray-500 hover:text-red-600 disabled:text-gray-300"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>{method.cardholderName}</p>
            <p>Exp: {method.expiryDate}</p>
          </div>

          {!method.isDefault && (
            <button
              onClick={() => handleSetDefault(method.id)}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <CreditCard size={14} className="mr-1" />
              Set as Default
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Payment Methods</h2>
      </div>

      <div className="p-6">
        {/* Add New Button */}
        {!isAddingNew && (
          <div className="mb-6">
            <button
              onClick={startAddingNew}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus size={18} className="mr-2" />
              Add New Payment Method
            </button>
          </div>
        )}

        {/* Add New Form */}
        {isAddingNew && (
          <div className="mb-6">
            <h3 className="font-medium mb-4">Add New Payment Method</h3>
            <PaymentMethodForm
              onSubmit={onSubmitNew}
              onCancel={cancelAddingNew}
            />
          </div>
        )}

        {/* Demo Notice */}
        <div className="bg-yellow-50 p-4 rounded-md flex items-start mb-6">
          <AlertCircle
            size={18}
            className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm text-yellow-700 font-medium">Demo Mode</p>
            <p className="text-sm text-yellow-600">
              This is a demo interface. In a real application, payment
              information would be securely stored with a payment processor like
              Stripe or Braintree, not on our servers.
            </p>
          </div>
        </div>

        {/* Payment Methods List */}
        <h3 className="font-medium mb-4 text-lg">Your Payment Methods</h3>

        {paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-md flex items-start">
            <AlertCircle
              size={18}
              className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-blue-700">
              You don't have any payment methods saved yet. Add one to make
              checkout easier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
