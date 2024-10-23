import { CartItemStatus } from "./Cart";
import { Category } from "./Category";

export interface Product {
  id: number;
  codeProduct: string;
  merchantCode: string;
  name: string;
  description: string;
  price: number;
  codeBar: string;
  getMinimumRequiredOptions?: number;
  stock?: number;
  imageUrl?: string;
  items?: ProductItem[];
  category?: Category;
  active?: boolean;
  createdAt?: string
  updatedAt?: string
}

export interface ProductItem {
  id: number;
  codeOption: string;
  name: string;
  additionalPrice: number;
  status: CartItemStatus;
  getMinimumRequiredOptions?: number;
  observation?: string; // Campo para a observação, opcional
}

export interface ProductDTO {
  id: number;
  merchantCode: string;
  name: string;
  description: string;
  imageUrl?: string;
  codeBar: string;
  price: number;
  createdAt?: string
  updatedAt?: string
}

export interface ProductDetailsDTO {
  name: string;
  merchantCode: string;
  description: string;
  price: number;
  imageUrl?: string;
  codeBar: string;
  stock: number;
  categoryId: number;
  createdAt?: string
  updatedAt?: string
}

export interface ProductOptionDTO {
  name: string;
  merchantCode: string;
  additionalPrice: number;
}