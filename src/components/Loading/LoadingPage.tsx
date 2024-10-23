// LoadingPage.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import logo from '@/assets/imgs/logo-rf.png';

const LoadingPage: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
        zIndex: 1300,
      }}
    >
      <CircularProgress size={80} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        <div>
          <img src={logo} alt="Logo" width={200} />
        </div>
      </Typography>
    </Box>
  );
};

export default LoadingPage;
