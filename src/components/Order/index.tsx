import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper, Divider } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { OrderContainer, OrderContent } from './OrderStyles';
import { useOrder } from '../../contexts/OrderContext';
import OrderStatusStepper from './OrderStatusStepper';
import Layout from '../Layout';
import { translateStatusDelivery, translatePaymentMethod } from './translations';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { OrderPaymentDTO } from '../../types/Payment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

initMercadoPago(import.meta.env.VITE_API_MERCADO_PAGO_PUBLIC_KEY_PROD);

const Order: React.FC = () => {
  const { state } = useAuth();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { getOrdersByOrderCode } = useOrder();
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [pixQRCodeText, setPixQRCodeText] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate()

  const orderStatus = "PREPARING";

  // CAPTURANDO ERRO NO PAGAMENTO
  const handlePaymentError = () => {
    toast.error('Erro ao processar pagamento. Tente novamente');
  };

  // PESQUISANDO PEDIDO
  const handleSearch = async () => {
    try {
      setError(null);
      const details = await getOrdersByOrderCode(orderNumber);
      if (details) {
        setOrderDetails(details);
      } else {
        setOrderDetails(null);
        setError('Pedido não encontrado.');
      }
    } catch (err) {
      setOrderDetails(null);
      setError('Erro ao buscar o pedido.');
      console.error('Erro ao buscar o pedido:', err);
    }
  };

  // CONTAGEM PIX
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
  
  // GERAÇÃO PIX
  const handleGeneratePixQRCode = async () => {
    try {
      const paymentRequestDTO: PaymentRequest = {
        orderCode: orderDetails?.orderCode, 
        cartCode: orderDetails?.cartCode,
        token: localStorage.getItem("USER_TOKEN") || '',
        issuerId: 'pix',
        paymentMethodId: 'pix',
        transactionAmount: orderDetails?.total || 0,
        installments: 1,
        payer: {
          email: state.user?.email || 'leonan.thomaz@gmail.com',
          identification: {
            number: '',
            type: '',
          },
        },
      };

      // const token = localStorage.getItem("USER_TOKEN") || ''
      // const response = await axios.post('http://localhost:8090/payments/pix/qr-code', { paymentRequestDTO }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      const response = await fetch('http://localhost:8090/payments/pix/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequestDTO),
      });

      if (response.ok) {
        const data = await response.json();
        setPixQRCode(data.qrCodeBase64);
        setPixQRCodeText(data.qrCodeUrl);
        startCountdown(data.expirationTime);
      } else {
        const errorText = await response.text();
        toast.error(`Erro ao gerar QR Code Pix: ${errorText}`);
      }
    } catch (error) {
      toast.error('Erro ao gerar QR Code Pix.');
    }
  };

  // COPIAR CÓDIGO PIX
  const handleCopyPixCode = async () => {
    if (pixQRCodeText) {
      try {
        await navigator.clipboard.writeText(pixQRCodeText);
        toast.success('Código Pix copiado para a área de transferência!');
      } catch (error) {
        toast.error('Erro ao copiar o código Pix.');
      }
    }
  };

  // CONFIRMAR PAGAMENTO COM CARTÃO
  const handleCardPayment = async (paymentResponse: any) => {
    try {
      const token = localStorage.getItem("USER_TOKEN") || "" ;
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
            email: state.user?.email || 'leonan.thomaz@gmail.com',
            identification: {
              number: paymentResponse.payerIdentificationNumber || '',
              type: paymentResponse.payerIdentificationType || '',
            },
          },
        },
        amount: orderDetails?.total,
      };

      const response = await axios.post('http://localhost:8090/payments/card', paymentRequestDTO, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (response.status === 202) {
        navigate("/purchase")
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
          <Typography variant="h4" gutterBottom align="center">Consulte seu Pedido!</Typography>
          <Typography variant="body1" align="center" paragraph>
            Insira seu número de pedido e confira o status da sua entrega!
          </Typography>
          <TextField
            label="Número do Pedido"
            variant="outlined"
            fullWidth
            margin="normal"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Consultar
          </Button>
          {orderDetails && (
            <OrderContent component={Paper} sx={{ padding: 2 }}>
              <OrderStatusStepper currentStatus={orderStatus} />
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
                  {orderDetails.paymentMethod === "PIX" ? 
                  <Box>
                    <Typography variant="h6">Pagamento com Pix</Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={ handleGeneratePixQRCode } sx={{ mt: 2 }}>
                      Gerar QR Code Pix
                    </Button>
                      {pixQRCode && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                          <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code Pix" width={200} />
                          <Typography variant="body1">{pixQRCodeText}</Typography>
                          <Typography variant="body2" color="error" mt={1}>{countdown}</Typography>
                          <Button variant="outlined" color="primary" onClick={handleCopyPixCode} sx={{ mt: 1 }}>
                            Copiar Código Pix
                          </Button>
                        </Box>
                      )}
                  </Box> 
                  : "" }
                  {orderDetails.paymentMethod === "CREDIT_CARD" ? 
                  <Box>
                  <CardPayment
                    initialization={{ amount: orderDetails?.total }}
                    onError={handlePaymentError}
                    onSubmit={handleCardPayment}
                    locale="pt-BR"
                  />
                  </Box> 
                  : "" }
                </>
              )}
            </OrderContent>
          )}
          {error && (
            <Typography variant="body1" color="error" align="center" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="secondary"
              href="https://wa.me/1234567890" // Substitua pelo número de WhatsApp real
              target="_blank"
              startIcon={<WhatsAppIcon />}
            >
              Não sabe o número do seu pedido? Entre em contato conosco!
            </Button>
          </Box>
        </Container>
      </OrderContainer>
    </Layout>
  );
};

export default Order;
