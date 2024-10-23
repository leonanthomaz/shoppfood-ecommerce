import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { useGlobal } from '../../../contexts/GlobalContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { isLoading, setLoading } = useGlobal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Login bem-sucedido!');
      navigate('/checkout');
    } catch (err) {
      setError('Erro ao tentar fazer login. Verifique suas credenciais.');
      toast.error('Erro ao tentar fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    const token = response?.credential;
    if (token) {
      try {
        await loginWithGoogle(token);
        toast.success('Login com Google bem-sucedido!');
        navigate('/checkout');
      } catch (error) {
        setError('Erro ao autenticar com Google.');
        toast.error('Erro ao autenticar com Google.');
      }
    } else {
      setError('Erro ao autenticar com Google.');
      toast.error('Erro ao autenticar com Google.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          {/* <ShoppingCartOutlinedIcon
            sx={{ fontSize: 50, color: 'grey.500' }}
          /> */}
          <Typography variant="h4" fontWeight="bold">Login</Typography>
        </Box>   

        {/* Exibe o Skeleton durante o carregamento */}
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email ou telefone"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Entrar
            </Button>

            <Box 
              sx={{ 
                mt: 2, 
                mb: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleResponse}
                onError={() => toast.error('Erro ao autenticar com Google.')}
              />
            </Box>

            <Box 
              sx={{ 
                mt: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <Link to="/register" style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth 
                  sx={{ mb: 1 }}
                >
                  Não tem uma conta? Cadastre-se
                </Button>
              </Link>
              <Link to="/recover-password" style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth
                >
                  Esqueceu sua senha? Clique Aqui
                </Button>
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
