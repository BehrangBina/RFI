import { Order, CreateOrderRequest } from '../types/Order';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const orderService = {
  // Create a new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await fetch(`${API_URL}/api/shop/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/api/shop/orders/${orderNumber}`);

    if (!response.ok) {
      throw new Error('Order not found');
    }

    return response.json();
  },
};
