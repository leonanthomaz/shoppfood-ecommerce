// src/types/Cart.ts

import { ReactNode } from "react";

// Define o tipo para o contexto do carrinho
export interface CartContextType {
  children: ReactNode;
}

// Define o tipo para o Cart
export interface Cart {
  id: number;
  cartCode: string;
  status: CartStatus;
  total: number;
  updatedAt: Date;
  createdAt: Date;
  items: CartItem[];
}

// Define o tipo para o item do Cart
export interface CartItem {
  id: number;
  productId: number;
  codeProduct?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
  status: CartItemStatus;
  options: CartItemOption[];
  categoryName: string;
  observation?: string; // Campo para a observação, opcional
}

// Define o tipo para a opção do item do Cart
export interface CartItemOption {
  codeOption: any;
  id: number;
  name: string;
  price: number;
  quantity?: number; // Quantidade opcional
}

// Enum para o status do item do Cart
export enum CartItemStatus {
  BLOCKED = 'BLOCKED',
  RELEASED = 'RELEASED',
  PENDING = 'PENDING'
}

// Enum para o status do Cart
export enum CartStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROCESSING ='PROCESSING',
  FINISHED ='FINISHED',
}

// Define o tipo para o DTO do Cart
export interface CartDTO {
  id: number;
  cartCode: string;
  orderCode?: string;
  status: CartStatus;
  total: number;
  updatedAt: Date;
  createdAt: Date;
  items: CartItemDTO[];
}

// Define o tipo para o DTO do item do Cart
export interface CartItemDTO {
  id: number;
  productId: number;
  codeProduct?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  quantity: number;
  imageUrl?: string;
  totalPrice: number;
  status: CartItemStatus;
  options: CartItemOptionDTO[];
  categoryName: string;
  observation?: string; // Campo para a observação, opcional
}

// Define o tipo para o DTO da opção do item do Cart
export interface CartItemOptionDTO {
  id: number;
  codeOption: string;
  name: string;
  price: number;
  quantity?: number; // Quantidade opcional
}

export interface CartContextData {
  cart: Cart | null;
  getCartItem: (productId: number) => CartItem | undefined;
}
