import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';

const PixQRCodeComponent = ({ pixQRCode, pixQRCodeText, countdown }) => {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          return 0;
        }
        setProgress((newTimeLeft / countdown) * 100);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleCopyPixCode = () => {
    // Lógica para copiar o código Pix
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      {pixQRCode && (
        <>
          <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code Pix" width={200} />
          <Typography variant="body1">{pixQRCodeText}</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, mt: 1 }} />
          <Typography variant="body2" color="error" mt={1}>{`Tempo restante: ${timeLeft}s`}</Typography>
          <Button variant="outlined" color="primary" onClick={handleCopyPixCode} sx={{ mt: 1 }}>
            Copiar Código Pix
          </Button>
        </>
      )}
    </Box>
  );
};

export default PixQRCodeComponent;
