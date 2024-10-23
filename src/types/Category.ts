import { Product } from "./Product";

export interface CategoryDTO {
    id: number;
    name: string;
    merchantCode: string;
    description: string;
  }
  
export interface Category {
  id: number;
  name: string;
  products: Product[];
}

export interface CategoryWithProduct {
  id: number;
  name: string;
  products: Product[];
}
