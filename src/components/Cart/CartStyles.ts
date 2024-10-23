import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};

  h2 {
    font-size: 30px;
    margin-bottom: 20px;
  }

  p {
    margin: 10px 0;
  }
`;

export const CartItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: 10px;
  /* background-color: ${(props) => props.theme.colors.navbar}; */
  
  div {
    flex-grow: 1;
  }

  h3 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 5px 0;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Espaço entre os itens */
`;

export const Quantity = styled.span`
  margin: 0 5px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.buttonBackground};
  color: ${(props) => props.theme.colors.buttonText};
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.terms_primaryDark};
  }

  svg {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const Total = styled.div`
  margin: 20px 0;
  text-align: right;

  h2 {
    margin: 0;
    font-size: 24px;
  }
`;

export const StatusMessage = styled.p`
  color: red;
  font-weight: bold;
`;
