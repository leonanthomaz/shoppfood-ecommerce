import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
  }
`;

export const Total = styled.div`
  margin-top: 20px;
  font-size: 1.2em;
`;

export const AddressInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const HiddenInput = styled.input`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`;

export const ProductList = styled.div`
  margin-bottom: 20px;
`;

export const OptionList = styled.ul`
  padding-left: 20px;
  list-style-type: disc;
`;

export const PaymentPix = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  p {
    margin: 10px 0;
    color: ${(props) => props.theme.colors.text};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px auto;
  }
`;