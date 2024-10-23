import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Title, Form, Input, Button, ErrorMessage } from './RecoveryStyles';
import { toast } from 'react-toastify';
import { resetPassword } from '../../../functions/User';
import queryString from 'query-string';
import { useGlobal } from '../../../contexts/GlobalContext';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const { token } = queryString.parse(location.search) as { token: string };
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setLoading } = useGlobal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      console.log("TOKEN: " + token + " - " + "PASSWORD: " + password);
      await resetPassword(token || '', password);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      toast.error('Erro ao redefinir a senha.');
      setError('Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Redefinir Senha</Title>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="password"
          name="password"
          placeholder="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Redefinir Senha</Button>
      </Form>
    </Container>
  );
};

export default ResetPassword;
