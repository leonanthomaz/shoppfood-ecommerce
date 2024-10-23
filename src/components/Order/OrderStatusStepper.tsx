import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Ícone de entrega
// import MopedIcon from '@mui/icons-material/Moped';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

const steps = [
  'Aceito',
  'Preparando',
  'Partiu!',
  'Entregue',
  'Cancelado'
];

interface OrderStatusProps {
  currentStatus: string;
}

const OrderStatusStepper: React.FC<OrderStatusProps> = ({ currentStatus }) => {
  const getStepIndex = (status: string) => {
    return steps.indexOf(status);
  };

  const currentStepIndex = getStepIndex(currentStatus);

  return (
    <Box sx={{ width: '100%', paddingTop: '1rem', paddingBottom: '1rem' }}>
      <Typography variant="h6" sx={{ paddingBottom: '1.5rem' }}>
        Status do Pedido
      </Typography>
      <Stepper activeStep={currentStepIndex} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              icon={
                <Box
                  sx={{
                    position: 'relative',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: 2,
                      backgroundColor: index <= currentStepIndex ? 'primary.main' : 'grey.400',
                      left: 12,
                      top: 12,
                      zIndex: -1,
                    },
                  }}
                >
                  <TwoWheelerIcon
                    color={index <= currentStepIndex ? 'primary' : 'disabled'}
                    sx={{
                      transition: 'transform 0.5s',
                      transform: index === currentStepIndex ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                </Box>
              }
            >
              <Typography variant='body2' sx={{ fontSize: '10px'}}>{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderStatusStepper;
