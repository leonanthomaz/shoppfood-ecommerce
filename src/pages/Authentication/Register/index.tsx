import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Alert, Box, Skeleton } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';
import { useGlobal } from '../../../contexts/GlobalContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { isLoading, setLoading } = useGlobal();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simula um carregamento de 2 segundos
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password);
      await login(formData.email, formData.password);
      toast.success('Seja bem-vindo!');
      navigate('/');
    } catch (err) {
      toast.error('Erro ao tentar registrar. Verifique suas informações.');
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
        navigate('/');
      } catch (error) {
        console.error('Erro detalhado: ', error);
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
          <Typography variant="h4" fontWeight="bold">Cadastrar</Typography>
        </Box>  

        {/* Exibe o Skeleton durante o carregamento */}
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Como prefere ser chamado?"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="password"
              label="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirmPassword"
              label="Confirme sua Senha"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>

            <Box sx={{ 
              mt: 2, 
              mb: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
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
                alignItems: 'center' 
              }}
            >
              <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth 
                >
                  Já tem uma conta? Faça Login
                </Button>
              </Link>
              <Link to="/recover-password" style={{ width: '100%', textDecoration: 'none' }}>
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth
                  sx={{ mb: 10 }}
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

export default RegisterPage;
