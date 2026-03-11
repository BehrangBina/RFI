export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  isActive: boolean;
  requiresShipping: boolean;
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string | null;
  category: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  requiresShipping: boolean;
}

export interface UpdateProductDto {
  name: string;
  description: string | null;
  category: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  isActive: boolean;
  requiresShipping: boolean;
}
