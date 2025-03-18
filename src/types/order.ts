// types/order.ts
import { Product } from "./product";
import { Address } from "./address";

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  user: {
    id: number;
    email: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderDetails extends Order {
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  shipping_name: string;
  shipping_address_line: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  billing_name: string;
  billing_address_line: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  payment_id?: string;
}
