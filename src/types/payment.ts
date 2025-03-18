// types/payment.ts
import { Order } from "./order";

export interface Payment {
  id: number;
  order: Order;
  payment_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface RazorpayOrder {
  order_id: number;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface Refund {
  id: number;
  payment: Payment;
  refund_id: string;
  amount: number;
  reason: string;
  status: "pending" | "processed" | "rejected";
  created_at: string;
  updated_at: string;
}
