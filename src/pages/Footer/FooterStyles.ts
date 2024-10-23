// src/pages/Footer/FooterStyles.ts
import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.colors.navbar};
  color: ${(props) => props.theme.colors.navbarText};
  padding: 10px;
  text-align: center;
`;
