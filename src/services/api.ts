import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const getMerchantCode = (): string => {
  return import.meta.env.VITE_API_MERCHANT_CODE;
};

export const getCartCode = (): string => {
  return localStorage.getItem("CART_CODE") || '';
};

export const saveCartCode = (cartCode: string) => {
  localStorage.setItem("CART_CODE", cartCode);
};

export const getToken = (): string => {
  return localStorage.getItem("USER_TOKEN") || '';
};

export const getUserId = (): number | null => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }
  return null;
};
