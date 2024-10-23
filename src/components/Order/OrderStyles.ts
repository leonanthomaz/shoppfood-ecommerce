import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const OrderContainer = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.paper};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const OrderContent = styled(Box)`
  margin-top: 20px;
  padding: 20px;
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
