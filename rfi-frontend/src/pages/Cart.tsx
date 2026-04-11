import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config/api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <i className="fa-solid fa-cart-shopping text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-[#00AEB2] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
          <button
            onClick={() => navigate('/shop')}
            className="text-[#00AEB2] hover:text-[#5bc0de] font-medium flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img
                      src={`${API_BASE_URL}${item.product.imageUrl}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fa-solid fa-image text-4xl"></i>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="Remove from cart"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>

                  {item.product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          <i className="fa-solid fa-minus text-sm"></i>
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.product.stockQuantity}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          <i className="fa-solid fa-plus text-sm"></i>
                        </button>
                      </div>
                      {item.quantity >= item.product.stockQuantity && (
                        <span className="text-xs text-orange-500">Max stock reached</span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </div>
                      <div className="text-xl font-bold text-[#00AEB2]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              className="w-full py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <i className="fa-solid fa-trash-can mr-2"></i>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items):</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium text-green-600">Calculated at checkout</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#00AEB2]">${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#00AEB2] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium mb-3"
              >
                <i className="fa-solid fa-lock mr-2"></i>
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full py-3 border-2 border-[#00AEB2] text-[#00AEB2] rounded-lg hover:bg-[#00AEB2] hover:text-white transition-colors font-medium"
              >
                Continue Shopping
              </button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-shield-halved text-green-600 mt-1"></i>
                  <span>Secure checkout protected by SSL encryption</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-truck text-blue-600 mt-1"></i>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-rotate-left text-purple-600 mt-1"></i>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
