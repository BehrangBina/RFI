export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subtotalPrice: number;
  shippingCost: number;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  orderDate: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  trackingNumber?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  itemType: 'Product' | 'EventTicket';
  itemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productId?: number;
  eventId?: number;
  ticketCodes?: string[];
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  items: CreateOrderItem[];
}

export interface CreateOrderItem {
  itemType: 'Product' | 'EventTicket';
  productId?: number;
  eventId?: number;
  quantity: number;
}

export type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

export interface PaymentMethodOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
}
