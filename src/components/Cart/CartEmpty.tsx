import { Container, Typography, Box, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link } from 'react-router-dom';

const CartEmpty = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <ShoppingCartOutlinedIcon
          sx={{ fontSize: 100, color: 'grey.500' }}
        />
        <Typography variant="h4" gutterBottom>
          Carrinho Vazio
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Parece que seu carrinho está vazio. Explore nossos produtos e adicione itens ao seu carrinho!
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Voltar à Página Inicial
        </Button>
      </Box>
    </Container>
  );
};

export default CartEmpty;
