import styled from 'styled-components';

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