import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { CartItem, CartItemStatus } from '../../types/Cart';
import ProductModal from '../Modal/ProductModal';
import { useProduct } from '../../contexts/ProductContext';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Button, 
  Divider, 
  Snackbar, 
  Alert, 
  Box,
  CircularProgress, 
  TextField
} from '@mui/material';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobal } from '../../contexts/GlobalContext';
import CartEmpty from './CartEmpty';
import LoginModal from '../Modal/LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Collapse } from '@mui/material';
import Layout from '../Layout';
import { LayoutContainer } from '../Layout/LayoutStyles';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
  const { cart, incrementItem, decrementItem, removeItem, 
    clearCart, fetchProductInCart, openProductModal, 
    selectedProduct, isProductModalOpen, closeProductModal, 
    insertObservationInItemCart } = useCart();
  const { getProductWithCodeProduct } = useProduct() || {};
  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { setLoading } = useGlobal();
  const { isAuthenticated } = useAuth()
  const [observationVisibility, setObservationVisibility] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate()

  
  useEffect(() => {
    const updateCartItemsStatus = async () => {
      try {
        if (cart && cart.items) {
          const itemsWithStatuses = await Promise.all(cart.items.map(async (item) => {
            const product = item.product;
            if (product) {
              const productStatus = await fetchProductInCart(cart.cartCode, product.id);
              return {
                ...item,
                product,
                status: productStatus.status || CartItemStatus.BLOCKED,
                observations: ''
              } as CartItem;
            }
            return item as CartItem;
          }));

          setCartItem(itemsWithStatuses);
          setCartTotal(cart.total);
          const allReleased = itemsWithStatuses.every(item => item.status === CartItemStatus.RELEASED);
          setIsCheckoutEnabled(allReleased);
        }
      } catch (error) {
        console.error("Erro ao processar carrinho.")
      }
    };
  
    updateCartItemsStatus();
  }, [cart, fetchProductInCart, setLoading]);

  const handleBackToModal = async (codeProduct: string) => {
    try {
      const product = await getProductWithCodeProduct(codeProduct);
      openProductModal(product);
      return product;
    } catch (error) {
      console.error('Erro ao abrir o modal:', error);
    }
  };

  const handleCheckout = () => {
    isAuthenticated ? navigate("/checkout") : setIsLoginModalOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleInsertObservationInItemCart = async (productCode: string) => {
    try {
      const item = cartItem.find(item => item.codeProduct === productCode);
      if (item) {
        console.log('Observações do item:', item.observations);
        await insertObservationInItemCart(productCode, item.observations);
        toast.success("Observação adicionada!")
      }
    } catch (error) {
      console.error("Erro ao inserir observação no item do carrinho:", error);
    }
  };
  
  const handleObservationChange = (value: string, productCode: string) => {
    setCartItem(prevItems =>
      prevItems.map(item =>
        item.codeProduct === productCode ? { ...item, observations: value } : item
      )
    );
  };

  const toggleObservationVisibility = (productCode: string) => {
    setObservationVisibility(prev => ({
      ...prev,
      [productCode]: !prev[productCode]
    }));
  };

  if (!cart || cartItem.length === 0) {
    return (
      <Container>
        <CartEmpty />
      </Container>
    );
  }

  return (
    <Layout>
      <LayoutContainer>
      <Container sx={{ marginTop: 5 }}>
        
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 50, color: 'grey.500' }}
          />
          <Typography variant="h4" fontWeight="bold">Seu Carrinho</Typography>
        </Box>        
        
        <List>
          {cartItem.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : (
            cartItem.map((item) => (
              <ListItem key={`item-${item.codeProduct}`}
              sx={{ bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1, marginTop: '10px' }}>
                <ListItemText
                  primary={<Typography variant="h6">{item.name}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body1">{item.description}</Typography>
                      {item.options.map(option => (
                        <Typography key={option.codeOption} variant="body2">{option.name} - R${option.price},00</Typography>
                      ))}
                      <Typography variant="body2">Preço unitário: R${item.price.toFixed(2)}</Typography>
                      <Typography variant="body2">Preço total: R${(item.price * item.quantity).toFixed(2)}</Typography>
                      {item.status === CartItemStatus.BLOCKED && (
                        <Typography color="error">Este item está bloqueado devido a opções não selecionadas.</Typography>
                      )}
                      {/* Botão para alternar a exibição da caixa de observação */}
                      <Button onClick={() => toggleObservationVisibility(item.codeProduct)}>
                        {observationVisibility[item.codeProduct] ? 'Esconder Observação' : 'Adicionar Observação'}
                      </Button>

                      {/* Exibe a caixa de observação com efeito de colapso */}
                      <Collapse in={observationVisibility[item.codeProduct]}>
                        <Box sx={{ maxWidth: '400px'}}>
                        <TextField
                            label="Observações"
                            variant="outlined"
                            value={item.observation ? item.observation : item.observations} // Corrigir para usar "observations"
                            onChange={(e) => handleObservationChange(e.target.value, item.codeProduct)}
                            fullWidth
                            margin="normal"
                            placeholder='Ex: tirar a cebola, maionese à parte etc.'
                            size='medium'
                          />

                          <Box display="flex" 
                            justifyContent="flex-start">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleInsertObservationInItemCart(item.codeProduct)}
                              size='small'
                            >
                              Salvar Observação
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </>
                  }
                />

                {item.status === CartItemStatus.BLOCKED ? (
                <Box sx={{ display: 'flex', gap: '10px', margin: '10px'}}>
                  <Button variant="outlined" onClick={() => handleBackToModal(item.codeProduct)} sx={{ ml: 1 }}>
                    Conferir
                  </Button>
                  <IconButton onClick={() => removeItem(item.codeProduct)} aria-label="Remover item">
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
                ) : (
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => decrementItem(item.productId, item.codeProduct)} disabled={item.status === CartItemStatus.BLOCKED}>
                    <Typography variant="body2">-</Typography>
                  </IconButton>
                  <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{item.quantity}</Typography>
                  <IconButton onClick={() => incrementItem(item.productId, item.codeProduct)} disabled={item.status === CartItemStatus.BLOCKED}>
                    <Typography variant="body2">+</Typography>
                  </IconButton>
                  <IconButton onClick={() => removeItem(item.codeProduct)} aria-label="Remover item">
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
                )}
              </ListItem>
            ))
          )}
        </List>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h6" align="right">Total do Carrinho: R$ {cartTotal.toFixed(2)}</Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="secondary" onClick={clearCart}>Limpar Carrinho</Button>
          <Button variant="contained" color="primary" onClick={() => {
            handleCheckout()
          }} disabled={!isCheckoutEnabled}>
            Confirmar
          </Button>
        </Box>
        <Link to='/'>
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2, mb: 10, paddingY: 1.5, fontWeight: 'bold' }} 
          >
            Continuar comprando
          </Button>
        </Link>
      </Container>

      {/* Modal de Produto */}
      {selectedProduct && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={closeProductModal}
          product={selectedProduct}
        />
      )}

      {/* Modal de Login */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />

      {/* Snackbar para mensagens de erro ou sucesso */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          Um erro ocorreu!
        </Alert>
      </Snackbar>
      </LayoutContainer>
    </Layout>
  );
};

export default Cart;
