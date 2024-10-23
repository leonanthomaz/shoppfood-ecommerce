import React, { useEffect, useState } from 'react';
import ProductModal from '../Modal/ProductModal';
import { Card, CardContent, CardMedia, Typography, Button, useMediaQuery, Box } from '@mui/material';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { getImageByFilename } from '../../functions/Product';
import Skeleton from '@mui/material/Skeleton';
import { toast } from 'react-toastify';
import PaymentPendingModal from '../Modal/PaymentPendingModal';
import { useStore } from '../../contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { store } = useStore()
  
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart, setIsProductInCart } = useCart();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentPendingModalOpen, setPaymentPendingModalOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const closePaymentPendingModal = () => setPaymentPendingModalOpen(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      if (product.imageUrl) {
        try {
          const url = await getImageByFilename(product.imageUrl);
          setImageUrl(url);
        } catch (error) {
          console.error('Erro ao carregar a imagem:', error);
        }
      }
    };

    loadImage();
  }, [product.imageUrl]);

  const handleAddToCart = async () => {
    try {
      addToCart(product.codeProduct);
      toast.success("Produto adicionado com sucesso!");
      openModal();
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
    }
  };

  return (
    <>
      <Card sx={{
        width: isSmallScreen ? '100%' : '280px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 2,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s ease-in-out',  // Animação ao passar o mouse
        '&:hover': { transform: 'scale(1.05)' },  // Efeito hover
      }}>
        {loading ? (
          // Skeleton aprimorado com diferentes seções para simular carregamento real
          <>
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '4px' }} />
            <Box sx={{ padding: 2 }}>
              <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: 1 }} />
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={36} sx={{ marginTop: 2, borderRadius: '4px' }} />
            </Box>
          </>
        ) : (
          <CardMedia
            component="img"
            sx={{
              width: '100%',     // Largura total do card
              height: 300,       // Altura da imagem padronizada (300x300)
              objectFit: 'cover', // Ajusta a imagem sem distorcer
              borderRadius: '4px',
            }}
            image={imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
          />
        )}
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" fontWeight="bold" 
          sx={{ marginBottom: 1, fontSize: '18px' }}>
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            R${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            sx={{ marginTop: 2, width: '100%', borderRadius: '4px' }}
            disabled={!store?.open}
          >
            Adicionar
          </Button>
        </CardContent>
      </Card>
      <ProductModal isOpen={isOpen} onClose={closeModal} product={product} />
      <PaymentPendingModal 
        open={isPaymentPendingModalOpen} 
        onClose={closePaymentPendingModal} 
      />
    </>
  );
};

export default ProductCard;
