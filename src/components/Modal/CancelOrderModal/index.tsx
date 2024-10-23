// components/CancelOrderModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">Cancelar Pedido</Typography>
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error">
          Confirmar Cancelamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderModal;
