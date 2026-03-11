import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { productService } from '../services/productService';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!product) return;
    
    // For now, just show an alert. You can implement cart functionality later
    alert(`Added ${quantity} x ${product.name} to cart!\n\nCart functionality coming soon.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // For now, just show an alert. You can implement checkout later
    alert(`Buy Now: ${quantity} x ${product.name}\n\nCheckout functionality coming soon.`);
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
                  src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
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
              <div className="mb-6">
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
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-2 border-[#46A2B9] text-[#46A2B9] hover:bg-[#46A2B9] hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#46A2B9] text-white hover:bg-[#5bc0de] shadow-lg hover:shadow-xl'
                  }`}
                >
                  <i className="fa-solid fa-bolt"></i>
                  Buy Now
                </button>
              </div>

              {/* Coming Soon Notice */}
              {!isOutOfStock && (
                <p className="mt-4 text-sm text-gray-500 text-center">
                  <i className="fa-solid fa-info-circle mr-1"></i>
                  Full checkout functionality coming soon
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
