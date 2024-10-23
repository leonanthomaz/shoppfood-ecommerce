// translations.ts
import { StatusDeliveryTranslations, PaymentMethodTranslations } from './mappings';

export const translateStatusDelivery = (status: string): string => {
  const normalizedStatus = status.toUpperCase();  // Normaliza para maiúsculas
  return StatusDeliveryTranslations[normalizedStatus] || 'Status desconhecido';
};

export const translatePaymentMethod = (method: string): string => {
  return PaymentMethodTranslations[method] || 'Método desconhecido';
};
