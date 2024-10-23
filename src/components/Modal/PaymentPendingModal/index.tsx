import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface PaymentPendingModalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentPendingModal: React.FC<PaymentPendingModalProps> = ({ open, onClose }) => {
  const handleRedirectToPayment = () => {
    // Redirecionar para a página de pagamento
    window.location.href = '/payment';
  };

  return (
    <Dialog open={open} onClose={onClose}>
      
      <DialogTitle>Pagamento Pendente</DialogTitle>
      
      <DialogContent>
        <p>Você tem um pedido em andamento aguardando pagamento. Por favor, finalize o pagamento para prosseguir.</p>
      </DialogContent>
      
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
        <Button onClick={handleRedirectToPayment} color="primary">
          Ir para Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPendingModal;
