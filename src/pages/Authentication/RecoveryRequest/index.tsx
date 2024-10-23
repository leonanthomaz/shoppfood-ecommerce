import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Form, Input, Button, ErrorMessage } from './RecoveryStyles';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../../../functions/User';
import { useGlobal } from '../../../contexts/GlobalContext';

const RecoveryRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setLoading } = useGlobal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    console.log("Email enviado: " + email)
    try {
      await requestPasswordReset(email);
      toast.success('Link de recuperação enviado para seu e-mail!');
      navigate('/login');
    } catch (err) {
      toast.error('Erro ao enviar o link de recuperação.');
      setError('Erro ao enviar o link de recuperação. Verifique se o e-mail está correto.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <Title>Recuperação de Senha</Title>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Enviar Link de Recuperação</Button>
      </Form>
    </Container>
  );
};

export default RecoveryRequest;
