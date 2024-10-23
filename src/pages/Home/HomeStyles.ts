import styled from 'styled-components';

export const HomeWrapper = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 20px;
  margin-top: -10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 0;
`;

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
