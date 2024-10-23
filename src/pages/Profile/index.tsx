import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Divider, Skeleton } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const Profile: React.FC = () => {
  const { state } = useAuth();
  const { getOrdersByUserId } = useOrder();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando a obtenção de dados do usuário e pedidos
        const ordersResponse = await getOrdersByUserId(state.user?.id || 0);
        setOrders(ordersResponse);

      } catch (error) {
        toast.error('Erro ao carregar informações.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [state.user?.id, getOrdersByUserId]);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ marginTop: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Perfil do Cliente
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Informações do Cliente</Typography>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={50} />
          ) : (
            <Box>
              <Typography><strong>Nome:</strong> {state?.user?.name || ''}</Typography>
              <Typography><strong>Email:</strong> {state?.user?.email || ''}</Typography>
            </Box>
          )}         
        </Paper>

        <Divider sx={{ marginY: 2 }} />

        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Meus Pedidos</Typography>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={200} />
          ) : (
            ""
            // <OrderList orders={orders} /> // Renderiza lista de pedidos
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;
