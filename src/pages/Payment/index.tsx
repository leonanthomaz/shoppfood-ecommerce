import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useNavigate } from 'react-router-dom';
import { PaymentCardPIXDTO, PaymentCashDTO } from '../../types/Payment';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useOrder } from '../../contexts/OrderContext';
import { Order } from '../../types/Order';
import { LayoutContainer } from '../../components/Layout/LayoutStyles';

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
  const { getOrdersByOrderCode, setOrderActive } = useOrder();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [ order, setOrder ] = useState<Order>();
  const [cashChange, setCashChange] = useState<string>(''); 


  useEffect(() => {
    const orderCode = localStorage.getItem("ORDER_CODE");
    const getOrder = async () => {
      try {
        const response = await getOrdersByOrderCode(orderCode);
        setOrder(response);
      } catch (error) {
        console.error("Erro ao buscar Pedido.");
      }
    };
    getOrder();
  }, [localStorage.getItem("ORDER_CODE")]);

  // ALTERANDO NAVEGAÇÃO
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // CONFIRMAR PAGAMENTO EM DINHEIRO
  const processPaymentCash = async () => {
    try {
      const PaymentCashDTO: PaymentCashDTO = {
        orderCode: order?.orderCode || '',
        cartCode: order?.cartCode || '',
        paymentMethod: "CASH",
        cashChange: parseFloat(cashChange)
      };
      const response = await axios.post('http://localhost:8090/payments/cash', PaymentCashDTO, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        navigate('/purchase');
        sessionStorage.removeItem("USER_DATA")
        localStorage.removeItem("CART_CODE");
        setOrderActive(true)
        toast.success('Pagamento em dinheiro confirmado!');
      } else {
        toast.error(`Erro ao confirmar pagamento em dinheiro`);
      }
    } catch (error) {
      toast.error('Erro ao confirmar pagamento em dinheiro.');
    }
  };
  
  // CONFIRMAR PAGAMENTO COM CARTÃO SEM LOGIN
  const processPaymentCard = async () => {
    try{
      const PaymentDTO: PaymentCardPIXDTO = {
        orderCode: order?.orderCode || '',
        cartCode: order?.cartCode || '',
        paymentMethod: "CREDIT_CARD",
      };
      const response = await axios.post('http://localhost:8090/payments/card/anonymous', PaymentDTO, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        navigate('/purchase');
        sessionStorage.removeItem("USER_DATA")
        localStorage.removeItem("CART_CODE");
        toast.success('Pagamento em CARTÃO confirmado! Manda o cara pagar na hora');
        setOrderActive(true)
      } else {
        toast.error(`Erro ao confirmar pagamento em CARTÃO sem login`);
      }

    } catch(error){
      console.error("Falha ao processar pagamento sem Login.")
    }
  }

  const processPaymentPix = async () => {
    try{
      const PaymentDTO: PaymentCardPIXDTO = {
        orderCode: order?.orderCode || '',
        cartCode: order?.cartCode || '',
        paymentMethod: "PIX",
      };
      const response = await axios.post('http://localhost:8090/payments/pix/anonymous', PaymentDTO, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        navigate('/purchase');
        sessionStorage.removeItem("USER_DATA")
        localStorage.removeItem("CART_CODE");
        toast.success('Pagamento em CARTÃO confirmado! Manda o cara pagar na hora');
      } else {
        toast.error(`Erro ao confirmar pagamento em CARTÃO sem login`);
      }

    } catch(error){
      console.error("Falha ao processar pagamento sem Login.")
    }
  }
  
  return (
    <Layout>
      <LayoutContainer>
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4, marginTop: 10 }}>
          <Box sx={{ marginLeft: '25px'}}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Pagamento
              </Typography>
            </Box>   
            <Typography variant="h6" textAlign='start' gutterBottom>
              Total: R$ <span style={{ fontWeight: 'bold'}}>{order?.total.toFixed(2)}</span>
            </Typography>
          </Box> 

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
              label="Precisa de troco? Quanto?"
              fullWidth
              margin="normal"
              value={cashChange}
              onChange={(e) => setCashChange(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={processPaymentCash}>
              Confirmar Pagamento
            </Button>
            <br/>
          </TabPanel>

          {/* Aba Cartão */}
          <TabPanel value={value} index={1}>
            <Typography variant="h6">Pagamento com Cartão</Typography>

            <Button variant="contained" color="primary" fullWidth  
              sx={{ mt: 2 }}
              onClick={processPaymentCard}
              >
              Pagar na entrega
            </Button>
          
          </TabPanel>

          {/* Aba Pix */}
          <TabPanel value={value} index={2}>
            <Typography variant="h6">Pagamento com Pix</Typography>

            <Button variant="contained" color="primary" fullWidth onClick={ processPaymentPix } sx={{ mt: 2 }}>
              Pagar com Pix
            </Button>

          </TabPanel> 
        </Box>
      </LayoutContainer>
    </Layout>
  );
};

export default PaymentPage;
