import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { Box, Button, Typography, Tabs, Tab, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

initMercadoPago(import.meta.env.VITE_API_MERCADO_PAGO_KEY);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const { cart } = useCart();
  const { state } = useAuth();
  const [value, setValue] = useState(0);
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [pixQRCodeText, setPixQRCodeText] = useState<string | null>(null);
  const [change, setChange] = useState<string>(''); // Campo para troco (Dinheiro)
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState('');
  const [progress, setProgress] = useState(100);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const handleGeneratePixQRCode = async () => {
  //   try {
  //     const paymentRequestDTO = {
  //       transactionAmount: cart?.total,
  //       payer: { email: state.user?.email || '' },
  //       issuerId: 'pix',
  //     };

  //     const response = await fetch('http://localhost:8080/payments/pix/qr-code', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(paymentRequestDTO),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setPixQRCode(data.qrCodeBase64);
  //       setPixQRCodeText(data.qrCodeUrl);
  //     } else {
  //       const errorText = await response.text();
  //       toast.error(`Erro ao gerar QR Code Pix: ${errorText}`);
  //     }
  //   } catch (error) {
  //     toast.error('Erro ao gerar QR Code Pix.');
  //   }
  // };

  const handleGeneratePixQRCode = async () => {
    try {
      const paymentRequestDTO = {
        transactionAmount: cart?.total,
        payer: { email: state.user?.email || '' },
        issuerId: 'pix',
      };
  
      const response = await fetch('http://localhost:8080/payments/pix/qr-code', {
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

  const handlePaymentError = (error: any) => {
    toast.error('Erro ao processar pagamento.');
  };

  const handlePaymentSuccess = (paymentResponse: any) => {
    localStorage.removeItem("CART_CODE");
    toast.success('Pagamento realizado com sucesso!');
  };

  const handleConfirmCashPayment = async () => {
    try {
        const paymentRequestDTO = {
            orderCode: localStorage.getItem("ORDER_CODE"),
            paymentMethod: 'CASH', // Adiciona o método de pagamento
            // Outros dados do pedido
        };
        await fetch('http://localhost:8080/payments/cash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentRequestDTO),
        });
        localStorage.removeItem("ORDER_CODE");
        navigate('/purchase');
        toast.success('Pagamento em dinheiro confirmado!');
    } catch (error) {
        toast.error('Erro ao confirmar pagamento em dinheiro.');
    }
  };

  const cancelOrder = async () => {
    const orderCode = localStorage.getItem("ORDER_CODE");
    try {
        await api.post(`/order/cancel/${orderCode}`);
        localStorage.removeItem("ORDER_CODE");
        toast.success("Pedido cancelado com sucesso.");
        navigate('/');
    } catch (error) {
        console.error("Erro ao cancelar o pedido:", error);
        toast.error("Erro ao cancelar o pedido.");
    }
  };


  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4, marginTop: 10 }}>
      <Typography variant="h4" gutterBottom>
        Pagamento
      </Typography>

      <Typography variant="h6" gutterBottom>
        Total: R$ {cart?.total.toFixed(2)}
      </Typography>

      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label="opções de pagamento"
        centered
        sx={{
          '.MuiTab-root': { 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '.Mui-selected': {
            color: '#1976d2',
            fontWeight: 'bold',
          },
          '.MuiTabs-indicator': {
            backgroundColor: '#1976d2',
          },
        }}
      >
        <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Dinheiro" />
        <Tab icon={<CreditCardIcon />} iconPosition="start" label="Cartão" />
        <Tab icon={<QrCodeIcon />} iconPosition="start" label="Pix" />
      </Tabs>

      {/* Aba Dinheiro */}
      <TabPanel value={value} index={0}>
        <Typography variant="h6">Pagamento com Dinheiro</Typography>
        <TextField
          label="Troco para"
          fullWidth
          margin="normal"
          value={change}
          onChange={(e) => setChange(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleConfirmCashPayment}>
          Confirmar Pagamento
        </Button>
        <br/>
        <Button
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={cancelOrder}
        >
        Cancelar Pedido
        </Button>
      </TabPanel>

      {/* Aba Cartão */}
      <TabPanel value={value} index={1}>
        <Typography variant="h6">Pagamento com Cartão</Typography>
        <CardPayment
          initialization={{ amount: cart?.total }}
          onError={handlePaymentError}
          onSuccess={handlePaymentSuccess}
          locale="pt-BR"
        />
      </TabPanel>

      {/* Aba Pix */}
      <TabPanel value={value} index={2}>
        <Typography variant="h6">Pagamento com Pix</Typography>
        <Button variant="contained" color="primary" fullWidth onClick={handleGeneratePixQRCode} sx={{ mt: 2 }}>
          Gerar QR Code Pix
        </Button>
        {/* {pixQRCode && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code Pix" width={200} />
          </Box>
        )} */}
        {/* {pixQRCodeText && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body1">{pixQRCodeText}</Typography>
            <Button variant="outlined" color="primary" onClick={handleCopyPixCode} sx={{ mt: 1 }}>
              Copiar Código Pix
            </Button>
          </Box>
        )} */}
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

      </TabPanel>
    </Box>
  );
};

export default PaymentPage;
