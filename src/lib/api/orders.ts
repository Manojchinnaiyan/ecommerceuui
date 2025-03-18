// lib/api/orders.ts
import apiClient from "./client";
import { Order, OrderDetails } from "@/types/order";

// Get user orders
export const getUserOrders = async (
  page = 1,
  limit = 10
): Promise<{ orders: Order[]; total: number; pages: number }> => {
  try {
    const response = await apiClient.get("/orders/orders/my-orders/", {
      params: { page, limit },
    });

    // Handle pagination format from Django REST Framework
    if ("results" in response.data) {
      return {
        orders: response.data.results,
        total: response.data.count,
        pages: Math.ceil(response.data.count / limit),
      };
    }

    // Handle non-paginated responses
    return {
      orders: response.data,
      total: response.data.length,
      pages: 1,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (
  orderId: string
): Promise<OrderDetails> => {
  try {
    const response = await apiClient.get(`/orders/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order details for order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: {
  shipping_address_id: number;
  billing_address_id: number;
  use_shipping_for_billing?: boolean;
  shipping_cost?: number;
}): Promise<OrderDetails> => {
  try {
    const response = await apiClient.post("/orders/orders/", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.post(`/orders/orders/${orderId}/cancel/`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};
