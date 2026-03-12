import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Order } from '../types/Order';
import { orderService } from '../services/orderService';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState<string | null>(null);
  const paymentMethod = location.state?.paymentMethod;

  const loadOrder = useCallback(async () => {
    if (!orderNumber) return;
    
    try {
      setLoading(true);
      const data = await orderService.getOrderByNumber(orderNumber);
      setOrder(data);
    } catch (err) {
      setError('Order not found');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    if (!order && orderNumber) {
      loadOrder();
    }
  }, [order, orderNumber, loadOrder]);

  const handlePrint = () => {
    window.print();
  };

  const getPaymentInstructions = () => {
    switch (paymentMethod) {
      case 'bank_transfer':
        return {
          title: 'Bank Transfer Instructions',
          instructions: [
            'Bank Name: Rise For Iran Bank',
            'Account Number: 1234567890',
            'SWIFT Code: RFIIRAN01',
            'Reference: ' + order?.orderNumber,
            'Please include your order number in the transfer description',
          ],
        };
      case 'credit_card':
      case 'paypal':
        return {
          title: 'Payment Processing',
          instructions: [
            'Online payment integration coming soon!',
            'For now, please use Bank Transfer.',
            'We\'ll notify you once online payments are available.',
          ],
        };
      default:
        return {
          title: 'Payment Instructions',
          instructions: ['Please contact us for payment details.'],
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46A2B9] mx-auto mb-4"></div>
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <i className="fa-solid fa-circle-xmark text-6xl text-red-500 mb-4"></i>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paymentInstructions = getPaymentInstructions();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center print:shadow-none">
          <div className="mb-4">
            <i className="fa-solid fa-circle-check text-6xl text-green-500"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-4">
            Your order has been received and is being processed.
          </p>
          <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-[#46A2B9]">{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 print:shadow-none">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-gray-700">{order.customerName}</p>
              <p className="text-gray-600 text-sm">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-gray-600 text-sm">{order.customerPhone}</p>}
            </div>

            {/* Shipping Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600 text-sm">
                {order.shippingAddress}<br />
                {order.shippingCity}, {order.shippingPostalCode}<br />
                {order.shippingCountry}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.itemName}</p>
                    <p className="text-sm text-gray-600">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${order.subtotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className={order.shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Payment Status:</span>
            <span className={`px-3 py-1 rounded-full font-medium ${
              order.paymentStatus === 'Completed' 
                ? 'bg-green-100 text-green-800'
                : order.paymentStatus === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentMethod && order.paymentStatus === 'Pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 print:border-gray-300">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-blue-500"></i>
              {paymentInstructions.title}
            </h2>
            <ul className="space-y-2">
              {paymentInstructions.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <i className="fa-solid fa-chevron-right text-sm text-blue-500 mt-1"></i>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 print:shadow-none">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Important Information</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>A confirmation email will be sent to {order.customerEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>You can track your order using order number: {order.orderNumber}</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>Estimated delivery time: 3-5 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>For any questions, contact us at support@riseforiran.org</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 px-6 py-3 bg-white border-2 border-[#46A2B9] text-[#46A2B9] rounded-lg hover:bg-[#46A2B9] hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-print"></i>
            Print Receipt
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 px-6 py-3 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
