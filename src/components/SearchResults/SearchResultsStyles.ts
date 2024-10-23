import styled from 'styled-components';
import { Container } from '@mui/material';

export const SearchResultsContainer = styled(Container)<{ $isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 5px;
  max-height: auto;
  overflow-y: auto;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(-20px)')};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;
