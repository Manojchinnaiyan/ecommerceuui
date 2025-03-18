// components/profile/address-book.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Check, X, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  fetchUserAddresses,
  addNewAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/user";
import { Address } from "@/types/address";
import { toast } from "react-toastify";

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Address>>();

  // Fetch addresses
  useEffect(() => {
    const getAddresses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserAddresses();
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to load addresses");
      } finally {
        setIsLoading(false);
      }
    };

    getAddresses();
  }, []);

  // Handle form submission for new address
  const onSubmitNew = async (data: Partial<Address>) => {
    try {
      setIsLoading(true);
      const newAddress = await addNewAddress({
        ...data,
        is_default: false,
      });

      setAddresses([...addresses, newAddress]);
      setIsAddingNew(false);
      reset();
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for editing address
  const onSubmitEdit = async (data: Partial<Address>) => {
    if (!editingId) return;

    try {
      setIsLoading(true);
      const updatedAddress = await updateAddress(editingId, data);

      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...addr, ...updatedAddress } : addr
        )
      );

      setEditingId(null);
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting address
  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);

      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle setting address as default
  const handleSetDefault = async (id: number, type: "shipping" | "billing") => {
    try {
      setIsLoading(true);
      await setDefaultAddress(id, type);

      // Update local state
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default:
            addr.id === id && addr.address_type === type
              ? true
              : addr.address_type === type
              ? false
              : addr.is_default,
        }))
      );

      toast.success(`Default ${type} address updated`);
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare initial values for edit form
  const startEditing = (address: Address) => {
    reset(address);
    setEditingId(address.id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    reset();
  };

  // Start adding new address
  const startAddingNew = (type: "shipping" | "billing") => {
    reset({ address_type: type });
    setIsAddingNew(true);
  };

  // Cancel adding new address
  const cancelAddingNew = () => {
    setIsAddingNew(false);
    reset();
  };

  // Filter addresses by type
  const shippingAddresses = addresses.filter(
    (addr) => addr.address_type === "shipping"
  );
  const billingAddresses = addresses.filter(
    (addr) => addr.address_type === "billing"
  );

  // Address form component (reused for both new and edit)
  const AddressForm = ({
    onSubmit,
    onCancel,
    addressType,
  }: {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    addressType?: "shipping" | "billing";
  }) => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 p-4 rounded-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="hidden">
          <input
            type="radio"
            id="address_type_shipping"
            value="shipping"
            {...register("address_type", { required: true })}
            defaultChecked={addressType === "shipping"}
          />
          <input
            type="radio"
            id="address_type_billing"
            value="billing"
            {...register("address_type", { required: true })}
            defaultChecked={addressType === "billing"}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            {...register("full_name", { required: "Full name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            {...register("street_address", {
              required: "Street address is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.street_address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.street_address.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State / Province
          </label>
          <input
            type="text"
            {...register("state", { required: "State is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            {...register("postal_code", {
              required: "Postal code is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.postal_code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postal_code.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            {...register("country", { required: "Country is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Country</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? "Saving..." : "Save Address"}
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

  // Render address card component
  const AddressCard = ({ address }: { address: Address }) => (
    <div className="border rounded-md p-4">
      {editingId === address.id ? (
        <AddressForm
          onSubmit={onSubmitEdit}
          onCancel={cancelEditing}
          addressType={address.address_type}
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">{address.full_name}</h3>
              {address.is_default && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Default{" "}
                  {address.address_type === "shipping" ? "Shipping" : "Billing"}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEditing(address)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                disabled={deletingId === address.id}
                className="p-1 text-gray-500 hover:text-red-600 disabled:text-gray-300"
              >
                {deletingId === address.id ? (
                  <div className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>{address.street_address}</p>
            <p>
              {address.city}, {address.state} {address.postal_code}
            </p>
            <p>{address.country}</p>
            <p className="mt-1">{address.phone}</p>
          </div>

          {!address.is_default && (
            <button
              onClick={() => handleSetDefault(address.id, address.address_type)}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Check size={14} className="mr-1" />
              Set as Default{" "}
              {address.address_type === "shipping" ? "Shipping" : "Billing"}
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Address Book</h2>
      </div>

      <div className="p-6">
        {isLoading && !isAddingNew && !editingId ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Shipping Addresses */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Shipping Addresses</h3>
                <button
                  onClick={() => startAddingNew("shipping")}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add New
                </button>
              </div>

              {isAddingNew && register("address_type").value === "shipping" && (
                <div className="mb-6">
                  <AddressForm
                    onSubmit={onSubmitNew}
                    onCancel={cancelAddingNew}
                    addressType="shipping"
                  />
                </div>
              )}

              {shippingAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shippingAddresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-md flex items-start">
                  <AlertCircle
                    size={18}
                    className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-blue-700">
                    You don't have any shipping addresses yet. Add one to make
                    checkout easier.
                  </p>
                </div>
              )}
            </div>

            {/* Billing Addresses */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Billing Addresses</h3>
                <button
                  onClick={() => startAddingNew("billing")}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add New
                </button>
              </div>

              {isAddingNew && register("address_type").value === "billing" && (
                <div className="mb-6">
                  <AddressForm
                    onSubmit={onSubmitNew}
                    onCancel={cancelAddingNew}
                    addressType="billing"
                  />
                </div>
              )}

              {billingAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {billingAddresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-md flex items-start">
                  <AlertCircle
                    size={18}
                    className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-blue-700">
                    You don't have any billing addresses yet. Add one to make
                    checkout easier.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
