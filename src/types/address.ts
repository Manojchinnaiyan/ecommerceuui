// types/address.ts
export interface Address {
  id: number;
  user: number; // User ID
  address_type: "shipping" | "billing";
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  phone?: string;
  full_name?: string; // Added for checkout convenience
}
