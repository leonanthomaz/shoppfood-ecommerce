import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, useMediaQuery, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { Product, ProductItem } from '../../../types/Product';
import { CartItemStatus } from '../../../types/Cart';
import { useCart } from '../../../contexts/CartContext';
import { useProduct } from '../../../contexts/ProductContext';
import { Link } from 'react-router-dom';
import { AddButton, ItemSelector } from './ProductModalStyles';
import { toast } from 'react-toastify';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const { getCartItem, addToCart, incrementOption, decrementOption } = useCart();
  const { getImageByFilename } = useProduct();
  const [quantityProduct, setQuantityProduct] = useState<number | undefined>(0);
  const [itemQuantities, setItemQuantities] = useState<{ [key: string]: number }>({});
  const [productStatus, setProductStatus] = useState<CartItemStatus>(CartItemStatus.BLOCKED);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    if (isOpen) {
      const fetchCartDetails = async () => {
        try {
          const cartItem = getCartItem(product.id);
          setQuantityProduct(cartItem?.quantity);

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

  const handleQuantityChange = (codeOption: string, quantity: number) => {
    setItemQuantities(prevQuantities => ({ ...prevQuantities, [codeOption]: quantity }));
  };

  const handleIncrementOption = async (codeOption: string) => {
    try {
      await addToCart(product.codeProduct);
      toast.success("Produto adicionado!")
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

  const handleAddToCart = async () => {
    try {
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
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
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          gap={2}
        >
          <Box flexShrink={0} mb={isSmallScreen ? 5 : 0}>
            <img
              src={imageUrl || 'https://via.placeholder.com/300'}
              alt={product.name}
              style={{ maxWidth: '300px', maxHeight: '300px' }}
            />
          </Box>
          <Box flexGrow={1}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body1">{product.description}</Typography>
            <Box mt={2}>
              <Typography variant="h6">Itens Obrigatórios</Typography>
              {/* <Typography color="error">Escolha itens {product?.items?.getMinimumRequiredOptions} para confirmar!</Typography> */}
              {product?.items?.length === 0 && product.items.getMinimumRequiredOptions > 0 ? (
                <Typography variant="body2">Este produto não possui itens adicionais.</Typography>
              ) : (
                product?.items?.map((item: ProductItem) => (
                  <Box key={item.codeOption} display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ width: '250px' }}>{item.name} - R${item.additionalPrice},00:</Typography>
                    <Box display="flex" alignItems="center">
                      <Button 
                        onClick={() => handleDecrementOption(item.codeOption)} 
                        disabled={(itemQuantities[item.codeOption] || 0) <= 0}
                      >-</Button>
                      <Typography variant="body2" sx={{ mx: 2 }}>{itemQuantities[item.codeOption] || 0}</Typography>
                      <Button onClick={() => handleIncrementOption(item.codeOption)}>+</Button>
                    </Box>
                  </Box>
                ))
              )}
              {productStatus === CartItemStatus.RELEASED ? (
                <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ mt: 2 }}
              >
                <Link to="/cart">Ir para o carrinho</Link>
              </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={productStatus === CartItemStatus.BLOCKED}
                  sx={{ mt: 2 }}
                >
                  Adicionar
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
