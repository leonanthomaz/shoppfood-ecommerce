// src/components/Gallery/BestSellersContainerStyles.ts
import styled from 'styled-components';

export const BestSellersContainer = styled.div`
  display: flex;
  overflow-x: auto; /* Permite scroll horizontal */
  padding: 20px 0;
  scrollbar-width: thin; /* Para Firefox */
  &::-webkit-scrollbar {
    height: 8px; /* Altura da scrollbar */
  }
  &::-webkit-scrollbar-thumb {
    background: #888; /* Cor do thumb */
    border-radius: 4px; /* Bordas arredondadas */
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555; /* Cor do thumb ao passar o mouse */
  }
`;

export const BestSellersTitle = styled.h2`
  padding: 20px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
  margin: 0;
`;
