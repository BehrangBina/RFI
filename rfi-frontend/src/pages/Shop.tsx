import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(true);
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(p => p.category)));
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46A2B9] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-2 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <i className="fa-solid fa-store mr-3 text-[#46A2B9]"></i>
            Shop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support Rise For Iran by purchasing merchandise, books, and more.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#46A2B9] text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#46A2B9] text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addingRef = useRef(false);
  
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addingRef.current) return; // Prevent double-clicks
    
    addingRef.current = true;
    setIsAdding(true);
    addToCart(product, 1);
    setShowAddedToast(true);
    
    setTimeout(() => {
      setShowAddedToast(false);
      setIsAdding(false);
      addingRef.current = false;
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {showAddedToast && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-medium whitespace-nowrap">
          ✓ Added to cart!
        </div>
      )}

      <Link
        to={`/shop/product/${product.slug}`}
        className="block group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fa-solid fa-image text-6xl text-gray-300"></i>
            </div>
          )}
          
          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Low Stock
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-[#46A2B9] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#46A2B9] transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            
            <div className="flex items-center gap-2">
              {product.requiresShipping && (
                <i className="fa-solid fa-truck text-gray-400 text-sm" title="Shipping required"></i>
              )}
              <span className="text-sm text-gray-500">
                {product.stockQuantity} left
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || isAdding}
              className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isOutOfStock || isAdding
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white border-2 border-[#46A2B9] text-[#46A2B9] hover:bg-[#46A2B9] hover:text-white'
              }`}
            >
              <i className="fa-solid fa-cart-plus"></i>
              {isAdding ? 'Adding...' : 'Add'}
            </button>
            <div className="flex-1 py-2 rounded-lg font-medium bg-[#46A2B9] text-white hover:bg-[#5bc0de] transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer">
              View
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Shop;
