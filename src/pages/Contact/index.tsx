import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Skeleton, Container } from '@mui/material';
import Layout from '../../components/Layout';
import GMaps from './GMaps';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Ícone do WhatsApp
import { Fab } from '@mui/material'; // Floating Action Button

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Simula o tempo de carregamento dos dados
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Carrega por 2 segundos
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Aqui você pode adicionar a lógica para enviar a mensagem ao backend
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ marginTop: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contato
        </Typography>

        <Typography variant="body1" gutterBottom>
          Preencha o formulário abaixo para entrar em contato conosco.
        </Typography>

        {/* Formulário de Contato */}
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rectangular" height={40} width={150} />
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Mensagem"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
              Enviar
            </Button>
          </form>
        )}

        <Box>
          {/* Google Maps */}
          <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
            Nossa Localização:
          </Typography>
          <GMaps />
        </Box>

        {/* Mensagem de sucesso após envio */}
        {submitted && !loading && (
          <Typography variant="h6" color="success.main" sx={{ marginTop: 2 }}>
            Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.
          </Typography>
        )}
      </Container>

      {/* Ícone do WhatsApp flutuante */}
      <Fab
        color="success"
        sx={{
          position: 'fixed',
          bottom: 86,
          right: 16,
        }}
        href="https://wa.me/seunumerodetelefone" // Substitua pelo número de telefone correto
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon />
      </Fab>
    </Layout>
  );
};

export default ContactPage;
