import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { 
  getProductsByMerchantCode as apiGetProducts, 
  getProductByIdAndMerchantCode as apiGetProductByIdAndMerchantCode,
  getProductByCodeProductAndMerchantCode as apiGetProductByCodeProductAndMerchantCode, 
  fetchImageUrl as apiFetchImageUrl, 
  getImageByFilename as apiGetImageByFilename, 
} from '../functions/Product';
import { Product } from '../types/Product';
import { Category } from '../types/Category';
import { useGlobal } from '../contexts/GlobalContext';
import { 
  fetchCategoriesAndProducts as apiFetchCategoriesAndProducts, 
  getCategoriesWithProducts as  apiGetCategories} from '../functions/Category';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  fetchProducts: () => void;
  fetchProductById: (id: number) => Promise<Product>;
  fetchCategories: (filter?: string) => Promise<Category[]>;
  fetchCategoriesAndProducts: (filter?: string) => Promise<{ categories: Category[], products: Product[] }>;
  fetchImageUrl: (filename: string) => Promise<string>;
  getImageByFilename: (filename: string) => Promise<string>;
  getProductWithCredentials: (productId: number) => Promise<Product>;
  getProductWithCodeProduct: (codeProduct: string) => Promise<Product>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { setLoading } = useGlobal();

  const fetchProducts = async (): Promise<Product[]> => {
    setLoading(true)
    try {
      const data = await apiGetProducts();
      setProducts(data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Retorne um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const getProductWithCredentials = async (productId: number): Promise<Product> => {
    try{
        const response = await apiGetProductByIdAndMerchantCode(productId)
        return response
    } catch (error) {
        console.error("Erro ao recuperar produto pelo Id e Código de Usuário: ", error)
    }
  }

  const getProductWithCodeProduct = async (codeProduct: string): Promise<Product> => {
    try{
        const response = await apiGetProductByCodeProductAndMerchantCode(codeProduct)
        return response
    } catch (error) {
        console.error("Erro ao recuperar produto pelo Id e Código de Usuário: ", error)
    }
  }

  const fetchProductById = async (productId: number): Promise<Product> => {
    try {
      return await apiGetProductByIdAndMerchantCode(productId);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  };

  const fetchCategories = async (filter?: string): Promise<Category[]> => {
    try {
      const data = await apiGetCategories(filter);
      setCategories(data);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const fetchCategoriesAndProducts = async (filter?: string): Promise<{ categories: Category[], products: Product[] }> => {
    try {
      return await apiFetchCategoriesAndProducts(filter);
    } catch (error) {
      console.error('Error fetching categories and products:', error);
      throw error;
    }
  };

  const fetchImageUrl = async (filename: string): Promise<string> => {
    try {
      return await apiFetchImageUrl(filename);
    } catch (error) {
      console.error('Error fetching image URL:', error);
      throw error;
    }
  };

  const getImageByFilename = async (filename: string): Promise<string> => {
    try {
      return await apiGetImageByFilename(filename);
    } catch (error) {
      console.error('Error getting image by filename:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        fetchProducts, 
        fetchProductById, 
        fetchCategories, 
        fetchCategoriesAndProducts, 
        fetchImageUrl, 
        getImageByFilename,
        getProductWithCredentials,
        getProductWithCodeProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};