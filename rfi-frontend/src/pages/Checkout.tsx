import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import { PaymentMethodOption, PaymentMethodType } from '../types/Order';
import { ShippingInfo } from '../types/Cart';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Iran',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');

  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with Stripe',
      icon: 'fa-credit-card',
      comingSoon: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Fast and secure PayPal checkout',
      icon: 'fa-paypal',
      comingSoon: true,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer (manual verification)',
      icon: 'fa-building-columns',
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: 'fa-money-bill-wave',
    },
  ];

  const shippingCost = cart.totalPrice > 50 ? 0 : 5;
  const totalWithShipping = cart.totalPrice + shippingCost;

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    navigate('/shop');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = (): boolean => {
    if (!shippingInfo.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!shippingInfo.email.trim() || !shippingInfo.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!shippingInfo.city.trim()) {
      setError('City is required');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1 && !validateStep1()) return;
    setStep((step + 1) as 1 | 2 | 3);
  };

  const handlePreviousStep = () => {
    setError(null);
    setStep((step - 1) as 1 | 2 | 3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customerName: shippingInfo.fullName,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone || undefined,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingPostalCode: shippingInfo.postalCode || undefined,
        shippingCountry: shippingInfo.country,
        paymentMethod: paymentMethod,
        items: cart.items.map(item => ({
          itemType: 'Product' as const,
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to confirmation page
      navigate(`/order-confirmation/${order.orderNumber}`, {
        state: { order, paymentMethod },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="text-[#46A2B9] hover:text-[#5bc0de] font-medium flex items-center gap-2 mb-4 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? 'bg-[#46A2B9] text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {s}
                  </div>
                  <span className={`text-sm ${s <= step ? 'text-white' : 'text-gray-400'}`}>
                    {s === 1 && 'Shipping'}
                    {s === 2 && 'Payment'}
                    {s === 3 && 'Review'}
                  </span>
                </div>
                {s < 3 && <div className="flex-1 h-0.5 bg-gray-600"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                          placeholder="Tehran"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46A2B9] focus:border-transparent"
                          placeholder="Iran"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 px-6 py-3 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-[#46A2B9] bg-[#46A2B9]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method.comingSoon && (
                          <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            Coming Soon
                          </span>
                        )}
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-[#46A2B9]' : 'border-gray-300'
                          }`}>
                            {paymentMethod === method.id && (
                              <div className="w-3 h-3 rounded-full bg-[#46A2B9]"></div>
                            )}
                          </div>
                          <i className={`fa-solid ${method.icon} text-2xl text-gray-700`}></i>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 px-6 py-3 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                  
                  {/* Shipping Info Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping To:</h3>
                    <p className="text-gray-700">{shippingInfo.fullName}</p>
                    <p className="text-gray-600 text-sm">{shippingInfo.email}</p>
                    {shippingInfo.phone && <p className="text-gray-600 text-sm">{shippingInfo.phone}</p>}
                    <p className="text-gray-600 text-sm mt-2">
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.postalCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Method:</h3>
                    <p className="text-gray-700">
                      {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items:</h3>
                    <div className="space-y-2">
                      {cart.items.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handlePreviousStep}
                      disabled={loading}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i>
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              {shippingCost === 0 && (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2">
                  <i className="fa-solid fa-truck-fast"></i>
                  Free shipping on orders over $50
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
