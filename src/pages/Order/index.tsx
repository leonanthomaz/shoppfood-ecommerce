import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Divider, Button, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { OrderPaymentDTO } from '../../types/Payment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { OrderContainer, OrderContent } from '../../components/Order/OrderStyles';
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';
import { translatePaymentMethod, translateStatusDelivery } from '../../components/Order/translations';

initMercadoPago(import.meta.env.VITE_API_MERCADO_PAGO_PUBLIC_KEY_PROD);

const OrderLoggedIn: React.FC = () => {
  const { state } = useAuth();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { getOrdersByOrderCode } = useOrder();
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [pixQRCodeText, setPixQRCodeText] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate();

  // Pegar o número do pedido salvo no localStorage
  const orderNumber = localStorage.getItem('ORDER_NUMBER');

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails(orderNumber);
    }
  }, [orderNumber]);

  // Buscar detalhes do pedido
  const fetchOrderDetails = async (orderCode: string) => {
    try {
      const details = await getOrdersByOrderCode(orderCode);
      if (details) {
        setOrderDetails(details);
      } else {
        setOrderDetails(null);
        toast.error('Pedido não encontrado.');
      }
    } catch (err) {
      setOrderDetails(null);
      toast.error('Erro ao buscar o pedido.');
      console.error('Erro ao buscar o pedido:', err);
    }
  };

  // Função de contagem para Pix
  const startCountdown = (expirationTime: number) => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = expirationTime - now;

      if (distance <= 0) {
        setCountdown('Expirado');
        return;
      }

      const minutes = Math.floor(distance / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(() => {
      updateCountdown();
      if (countdown === 'Expirado') {
        clearInterval(interval);
      }
    }, 1000);
  };

  // Gerar QRCode Pix
  const handleGeneratePixQRCode = async () => {
    try {
      const paymentRequestDTO = {
        orderCode: orderDetails?.orderCode,
        cartCode: orderDetails?.cartCode,
        token: localStorage.getItem("USER_TOKEN") || '',
        issuerId: 'pix',
        paymentMethodId: 'pix',
        transactionAmount: orderDetails?.total || 0,
        installments: 1,
        payer: {
          email: state.user?.email || '',
          identification: {
            number: '',
            type: '',
          },
        },
      };

      const response = await axios.post('http://localhost:8090/payments/pix/qr-code', paymentRequestDTO);

      if (response.status === 200) {
        const data = response.data;
        setPixQRCode(data.qrCodeBase64);
        setPixQRCodeText(data.qrCodeUrl);
        startCountdown(data.expirationTime);
      } else {
        toast.error('Erro ao gerar QR Code Pix.');
      }
    } catch (error) {
      toast.error('Erro ao gerar QR Code Pix.');
    }
  };

  // Confirmar pagamento com cartão
  const handleCardPayment = async (paymentResponse: any) => {
    try {
      const token = localStorage.getItem("USER_TOKEN") || "";
      const paymentRequestDTO: OrderPaymentDTO = {
        orderCode: orderDetails?.orderCode || '',
        cartCode: orderDetails?.orderCode || '',
        userToken: token || '',
        paymentDetails: {
          token: paymentResponse.token,
          issuerId: paymentResponse.issuerId,
          paymentMethodId: paymentResponse.paymentMethodId,
          transactionAmount: orderDetails?.total || 0,
          installments: paymentResponse.installments,
          payer: {
            email: state.user?.email || '',
            identification: {
              number: paymentResponse.payerIdentificationNumber || '',
              type: paymentResponse.payerIdentificationType || '',
            },
          },
        },
        amount: orderDetails?.total,
      };

      const response = await axios.post('http://localhost:8090/payments/card', paymentRequestDTO);

      if (response.status === 202) {
        navigate("/purchase");
        toast.success('Pagamento realizado com sucesso!');
      } else {
        toast.error('Erro ao processar pagamento com cartão.');
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento com cartão.');
    }
  };

  return (
    <Layout>
      <OrderContainer sx={{ marginTop: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom align="center">Detalhes do Pedido</Typography>
          {orderDetails && (
            <OrderContent component={Paper} sx={{ padding: 2 }}>
              <OrderStatusStepper currentStatus={orderDetails.status} />
              <Divider sx={{ marginBottom: 3 }} />
              <Typography variant="body1" paragraph>
                <strong>Código do Pedido:</strong> {orderDetails.orderCode}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Taxa de entrega:</strong> {orderDetails.deliveryFee}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Status:</strong> {translateStatusDelivery(orderDetails.status)}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Método de pagamento:</strong> {translatePaymentMethod(orderDetails.paymentMethod)}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Total:</strong> R$ {orderDetails.total.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Data de Criação:</strong> {new Date(orderDetails.createdAt).toLocaleString()}
              </Typography>
              {orderDetails.items && orderDetails.items.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>Itens do Pedido:</Typography>
                  {orderDetails.items.map((item: any) => (
                    <Box key={item.id} sx={{ marginBottom: 1 }}>
                      <Typography variant="body1">
                        <strong>Produto:</strong> {item.productName} ({item.quantity}x)
                      </Typography>
                      {item.options && item.options.length > 0 && (
                        <Box sx={{ paddingLeft: 2 }}>
                          <Typography variant="body2"><strong>Opções:</strong></Typography>
                          {item.options.map((option: any) => (
                            <Typography key={option.id} variant="body2">
                              - {option.name} (Qtd: {option.quantity})
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </>
              )}
              {orderDetails.paymentMethod === "PIX" && (
                <Box>
                  <Typography variant="h6">Pagamento com Pix</Typography>
                  <Button variant="contained" color="primary" fullWidth onClick={handleGeneratePixQRCode} sx={{ mt: 2 }}>
                    Gerar QR Code Pix
                  </Button>
                  {pixQRCode && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code Pix" width={200} />
                      <Typography variant="body1">{pixQRCodeText}</Typography>
                      <Typography variant="body2" color="error" mt={1}>{countdown}</Typography>
                    </Box>
                  )}
                </Box>
              )}
              {orderDetails.paymentMethod === "CREDIT_CARD" && (
                <Box>
                  <CardPayment
                    initialization={{ amount: orderDetails?.total }}
                    onError={() => toast.error('Erro no pagamento com cartão.')}
                    onSubmit={handleCardPayment}
                    locale="pt-BR"
                  />
                </Box>
              )}
            </OrderContent>
          )}
          {!orderDetails && (
            <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
              Nenhum pedido encontrado.
            </Typography>
          )}
        </Container>
      </OrderContainer>
    </Layout>
  );
};

export default OrderLoggedIn;
