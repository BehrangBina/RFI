import { Product, CreateProductDto, UpdateProductDto } from '../types/Product';

const API_BASE_URL = 'http://localhost:5000/api';

export const productService = {
  // Get all products
  async getAllProducts(activeOnly = false): Promise<Product[]> {
    const url = `${API_BASE_URL}/shop/products${activeOnly ? '?activeOnly=false' : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/shop/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  // Create new product
  async createProduct(product: CreateProductDto, token: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/shop/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  // Update product
  async updateProduct(id: number, product: UpdateProductDto, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shop/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
  },

  // Delete product
  async deleteProduct(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shop/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },
};
