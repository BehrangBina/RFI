import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}
