// src/components/ProductModal/ProductModalStyles.ts
import styled from 'styled-components';

export const ItemSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  button {
    background-color: ${(props) => props.theme.colors.buttonBackground};
    color: ${(props) => props.theme.colors.buttonText};
    border: none;
    padding: 5px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1.2rem;
    
    &:disabled {
      background-color: ${(props) => props.theme.colors.border};
      cursor: not-allowed;
    }
  }
  
  span {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 0.2rem;
    gap: 3px;

    button{
      font-size: 0.9rem;
    }

    span {
      font-size: 0.9rem;
    }
  }
`;

export const Teste = styled.div`
  border: 2px solid red;
`;
