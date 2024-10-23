import { useEffect, useState } from "react";
import { CheckoutContainer } from "./PurchasePageStyles";
import deliveryImage from "@/assets/imgs/delivery.svg";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";

export default function PurchasePage() {
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  // Função para copiar o código do pedido
  const handleCopyOrderCode = async () => {
    const orderCode = localStorage.getItem("ORDER_CODE");
    if (orderCode) {
      try {
        await navigator.clipboard.writeText(orderCode);
        setCopied(true);
        localStorage.removeItem("ORDER_CODE")
        toast.success('Código copiado para a área de transferência!');
      } catch (error) {
        toast.error('Erro ao copiar o código.');
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // Inicia a contagem regressiva somente se o código foi copiado
    if (copied) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Redireciona após o tempo de contagem regressiva atingir 0
    if (time === 0) {
      navigate("/orders");
    }

    // Limpa o intervalo quando o componente é desmontado ou o tempo é alterado
    return () => clearInterval(interval);
  }, [time, copied, navigate]);

  return (
    <CheckoutContainer>
      <h1>Recebemos seu pedido!</h1>
      <h3>O código do seu pedido é <b>{localStorage.getItem("ORDER_CODE")}</b></h3>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        {!copied ? 
        <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleCopyOrderCode} 
        sx={{ mt: 1 }}
        >
          Copiar Código do Pedido
        </Button>
        :
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 1 }}
        >
          Copiado!
        </Button>
        }
      </Box>
      <img src={deliveryImage} alt="Delivery" />
      {copied ? <p>Você será redirecionado(a) em {time} segundos</p> : ""}
    </CheckoutContainer>
  );
}
