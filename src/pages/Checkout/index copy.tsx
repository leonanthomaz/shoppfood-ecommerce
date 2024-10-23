import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { OrderPaymentDTO } from '../../types/Payment';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { api, getCartCode } from '../../services/api';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { PaymentPix } from './CheckoutStyles';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

initMercadoPago(import.meta.env.VITE_API_MERCADO_PAGO_KEY);

const Checkout: React.FC = () => {
  const { cart, confirmePayment, clearCart } = useCart();
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [address, setAddress] = useState<{ street: string, city: string, neighborhood: string, state: string }>({ street: '', city: '', neighborhood: '', state: '' });
  const [number, setNumber] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [change, setChange] = useState<string>(''); // Campo de troco
  // const [showPixImage, setShowPixImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [pixQRCodeText, setPixQRCodeText] = useState<string | null>(null);
  const { state } = useAuth()

  console.log(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart) {
      setError('Carrinho está vazio.');
      return;
    }

    const orderPaymentDTO: OrderPaymentDTO = {
      amount: cart.total,
      paymentMethod,
      address: `${address.street}, ${number} - ${address.neighborhood}, ${address.city} - ${address.state}`,
      cartCode: cart.cartCode,
    };

    try {
      await confirmePayment(orderPaymentDTO);
      clearCart();
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      setError('Erro ao processar o pagamento.');
    }
  };

  const fetchAddressFromCep = async () => {
    try {
      const response = await api.get(`/address/${cep}`);
      const data = await response.data;
      setAddress({
        street: data.street,
        city: data.city,
        neighborhood: data.neighborhood,
        state: data.state,
      });
    } catch {
      setError('Erro ao buscar o CEP.');
    }
  };

  const handleGeneratePixQRCode = async () => {
    try {
      const cartCode = getCartCode();
      // const token = '';

      if (cartCode) {
        const paymentRequestDTO = {
          transactionAmount: cart?.total,
          payer: {
            email: 'leonan.thomaz@gmail.com',
            identification: {
              number: 'empresa@email.com',
              type: 'pix',
            },
          },
          // token: token,
          issuerId: 'pix',
          paymentMethodId: '',
          installments: 1
        };

        const response = await fetch('http://localhost:8080/payments/pix/qr-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(paymentRequestDTO)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('QR Code Data:', data); // Para verificar os dados recebidos
          setPixQRCode(data.qrCodeBase64);
          setPixQRCodeText(data.qrCodeUrl)
        } else {
          const errorText = await response.text();
          toast.error(`Erro ao gerar QR Code Pix: ${errorText}`);
        }
      } else {
        toast.error('Código do carrinho ou token não encontrados.');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code Pix:', error);
      toast.error('Erro ao gerar QR Code Pix.');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Erro no pagamento:', error);
    toast.error('Erro ao processar pagamento.');
  };

  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const cartCode = localStorage.getItem("CART_CODE");

      if (token && cartCode) {
        const orderPaymentDTO = {
          cartCode: cartCode,
          userToken: token,
          paymentDetails: {
            token: paymentResponse.token,
            issuerId: paymentResponse.issuer_id,
            paymentMethodId: paymentResponse.payment_method_id,
            transactionAmount: cart?.total,
            installments: paymentResponse.installments,
            payer: {
              email: state.user?.email || '',
              identification: {
                number: paymentResponse.payer.identification.number,
                type: paymentResponse.payer.identification.type,
              },
            },
          },
        };

        // await createOrder(cartCode, token);
        // toast.success('Pedido realizado com sucesso!');
        // await processPayment(orderPaymentDTO);
        // toast.success('Pagamento realizado com sucesso!');
        // setCartItems([]);
        // setCartTotal(0);
        // navigate('/orders');
      } else {
        toast.error('Token ou código do carrinho não encontrados.');
      }
    } catch (error) {
      console.error('Erro ao finalizar pagamento:', error);
      toast.error('Erro ao finalizar pagamento.');
    }
  };

  const handleCopyPixCode = async () => {
    if (pixQRCodeText) {
      try {
        // Verifica se o método clipboard existe
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(pixQRCodeText);
          toast.success('Código Pix copiado para a área de transferência!');
        } else {
          throw new Error('Acesso à área de transferência não suportado.');
        }
      } catch (error) {
        console.error('Erro ao copiar para área de transferência:', error);
        toast.error('Erro ao copiar o código Pix. Verifique as permissões ou tente manualmente.');
      }
    } else {
      toast.error('Nenhum código Pix disponível para copiar.');
    }
  };
  

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4, marginTop: 10 }}>
      <Typography variant="h4" gutterBottom>
        Finalizar Compra
      </Typography>
      <Typography variant="h6">Seus carrinho</Typography>

      <Box sx={{ marginBottom: 4 }}>
        {cart?.items.map((item) => (
          <Box key={item.codeProduct} sx={{ marginBottom: 2, border: '1px solid #ddd', padding: 2 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">{item.description}</Typography>
            <Typography variant="body2">Preço: R$ {item.price.toFixed(2)} - {item.quantity}x</Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Opções:
            </Typography>
            {item.options.map((option) => (
              <Typography key={option.codeOption} variant="body2">
                {option.name} ({option.quantity}x)
              </Typography>
            ))}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Total: R$ {cart?.total.toFixed(2)}
      </Typography>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Telefone"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CEP"
              fullWidth
              margin="normal"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={fetchAddressFromCep}
              required
            />
          </Grid>
        </Grid>

        <TextField
          label="Rua"
          fullWidth
          margin="normal"
          value={address.street}
          InputProps={{ readOnly: true }}
        />
        
        <TextField
          label="Bairro"
          fullWidth
          margin="normal"
          value={address.neighborhood}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Cidade"
          fullWidth
          margin="normal"
          value={address.city}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Estado"
          fullWidth
          margin="normal"
          value={address.state}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Número"
          fullWidth
          margin="normal"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />

        <TextField
          label="Complemento"
          fullWidth
          margin="normal"
          value={complement}
          onChange={(e) => setComplement(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Forma de Pagamento</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <MenuItem value="cash">Dinheiro</MenuItem>
            <MenuItem value="pix">Pix</MenuItem>
            <MenuItem value="card">Cartão de Crédito</MenuItem>
          </Select>
        </FormControl>

        {paymentMethod === 'cash' && (
          <TextField
            label="Troco para"
            fullWidth
            margin="normal"
            value={change}
            onChange={(e) => setChange(e.target.value)}
          />
        )}

        {paymentMethod === 'card' && (
          <CardPayment
            initialization={{ amount: cart?.total }}
            onError={handlePaymentError}
            onSuccess={handlePaymentSuccess}
            locale="pt-BR"
          />
        )}

        {paymentMethod === 'pix' && (
          <PaymentPix>
            <Button variant="contained" color="primary" fullWidth onClick={handleGeneratePixQRCode}>
              Gerar QR Code Pix
            </Button>
            {pixQRCode && <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code Pix" width={300} />}
            {pixQRCodeText && (
              <>
                <p>{pixQRCodeText}</p>
                <Button variant="outlined" color="primary" onClick={handleCopyPixCode}>
                  Copiar Código Pix
                </Button>
              </>
            )}
          </PaymentPix>
        )}

        <Button variant="contained" color="primary" type="submit" fullWidth>
          <Link to='/payment'>Ir para pagamento</Link>
        </Button>
      </form>
      <br/>
      <br/>
      <br/>
    </Box>
  );
};

export default Checkout;
