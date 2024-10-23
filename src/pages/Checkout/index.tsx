import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api, getCartCode, getMerchantCode, getToken } from '../../services/api';
import { CheckoutDTO } from '../../types/Checkout';
import { Skeleton } from '@mui/material';
import Layout from '../../components/Layout';
import { useGlobal } from '../../contexts/GlobalContext';
import { LayoutContainer } from '../../components/Layout/LayoutStyles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Delivery } from '../../types/Delivery';

const Checkout: React.FC = () => {
  const { cart, processingCheckout } = useCart();
  const { state } = useAuth();
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [address, setAddress] = useState<{ street: string, city: string, neighborhood: string, state: string }>({
    street: '',
    city: '',
    neighborhood: '',
    state: ''
  });
  const [number, setNumber] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoading, setLoading } = useGlobal();
  const [deliveryData, setDeliveryData] = useState<Delivery | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0); // Variável para armazenar a taxa de entrega


  // Função para obter latitude e longitude do Google Maps API
  const getLatLngFromCep = async (cep: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await api.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${import.meta.env.VITE_API_GOOGLE_MAPS}`);
      const location = response.data.results[0]?.geometry?.location;
      if (location) {
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar latitude e longitude:', error);
      return null;
    }
  };

  useEffect(() => {
    const deliveryDataFromStorage = localStorage.getItem('DELIVERY_DATA');
    if (deliveryDataFromStorage) {
      const deliveryDataParsed = JSON.parse(deliveryDataFromStorage);
      setDeliveryData(deliveryDataParsed);
      calculateDeliveryFee(deliveryDataParsed);
    }
  }, [cep]);

  // Função para calcular a taxa de entrega com base no CEP e nas zonas
  const calculateDeliveryFee = async (delivery: Delivery) => {
    console.log("DADOS RECEBIDOS DO LOCALSTORAGE: ", delivery);
    const userCep = localStorage.getItem('USER_CEP');

    if (userCep) {
      // Obter latitude e longitude com base no CEP do cliente
      const userLatLng = await getLatLngFromCep(userCep);
      
      if (userLatLng) {
        let matchedZone = null;
        let minDistance = Infinity; // Variável para armazenar a menor distância encontrada

        // Itera sobre as zonas e calcula a distância entre o cliente e a zona
        delivery.zones.forEach(zone => {
          const zoneLatLng = { lat: parseFloat(zone.lat), lng: parseFloat(zone.lng) };
          const distance = calculateDistance(userLatLng, zoneLatLng); // Calcula a distância em km

          console.log(`Distância para a zona ${zone.name}: ${distance} km`);

          // Verifica se o cliente está dentro do raio de entrega desta zona
          if (distance <= delivery.radius && distance < minDistance) {
            matchedZone = zone; // Armazena a zona correspondente mais próxima
            minDistance = distance; // Atualiza a menor distância
          }
        });

        // Aplica a taxa da zona correspondente ou a taxa padrão
        const fee = matchedZone ? matchedZone.price : delivery.defaultDeliveryFee;
        setDeliveryFee(fee);
      } else {
        // Caso não encontre o CEP, usa a taxa de entrega padrão
        setDeliveryFee(delivery.defaultDeliveryFee);
      }
    }
  };

  // Função para calcular a distância entre dois pontos (usando a fórmula de Haversine)
  const calculateDistance = (location1, location2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km

    const dLat = toRad(location2.lat - location1.lat);
    const dLng = toRad(location2.lng - location1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(location1.lat)) *
      Math.cos(toRad(location2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km

    return distance;
  };

  // Demais efeitos e manipulação de estado
  useEffect(() => {
    const savedData = sessionStorage.getItem('USER_DATA');
    if (savedData) {
      const userData = JSON.parse(savedData);
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setCep(userData.cep || '');
      setAddress({
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        neighborhood: userData.address?.neighborhood || '',
        state: userData.address?.state || ''
      });
      setNumber(userData.number || '');
      setComplement(userData.complement || '');
    }
  }, []);

  useEffect(() => {
    const savedCep = localStorage.getItem('USER_CEP');
    if (savedCep) {
      setCep(savedCep);
      fetchAddressFromCep(savedCep);
    }
  }, []);

  useEffect(() => {
    if (state.authenticated && state.user) {
      setName(state.user.name || '');
      setPhone(state.user.telephone || '');
      setCep(state.user.address?.cep || localStorage.getItem('USER_CEP'));
      setAddress({
        street: state.user.address?.street || '',
        city: state.user.address?.city || '',
        neighborhood: state.user.address?.neighborhood || '',
        state: state.user.address?.state || ''
      });
      setNumber(state.user.address?.number || '');
      setComplement(state.user.address?.complement || '');
    }
  }, [state.authenticated, state.user]);

  const fetchAddressFromCep = async (cepValue: string) => {
    try {
      const response = await api.get(`/address/${cepValue}`);
      const data = response.data;
      setAddress({
        street: data.street || '',
        city: data.city || '',
        neighborhood: data.neighborhood || '',
        state: data.state || '',
      });
    } catch {
      setError('Erro ao buscar o CEP.');
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    setCep(newCep);
    if (newCep.length === 8) {
      fetchAddressFromCep(newCep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart) {
      setError('Carrinho está vazio.');
      return;
    }

    const userData = {
      name,
      phone,
      cep,
      address,
      number,
      complement
    };

    sessionStorage.setItem('USER_DATA', JSON.stringify(userData));

    const checkoutDTO: CheckoutDTO = {
      merchantCode: getMerchantCode(),
      cartCode: getCartCode(),
      token: state.authenticated ? getToken() : "",
      deliveryFee,
      user: state.authenticated ? state.user : { 
        name,
        merchantCode: "",
        telephone: phone,
        address: {
          cep,
          street: address.street,
          city: address.city,
          neighborhood: address.neighborhood,
          state: address.state,
          number,
          complement
        }
      }
    };

    try {
      processingCheckout(checkoutDTO);
      // setCartIsActive(false);
      navigate('/payment');
    } catch (error) {
      setError('Erro ao processar o checkout.');
    }
  };

  const totalWithDeliveryFee = cart ? cart.total + deliveryFee : 0;

  return (
    <Layout>
      <LayoutContainer>
        <Container sx={{ marginTop: 5, marginBottom: 5 }}>
          <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Finalizar Compra
              </Typography>
            </Box>    

            <Box sx={{ marginBottom: 4, marginTop: 4 }}>
              <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" gap={1} marginLeft="5px">
                <ShoppingCartOutlinedIcon
                  sx={{ fontSize: 28, color: 'grey.500' }}
                />
                <Typography variant="body2" fontSize="20px" fontWeight="bold">Seu Carrinho</Typography>
              </Box>   

              {isLoading ? (
                <>
                  <Skeleton variant="rectangular" height={150} sx={{ marginBottom: 2 }} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                </>
              ) : (
                cart?.items.map((item) => (
                  <Box key={item.codeProduct} sx={{ marginBottom: 2, border: '1px solid #ddd', padding: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography variant="body2">Preço: R$ {item.price.toFixed(2)} - Quantidade: {item.quantity}</Typography>
                  </Box>
                ))
              )}

              <Box mt={4}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: R$ {cart ? cart.total.toFixed(2) : 0}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                  Taxa de Entrega: R$ {deliveryFee.toFixed(2)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                  Total com Entrega: R$ {totalWithDeliveryFee.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 3, mb: 3 }}
            >
              <TextField
                fullWidth
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="CEP"
                value={cep}
                onChange={handleCepChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Rua"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Cidade"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Bairro"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Estado"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                sx={{ marginBottom: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Confirmar
              </Button>

              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </LayoutContainer>
    </Layout>
  );
};

export default Checkout;
