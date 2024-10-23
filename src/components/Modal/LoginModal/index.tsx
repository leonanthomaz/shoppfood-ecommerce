import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Skeleton } from '@mui/material';
import LoginPage from '../../../pages/Authentication/Login';
import { Link } from 'react-router-dom';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<ModalLoginProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle></DialogTitle>
      <DialogContent>
        {loading ? (
          <Skeleton variant="rectangular" />
        ) : (
          <LoginPage />
        )}
      </DialogContent>
      <DialogActions>
        <Link to="/checkout" style={{ textDecoration: 'none' }}>
          <Button variant="text" color="primary">
            Continuar sem Login
          </Button>
        </Link>
        <Button onClick={onClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
