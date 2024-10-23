import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useGlobal } from '../../../contexts/GlobalContext';
import { api, getMerchantCode } from '../../../services/api';
import { Delivery } from '../../../types/Delivery';
import { useJsApiLoader } from '@react-google-maps/api';

const CepModal: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_GOOGLE_MAPS,
    libraries: ['places', 'geometry'],
  });

  const [cep, setCep] = useState<string>(''); // Estado para armazenar o CEP
  const [error, setError] = useState<string | null>(null); // Armazena erro de validação
  const { setShowCepModal } = useGlobal(); // Pega a função para esconder o modal do contexto global
  const [deliveryInfo, setDeliveryInfo] = useState<Delivery | null>(null);

  console.log(deliveryInfo);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      const merchantCode = getMerchantCode();
      try {
        const response = await api.get(`/delivery/check/${merchantCode}`);
        setDeliveryInfo(response.data);
        localStorage.setItem("DELIVERY_DATA", JSON.stringify(response.data));
      } catch (error) {
        console.error('Erro ao buscar informações de entrega:', error);
      }
    };

    fetchDeliveryInfo();
  }, []);

  // Função para validar o CEP usando a geocodificação do Google
  const validateCepWithGoogle = (cep: string) => {
    const geocoder = new google.maps.Geocoder();
    return new Promise<boolean>((resolve, reject) => {
      geocoder.geocode({ address: cep }, (results, status) => {
        if (status === 'OK' && results) {
          const location = results[0].geometry.location;
          const clientLat = location.lat();
          const clientLng = location.lng();
          
          // Verificar se o ponto está dentro do raio
          if (deliveryInfo) {
            const centralPoint = new google.maps.LatLng(
              deliveryInfo.centralPointLat,
              deliveryInfo.centralPointLng
            );
            const clientPoint = new google.maps.LatLng(clientLat, clientLng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              centralPoint,
              clientPoint
            );
            resolve(distance <= (deliveryInfo.radius * 1000)); // Comparar distância em metros
          } else {
            reject('Informações de entrega não disponíveis.');
          }
        } else {
          reject('Geocode não foi bem-sucedido: ' + status);
        }
      });
    });
  };

  // Função para salvar o CEP no localStorage
  const handleSaveCep = async () => {
    if (/^[0-9]{5}-?[0-9]{3}$/.test(cep)) {
      try {
        const isValid = await validateCepWithGoogle(cep);
        if (isValid) {
          localStorage.setItem('USER_CEP', cep);
          setShowCepModal(false); // Fecha o modal
        } else {
          setError('Desculpe, não entregamos nessa área.');
        }
      } catch (error) {
        setError('Erro ao validar o CEP. Tente novamente.');
        console.error(error);
      }
    } else {
      setError('Por favor, insira um CEP válido.');
    }
  };

  return (
    <Modal
      open={true}
      aria-labelledby="cep-modal-title"
      aria-describedby="cep-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="cep-modal-title" variant="h6" component="h2">
          Confira se entregamos na sua região
        </Typography>
        <Typography id="cep-modal-description" sx={{ mt: 2 }}>
          Digite seu CEP abaixo!
        </Typography>
        <TextField
          label="CEP"
          variant="outlined"
          fullWidth
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            handleSaveCep
            setShowCepModal(false)
          }}
        >
          Confirmar
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            setShowCepModal(false);
            localStorage.setItem('cepNotValidated', 'true'); // Flag que marca o CEP como não validado
          }}
        >
          Agora não
        </Button>
        <Typography variant="body2" color="textSecondary">
          Ao escolher esta opção, você pode não conseguir finalizar a compra.
        </Typography>

              </Box>
            </Modal>
          );
        };

export default CepModal;
