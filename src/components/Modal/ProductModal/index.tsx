import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Badge, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { Product, ProductItem } from '../../../types/Product';
import { CartItemStatus } from '../../../types/Cart';
import { useCart } from '../../../contexts/CartContext';
import { useProduct } from '../../../contexts/ProductContext';
import { ItemSelector } from './ProductModalStyles';
import { useNavigate } from 'react-router-dom';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const { getCartItem, incrementOption, decrementOption } = useCart();
  const { getImageByFilename } = useProduct();
  const [itemQuantities, setItemQuantities] = useState<{ [key: string]: number }>({});
  const [productStatus, setProductStatus] = useState<CartItemStatus>(CartItemStatus.BLOCKED);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalSelectedQuantity, setTotalSelectedQuantity] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const fetchCartDetails = async () => {
        try {
          const cartItem = getCartItem(product.id);
          if (cartItem) {
            const initialQuantities = cartItem.options.reduce((acc, option) => {
              acc[option.codeOption] = option.quantity || 0;
              return acc;
            }, {} as { [key: string]: number });

            setItemQuantities(initialQuantities);
            setProductStatus(cartItem.status === 'RELEASED' ? CartItemStatus.RELEASED : CartItemStatus.BLOCKED);
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do carrinho:', error);
        }
      };
      fetchCartDetails();
    }
  }, [isOpen, product, getCartItem]);

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

  useEffect(() => {
    const total = Object.values(itemQuantities).reduce((acc, quantity) => acc + quantity, 0);
    setTotalSelectedQuantity(total);
  }, [itemQuantities]);

  const handleQuantityChange = (codeOption: string, quantity: number) => {
    setItemQuantities(prevQuantities => ({ ...prevQuantities, [codeOption]: quantity }));
  };

  const handleIncrementOption = async (codeOption: string) => {
    try {
      incrementOption(product.codeProduct, codeOption);
      const cartItem = getCartItem(product.id);
      if (cartItem) {
        const newQuantity = cartItem.options.find(option => option.codeOption === codeOption)?.quantity || 0;
        handleQuantityChange(codeOption, newQuantity);
      }
    } catch (error) {
      console.error('Erro ao incrementar opção no carrinho:', error);
    }
  };

  const handleDecrementOption = async (codeOption: string) => {
    try {
      decrementOption(product.codeProduct, codeOption);
      const cartItem = getCartItem(product.id);
      if (cartItem) {
        const newQuantity = cartItem.options.find(option => option.codeOption === codeOption)?.quantity || 0;
        handleQuantityChange(codeOption, newQuantity);
      }
    } catch (error) {
      console.error('Erro ao decrementar opção no carrinho:', error);
    }
  };

  const handleConfirmProductInCart = async () => {
    try {
      navigate("/cart");
      onClose();
    } catch (error) {
      console.error("FALHA EM ALGUM PONTO!");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 25, top: 25 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box 
          display="flex" 
          flexDirection={isSmallScreen ? 'column' : 'row'} 
          gap={3} 
          padding={isSmallScreen ? '1rem' : '2rem'} 
          height={isSmallScreen ? 'auto' : '400px'} // Altera a altura com base no tamanho da tela
        >
          {/* Imagem do produto */}
          <Box flexShrink={0} mb={isSmallScreen ? 2 : 0} flexBasis="300px">
            <img
              src={imageUrl || 'https://via.placeholder.com/300'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} // Define a altura como 100% para ocupar todo o espaço
            />
          </Box>

          {/* Detalhes do produto */}
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>

            <Typography variant="body1" color="textSecondary" gutterBottom>
              {product.description}
            </Typography>

            <Box flexGrow={1}>
              {product.getMinimumRequiredOptions > 0 ? (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  mt={2} 
                  mb={2}
                  sx={{ 
                    backgroundColor: '#eeeeee', 
                    padding: '8px', 
                    borderRadius: '4px' 
                  }}
                >
                <Typography variant="body2" marginLeft='3px' display="flex" alignItems="center">
                  Escolha até {product.getMinimumRequiredOptions} itens 
                </Typography>

                <Badge
                badgeContent="Obrigatório"
                color="error"
                sx={{ 
                  '& .MuiBadge-dot': { width: '10px', height: '10px' }, 
                  fontSize: '0.75rem',
                  right: isSmallScreen ? '30px': '38px'
                }} 
                />  
                </Box>
              ) : null}

              {/* Lista de itens obrigatórios */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: isSmallScreen ? 'normal' : 'flex-end'
                }}>
                {product?.items?.length > 0 ? (
                  product.items.map((item: ProductItem) => (
                    <Box key={item.codeOption}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ maxWidth: '300px', marginRight: '10px' }}>
                          {item.name} - R${item.additionalPrice.toFixed(2)}
                        </Typography>
                        <ItemSelector>
                          <button 
                            onClick={() => handleDecrementOption(item.codeOption)} 
                            disabled={(itemQuantities[item.codeOption] || 0) <= 0}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '20px', textAlign: 'center' }}>
                            {itemQuantities[item.codeOption] || 0}
                          </span>
                          <button onClick={() => handleIncrementOption(item.codeOption)}>
                            +
                          </button>
                        </ItemSelector>
                      </Box>
                    </Box>
                  ))
                ) : (
                  // <Typography variant="body2" color="textSecondary" sx={{ padding: '8px', textAlign: 'center' }}>
                  //   Nenhum item obrigatório disponível.
                  // </Typography>
                  ""
                )}
              </Box>
           
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleConfirmProductInCart}
                disabled={totalSelectedQuantity < product.getMinimumRequiredOptions || productStatus === CartItemStatus.BLOCKED}
              >
                Confirmar
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
