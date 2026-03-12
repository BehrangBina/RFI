import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CartItem, Cart } from '../types/Cart';
import { Product } from '../types/Product';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rfi_shopping_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        return parsedCart;
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
        return { items: [], totalItems: 0, totalPrice: 0 };
      }
    }
    return { items: [], totalItems: 0, totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Calculate totals
  const calculateCart = (items: CartItem[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return { items, totalItems, totalPrice };
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        newItems = [...prevCart.items];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        // Don't exceed stock
        newItems[existingItemIndex].quantity = Math.min(newQuantity, product.stockQuantity);
      } else {
        // Add new item to cart
        newItems = [...prevCart.items, { product, quantity: Math.min(quantity, product.stockQuantity) }];
      }
      
      return calculateCart(newItems);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      return calculateCart(newItems);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.product.id === productId) {
          // Don't exceed stock
          const newQuantity = Math.min(quantity, item.product.stockQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return calculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  const isInCart = (productId: number): boolean => {
    return cart.items.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
