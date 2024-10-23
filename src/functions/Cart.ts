import axios from 'axios';
import { getCartCode, getMerchantCode, saveCartCode } from '../services/api';
import { CartDTO } from '../types/Cart';
import { CheckoutDTO } from '../types/Checkout';

const base_URL = import.meta.env.VITE_API_BASE_URL_ECOMMERCE;

// BUSCAR carrinho
export const getCartByCode = async (): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.get(`${base_URL}/cart/find/${cartCode}`); // cartCode como parte da URL
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw error;
    }
};

export const getCartCodeByCode = async (cartCode: string): Promise<CartDTO> => {
    try {
        const response = await axios.get(`${base_URL}/cart/find/${cartCode}`); // cartCode como parte da URL
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw error;
    }
};

// Criar carrinho
export const createCart = async (): Promise<CartDTO> => {
    try {
        const merchantCode = getMerchantCode();
        const response = await axios.post(`${base_URL}/cart/create`, { merchantCode });
        saveCartCode(response.data.cartCode);
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao criar carrinho:', error);
        throw error;
    }
};

// Adicionar item ao carrinho de validação
export const addItemToCart = async (codeProduct: string): Promise<CartDTO> => {
    try {
        const merchantCode = getMerchantCode();
        const cartCode = getCartCode();
        const response = await axios.post(`${base_URL}/cart/add`, null, {
            params: { merchantCode, cartCode, codeProduct }
        });
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        throw error;
    }
};

export const insert = async (codeProduct: string) => {
    try {
        const merchantCode = getMerchantCode();
        const cartCode = getCartCode();
        const response = await axios.post(`${base_URL}/cart/insert`, null, {
            params: { merchantCode, cartCode, codeProduct }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        throw error;
    }
};

// Função para buscar um produto específico no carrinho
export const getProductInCart = async (cartCode: string, productId: number) => {
    try {
        const response = await axios.get(`${base_URL}/cart/find/${cartCode}/product/${productId}`);
        return response.data; // Aqui você pode retornar os dados do produto ou fazer outra coisa com eles
    } catch (error) {
        console.error('Erro ao buscar o produto no carrinho:', error);
        throw error; // Propaga o erro para que você possa lidar com ele na chamada
    }
}

// Incrementar item no carrinho
export const incrementItemInCart = async (productId: number, codeProduct: string): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.put(`${base_URL}/cart/increment`, { cartCode, codeProduct, productId });
        return response.data;
    } catch (error) {
        console.error('Erro ao incrementar item:', error);
        throw error;
    }
};

// Decrementar item no carrinho
export const decrementItemInCart = async (productId: number, codeProduct: string): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.put(`${base_URL}/cart/decrement`, { cartCode, codeProduct, productId });
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao decrementar item:', error);
        throw error;
    }
};

// Remover item do carrinho
export const removeItemFromCart = async (codeProduct: string): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.delete(`${base_URL}/cart/remove`, {
            params: { cartCode, codeProduct }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao remover item:', error);
        throw error;
    }
};

// Limpar carrinho
export const clearCart = async (): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.delete(`${base_URL}/cart/clear`, {
            params: { cartCode }
        });
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        throw error;
    }
};

// Deletar carrinho
export const deleteCart = async (): Promise<void> => {
    try {
        const cartCode = getCartCode();
        await axios.delete(`${base_URL}/cart/delete`, {
            params: { cartCode }
        });
        localStorage.removeItem("CART_CODE");
    } catch (error) {
        console.error('Erro ao deletar carrinho:', error);
        throw error;
    }
};

// Incrementar opção do produto no carrinho
export const incrementOptionInCart = async (codeProduct: string, codeOption: string): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.put(`${base_URL}/cart/increment-option`, { cartCode, codeProduct, codeOption });
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao incrementar opção no carrinho:', error);
        throw error;
    }
};

// Decrementar opção do produto no carrinho
export const decrementOptionInCart = async (codeProduct: string, codeOption: string): Promise<CartDTO> => {
    try {
        const cartCode = getCartCode();
        const response = await axios.put(`${base_URL}/cart/decrement-option`, { cartCode, codeProduct, codeOption });
        return response.data; // Assegure-se de que `response.data` está conforme o tipo `CartDTO`
    } catch (error) {
        console.error('Erro ao decrementar opção no carrinho:', error);
        throw error;
    }
};

export const insertObservationInItemCart = async (codeProduct: string, observation: string) => {
    try {
      const cartCode = getCartCode();
      const response = await axios.put(`${base_URL}/cart/add-observation`, {
        observation: observation
      }, {
        params: {
          cartCode: cartCode,
          codeProduct: codeProduct
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 202) {
        console.log('Observação inserida com sucesso:', response.data);
        return response.data; // Retorna a mensagem de sucesso ou o que o backend enviar
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Erro ao inserir observação:', error.response.data);
        return error.response.data;
      } else if (error.request) {
        console.error('Erro de comunicação com o servidor:', error.request);
        return 'Erro de comunicação com o servidor.';
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
        return 'Erro ao configurar a requisição.';
      }
    }
};

export const processingCheckout = async (checkoutDTO: CheckoutDTO) => {
    try {
        const response = await axios.post(`${base_URL}/checkout/send`, checkoutDTO);
        // localStorage.removeItem("CART_CODE");
        localStorage.setItem("ORDER_CODE", response.data.orderCode);
    } catch (error) {
        console.error('Erro ao processar o checkout >>> FUNÇÃO');
    }
};


  