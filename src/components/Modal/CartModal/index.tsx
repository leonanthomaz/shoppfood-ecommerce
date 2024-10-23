// src/components/CartModal/index.tsx
import React from 'react';
import Modal from 'react-modal';
import { ModalStyles } from './CartModalStyles'; 
import Cart from '../../Cart';

interface CartModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onBack?: () => void; // Adicionando uma função de fechamento adicional
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onRequestClose, onBack }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Carrinho"
      style={ModalStyles}
    >
      <Cart onCheckoutSuccess={onRequestClose} onBack={onBack} />
    </Modal>
  );
};

export default CartModal;
