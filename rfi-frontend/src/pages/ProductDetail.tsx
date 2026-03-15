import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config/api';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addingRef = useRef(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts(true);
        const foundProduct = allProducts.find(p => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProductData();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || addingRef.current) return;
    
    console.log('🛒 Adding to cart:', { productId: product.id, quantity, timestamp: Date.now() });
    addingRef.current = true;
    setIsAdding(true);
    addToCart(product, quantity);
    setShowAddedToast(true);
    
    setTimeout(() => {
      setShowAddedToast(false);
      setIsAdding(false);
      addingRef.current = false;
    }, 1500);
  };

  const handleBuyNow = () => {
    if (!product || addingRef.current) return;
    
    addingRef.current = true;
    setIsAdding(true);
    addToCart(product, quantity);
    
    // Small delay to ensure cart is updated before navigation
    setTimeout(() => {
      navigate('/cart');
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46A2B9] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <p className="text-red-400 mb-4 text-xl">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;
  const cartQuantity = product ? getItemQuantity(product.id) : 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showAddedToast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <i className="fa-solid fa-circle-check text-xl"></i>
          <span className="font-medium">Added to cart!</span>
          <button
            onClick={() => navigate('/cart')}
            className="underline hover:no-underline"
          >
            View Cart
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-[#46A2B9] hover:text-[#5bc0de] font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Shop
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-image text-9xl text-gray-300"></i>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#46A2B9] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6 space-y-2">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <i className="fa-solid fa-circle-xmark"></i>
                    Out of Stock
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    Only {product.stockQuantity} left in stock
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <i className="fa-solid fa-circle-check"></i>
                    In Stock ({product.stockQuantity} available)
                  </div>
                )}
                {cartQuantity > 0 && (
                  <div className="flex items-center gap-2 text-[#46A2B9] text-sm">
                    <i className="fa-solid fa-shopping-cart"></i>
                    {cartQuantity} in your cart
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              {product.requiresShipping && (
                <div className="mb-6 flex items-center gap-2 text-gray-600">
                  <i className="fa-solid fa-truck"></i>
                  <span>Shipping required</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      aria-label="Decrease quantity"
                      title="Decrease quantity"
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(product.stockQuantity, Math.max(1, val)));
                      }}
                      min="1"
                      max={product.stockQuantity}
                      className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46A2B9]"
                      aria-label="Quantity"
                      title="Product quantity"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      aria-label="Increase quantity"
                      title="Increase quantity"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock || isAdding
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-2 border-[#46A2B9] text-[#46A2B9] hover:bg-[#46A2B9] hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isAdding}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock || isAdding
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#46A2B9] text-white hover:bg-[#5bc0de] shadow-lg hover:shadow-xl'
                  }`}
                >
                  <i className="fa-solid fa-bolt"></i>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
