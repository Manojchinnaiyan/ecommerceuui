// lib/api/payments.ts
import apiClient from "./client";
import { Payment, RazorpayOrder } from "@/types/payment";

// Create a Razorpay order
export const createRazorpayOrder = async (
  orderId: string
): Promise<RazorpayOrder> => {
  try {
    const response = await apiClient.post(
      "/payments/payments/create_razorpay_order/",
      {
        order_id: orderId,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating Razorpay order for order ${orderId}:`, error);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<Payment> => {
  try {
    const response = await apiClient.post(
      "/payments/payments/verify_payment/",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Get payments for a user
export const getUserPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiClient.get("/payments/payments/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user payments:", error);
    throw error;
  }
};

// Request a refund
export const requestRefund = async (
  paymentId: string,
  amount: number,
  reason: string
): Promise<any> => {
  try {
    const response = await apiClient.post("/payments/refunds/request_refund/", {
      payment_id: paymentId,
      amount,
      reason,
    });
    return response.data;
  } catch (error) {
    console.error(`Error requesting refund for payment ${paymentId}:`, error);
    throw error;
  }
};
