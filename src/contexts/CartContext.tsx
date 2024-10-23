// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartDTO, CartItem, CartItemOption } from '../types/Cart';
import { OrderPaymentDTO } from '../types/Payment';
import { 
  addItemToCart, 
  createCart, 
  removeItemFromCart, 
  incrementItemInCart, 
  decrementItemInCart, 
  incrementOptionInCart, 
  decrementOptionInCart, 
  getProductInCart,
  getCartByCode,
  processingCheckout as apiProcessingCheckout,
  deleteCart as apiDeleteCart,
  insertObservationInItemCart as apiInsertObservationInItemCart
} from '../functions/Cart';
import { useGlobal } from '../contexts/GlobalContext';
import { confirmePaymentProcessing } from '../functions/Payment';
import { useNavigate } from 'react-router-dom';
import { CheckoutDTO } from '../types/Checkout';

interface CartContextData {
  cart: CartDTO | null;
  addToCart: (codeProduct: string, option?: CartItemOption) => void;
  incrementItem: (productId: number, codeProduct: string) => void;
  decrementItem: (productId: number, codeProduct: string) => void;
  removeItem: (codeProduct: string) => void;
  clearCart: () => void;
  incrementOption: (codeProduct: string, codeOption: string) => void;
  decrementOption: (codeProduct: string, codeOption: string) => void;
  confirmePayment: (orderPaymentDTO: OrderPaymentDTO) => void;
  getCartItem: (productId: number) => CartItem | undefined;
  fetchProductInCart: (cartCode: string, productId: number) => Promise<CartItem | undefined>;
  processingCheckout: (checkoutDTO: CheckoutDTO) => void;
  deleteCart: () => void;
  insertObservationInItemCart: (codeProduct: string, observation: string) => void;

  // Novo estado e funções para modais
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
  isProductModalOpen: boolean;
  openProductModal: (product: any) => void;
  closeProductModal: () => void;
  selectedProduct: any;

  // setCartIsActive: (active: boolean) => void;
  setIsProductInCart: (active: boolean) => void;
  setCartActive: (active: boolean) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [cartCode, setCartCode] = useState<string | null>(localStorage.getItem("CART_CODE"));
  const { setLoading } = useGlobal();

  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [ isProductInCart, setIsProductInCart ] = useState<boolean>(false);
  const [ cartActive, setCartActive ] = useState(false);

  const navigate = useNavigate();

  // Função para criar ou buscar o carrinho
  const createOrFetchCart = async () => {
    setLoading(true);
    try {
      if (cartCode) {
        const existingCart = await getCartByCode();
        if (existingCart) {
          setCart(existingCart);
          setCartActive(true)
        } else {
          await deleteCart();
          const newCart = await createCart();
          if (newCart.cartCode) {
            setCartCode(newCart.cartCode);
            localStorage.setItem("CART_CODE", newCart.cartCode);
            setCart(newCart);
            setCartActive(true);
          }
        }
      } else {
        const newCart = await createCart();
        if (newCart.cartCode) {
          setCartCode(newCart.cartCode);
          localStorage.setItem("CART_CODE", newCart.cartCode);
          setCart(newCart);
          setCartActive(true)
        }
      }
    } catch (error) {
      console.error("Erro ao criar ou buscar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar produto ao carrinho
  const addToCart = async (codeProduct: string) => {
    try {
      if (!cartCode) {
        await createOrFetchCart();
      }
      const updatedCart = await addItemToCart(codeProduct);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      toast.error('Erro ao adicionar item ao carrinho');
    }
  };

  // Funções para modais
  const openCartModal = () => {
    setProductModalOpen(false);
    setCartModalOpen(true);
  };

  const closeCartModal = () => setCartModalOpen(false);
  const closeProductModal = () => setProductModalOpen(false);

  const openProductModal = (product: any) => {
    setCartModalOpen(false);
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const fetchProductInCart = async (cartCode: string, productId: number): Promise<CartItem | undefined> => {
    try {
      const findProduct = await getProductInCart(cartCode, productId);
      return findProduct;
    } catch (error) {
      console.error('Erro ao buscar produto do carrinho', error);
      toast.error('Erro ao buscar produto do carrinho');
    }
  };

  const incrementItem = async (productId: number, codeProduct: string) => {
    try {
      console.log("codeProduct INCREMENT: ", codeProduct);
      console.log("productId INCREMENT: ", productId);

      const updatedCart = await incrementItemInCart(productId, codeProduct);
      console.log("updatedCart INCREMENT: ", updatedCart);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao incrementar item no carrinho:', error);
      toast.error('Erro ao incrementar item no carrinho');
    }
  };

  const decrementItem = async (productId: number, codeProduct: string) => {
    try {
      console.log("codeProduct DECREMENT: ", codeProduct);
      console.log("productId DECREMENT: ", productId);

      const updatedCart = await decrementItemInCart(productId, codeProduct);
      console.log("updatedCart DECREMENT: ", updatedCart);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao decrementar item no carrinho:', error);
      toast.error('Erro ao decrementar item no carrinho');
    }
  };

  const removeItem = async (codeProduct: string) => {
    try {
      const updatedCart = await removeItemFromCart(codeProduct);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      toast.error('Erro ao remover item do carrinho');
    }
  };

  const clearCart = async () => {
    try {
      await clearCart(); // Limpa o carrinho na API
      localStorage.removeItem("CART_CODE");
      setCartCode(null);
      setCart(null); // Limpa o estado do carrinho
    } catch (error) {
      console.error('Erro ao limpar o carrinho:', error);
      toast.error('Erro ao limpar o carrinho');
    }
  };

  const incrementOption = async (codeProduct: string, codeOption: string) => {
    try {
      const updatedCart = await incrementOptionInCart(codeProduct, codeOption);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao incrementar opção no carrinho:', error);
      toast.error('Erro ao incrementar opção no carrinho');
    }
  };

  const decrementOption = async (codeProduct: string, codeOption: string) => {
    try {
      const updatedCart = await decrementOptionInCart(codeProduct, codeOption);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao decrementar opção no carrinho:', error);
      toast.error('Erro ao decrementar opção no carrinho');
    }
  };

  const confirmePayment = async (orderPaymentDTO: OrderPaymentDTO) => {
    try {
      await confirmePaymentProcessing(orderPaymentDTO);
      toast.success('Pagamento confirmado com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

  const processingCheckout = async (checkoutDTO: CheckoutDTO) => {
    try {
      await apiProcessingCheckout(checkoutDTO);
      setCartActive(false)
    } catch (error) {
        console.error('Erro ao processar o checkout >>> CONTEXTO');
    }
  }

  const deleteCart = async (): Promise<void> => {
    try {
        await apiDeleteCart()
    } catch (error) {
        console.error('Erro ao deletar carrinho:', error);
        throw error;
    }
  };

  const insertObservationInItemCart = async (codeProduct: string, observation: string) => {
    try {
      const response = await apiInsertObservationInItemCart(codeProduct, observation);
      return response;
    } catch (error: any) {
      console.error('Erro ao inserir observação no item:', error.message);
      return 'Erro ao inserir observação no item.';
    }
  };

  useEffect(() => {
    createOrFetchCart()
  }, []);


  const getCartItem = (productId: number): CartItem | undefined => {
    return cart?.items.find(item => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        incrementOption,
        decrementOption,
        confirmePayment,
        getCartItem,
        fetchProductInCart,
        isCartModalOpen,
        openCartModal,
        closeCartModal,
        isProductModalOpen,
        openProductModal,
        closeProductModal,
        selectedProduct,
        setIsProductInCart,
        processingCheckout,
        deleteCart,
        insertObservationInItemCart,
        setCartActive
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
