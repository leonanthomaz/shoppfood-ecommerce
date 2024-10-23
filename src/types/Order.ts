
export interface OrderContextState {
  orders: Order[] | null;
}

export interface OrderContextActions {
  type: 'SET_ORDERS' | 'ADD_ORDER';
  payload?: Order[];
}

export interface ProductOrder {
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
}
export interface Order {
  id: number;
  cartCode?: string;
  orderCode: string;
  deliveryFee?: number,
  merchantCode: string;
  total: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  items?: {
    id: number;
    quantity: number;
    product: ProductOrder;
  }[];
}

export interface StatusDelivery {
  ACCEPTED: string;
  PREPARING: string;
  AWAINTING_PAYMENT?: string;
  OUT_FOR_DELIVERY: string;
  DELIVERED: string;
}
