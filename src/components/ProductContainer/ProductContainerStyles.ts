import styled from 'styled-components';

export const ProductWapper = styled.div``;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
  max-width: 1200px; 

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
