// src/types/Delivery.ts

export interface DeliveryZone {
    id: number;
    merchantCode: string;
    name: string;
    price: number;
    lat: number;
    lng: number;
}

export interface Delivery {
    id: number;
    merchantCode: string;
    defaultDeliveryFee?: number;
    cep: string;
    radius: number;
    centralPointLat: number;
    centralPointLng: number;
    zones: DeliveryZone[]; // Lista de zonas de entrega
}
