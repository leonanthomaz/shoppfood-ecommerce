// src/functions/Payment.ts
import { OrderPaymentDTO } from '../types/Payment';
import { api } from '../services/api';

export const processPayment = async (paymentData: OrderPaymentDTO): Promise<PaymentResponse> => {
    try {
        const { data } = await api.post<PaymentResponse>('/payment/process', paymentData);
        return data;
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        throw error;
    }
};

export const confirmePaymentProcessing = async (orderPaymentDTO: OrderPaymentDTO): Promise<OrderPaymentDTO> => {
    try {
        const { data } = await api.post('/payments/process', orderPaymentDTO, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("USER_TOKEN")}`,
            },
        });
        return data;
    } catch (error) {
        console.error('Erro ao processar pedido:', error);
        throw error;
    }
};