import { createContext, useState, ReactNode, useEffect, useContext } from 'react'; // Adicione useContext aqui
import { 
  getOrdersByUserId as apiGetOrdersByUserId, 
  getOrderDetails as apiGetOrderDetails,
  getOrderByOrderCode as apiGetOrderByOrderCode
} from '../functions/Order';
import { OrderPaymentDTO } from '../types/Payment';
import { Order } from '../types/Order';
import { confirmePaymentProcessing as apiConfirmePaymentProcessing } from '../functions/Payment';
import { useGlobal } from './GlobalContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  processPayment: (paymentData: OrderPaymentDTO) => Promise<void>;
  getOrdersByUserId: (userId: number) => Promise<Order[]>;
  getOrderDetails: (orderId: number) => Promise<Order>;
  getOrdersByOrderCode: (orderCode: string) => Promise<Order>;
  setOrderActive: (active: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ orderCode, setOrderCode ] = useState(localStorage.getItem("ORDER_CODE"));
  const { setLoading } = useGlobal();
  const [ orderActive, setOrderActive ] = useState(false);

  useEffect(() => {
    setLoading(true)
    const loadOrder = async () => {
      try {
        if (orderCode) {
          const response = await apiGetOrderByOrderCode(orderCode);
          setOrders((prevOrders) => [...prevOrders, response]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderCode]);

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const processPayment = async (paymentData: OrderPaymentDTO) => {
    try {
      await apiConfirmePaymentProcessing(paymentData);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const getOrdersByOrderCode = async (orderCode: string): Promise<Order> => { // Corrija o tipo de retorno aqui
    try {
      return await apiGetOrderByOrderCode(orderCode);
    } catch (error) {
      console.error('ERRO AO BUSCAR ORDEM PELO CODIGO:', error);
      throw error;
    }
  };

  const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
    try {
      return await apiGetOrdersByUserId(userId);
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      throw error;
    }
  };

  const getOrderDetails = async (orderId: number): Promise<Order> => {
    try {
      return await apiGetOrderDetails(orderId);
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      clearOrders, 
      processPayment, 
      getOrdersByUserId, 
      getOrderDetails, 
      getOrdersByOrderCode,
      setOrderActive
      }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
