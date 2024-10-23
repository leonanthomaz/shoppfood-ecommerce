import { api, getMerchantCode } from '../services/api';
import { Product } from '../types/Product';


// ********** COMUM ************ */

// Função para obter produtos por storeCode
export const getProductsByMerchantCode = async (): Promise<Product[]> => {
  try {
    const merchantCode = import.meta.env.VITE_API_MERCHANT_CODE;
    const response = await api.post('/products/store', { merchantCode });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    throw error;
  }
};

// Função para obter um produto por ID e código da loja
export const getProductByIdAndMerchantCode = async (productId: number): Promise<Product> => {
  try {
    const merchantCode = getMerchantCode();
    const response = await api.post(`/products/${productId}/store`, { merchantCode });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    throw error;
  }
};

// Função para obter um produto por ID e código da loja
export const getProductByCodeProductAndMerchantCode = async (codeProduct: string): Promise<Product> => {
  try {
    const merchantCode = getMerchantCode();
    const response = await api.post(`/products/find/${codeProduct}`, { merchantCode });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    throw error;
  }
};

export const fetchImageUrl = async (filename: string): Promise<string> => {
  try {
    const response = await api.get(`/uploads?filename=${filename}`, {
      responseType: 'blob' // Para receber a imagem como blob
    });

    // Cria uma URL para o blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Erro ao carregar a imagem:', error);
    throw error;
  }
};

// Função para obter uma imagem pelo nome do arquivo
export const getImageByFilename = async (filename: string): Promise<string> => {
  try {
    const response = await api.get(`/products/images/${filename}`, {
      responseType: 'blob' // Define o tipo de resposta como blob para lidar com arquivos binários
    });
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error('Erro ao obter imagem:', error);
    throw error;
  }
};
