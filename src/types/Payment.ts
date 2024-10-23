
export interface PaymentRequest {
  orderCode?: string;
  cartCode?: string;
  token: string;
  issuerId: string;  
  paymentMethodId: string; 
  transactionAmount: number; 
  installments: number;
  payer: {
    email: string;
    identification: {
      number: string | "";
      type: string | "";
    };
  };
}

export interface OrderPaymentDTO {
  orderCode?: string;
  cartCode?: string;
  userToken: string;
  paymentDetails: PaymentRequest;
  amount?: number;
}

export interface PaymentCashDTO {
  orderCode?: string;
  cartCode?: string;  
  paymentMethod: string;
  cashChange?: number;
}

export interface PaymentCardPIXDTO {
  orderCode?: string;
  cartCode?: string;
  paymentMethod: string;
}

export interface PaymentMethod {
  CASH: string;
  CREDIT_CARD: string;
  CARD_DELIVERY: string;
  PIX: string;
  PIX_DELIVERY: string;
}