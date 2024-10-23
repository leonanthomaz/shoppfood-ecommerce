// src/functions/Order.ts
import axios from 'axios';
import { Order } from '../types/Order';

export const getOrders = async (token: string): Promise<Order[]> => {
    try {
        const { data } = await axios.get('http://localhost:8090/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        return data;
    } catch (error) {
        console.error('Erro ao obter pedidos:', error);
        throw error;
    }
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
    try {
        const { data } = await axios.get(`http://localhost:8090/orders/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Erro ao obter pedidos por USUÁRIO:', error);
        throw error;
    }
};

export const getOrderDetails = async (orderId: number): Promise<Order> => {
    try {
        const { data } = await axios.get<Order>(`http://localhost:8090/orders/${orderId}`);
        return data;
    } catch (error) {
        console.error('Erro ao recuperar detalhes do pedido por ID:', error);
        throw error;
    }
};

export const getOrderByOrderCode = async(orderCode: string): Promise<Order> => {
    try {
        const { data } = await axios.get<Order>(`http://localhost:8090/orders/find/${orderCode}`);
        return data;
    } catch (error) {
        console.error('Erro ao recuperar detalhes do pedido por CÓDIGO:', error);
        throw error;
    }
}

export const cancelOrderByOrderCode = async(orderCode: string): Promise<Order> => {
    try {
        const { data } = await axios.get<Order>(`http://localhost:8090/orders/cancel/${orderCode}`);
        return data;
    } catch (error) {
        console.error('Erro ao cancelar pedido por CÓDIGO:', error);
        throw error;
    }
}