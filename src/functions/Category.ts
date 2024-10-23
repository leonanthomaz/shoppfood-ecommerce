import { api } from '../services/api';
import { Category } from '../types/Category';
import { Product } from '../types/Product';

  // Função para obter categorias
  export const getCategoriesWithProducts = async (filter?: string): Promise<Category[]> => {
      try {
        const merchantCode = import.meta.env.VITE_API_MERCHANT_CODE;
        const response = await api.get('/categories/find', { params: { filter, merchantCode } });
        return response.data;
      } catch (error) {
        console.error('Erro ao obter categorias:', error);
        throw error;
      }
  };
  
  // Função para obter produtos e categorias
  export const fetchCategoriesAndProducts = async (filter?: string): Promise<{ categories: Category[], products: Product[] }> => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        api.get('/categories/find', { params: { filter } }),
        api.post('/products/store', { merchantCode: import.meta.env.VITE_API_MERCHANT_CODE })
      ]);
      return { categories: categoriesResponse.data, products: productsResponse.data };
    } catch (error) {
      console.error('Erro ao obter categorias e produtos:', error);
      throw error;
    }
  };