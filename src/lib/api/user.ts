// lib/api/user.ts
import apiClient from "./client";
import { User } from "@/types/user";
import { Address } from "@/types/address";

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get("/accounts/users/me/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await apiClient.patch(`/accounts/users/me/`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<any> => {
  try {
    const response = await apiClient.post("/accounts/users/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Get user addresses
export const fetchUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get("/accounts/addresses/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
};

// Add a new address
export const addNewAddress = async (
  addressData: Partial<Address>
): Promise<Address> => {
  try {
    const response = await apiClient.post("/accounts/addresses/", addressData);
    return response.data;
  } catch (error) {
    console.error("Error adding new address:", error);
    throw error;
  }
};

// Update an address
export const updateAddress = async (
  addressId: number,
  addressData: Partial<Address>
): Promise<Address> => {
  try {
    const response = await apiClient.patch(
      `/accounts/addresses/${addressId}/`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (addressId: number): Promise<void> => {
  try {
    await apiClient.delete(`/accounts/addresses/${addressId}/`);
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    throw error;
  }
};

// Set an address as default
export const setDefaultAddress = async (
  addressId: number,
  addressType: "shipping" | "billing"
): Promise<Address> => {
  try {
    const response = await apiClient.post(
      `/accounts/addresses/${addressId}/set_default/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error setting address ${addressId} as default:`, error);
    throw error;
  }
};
