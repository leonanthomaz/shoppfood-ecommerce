import styled from 'styled-components';

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: ${(props) => props.theme.colors.navbar};
  padding: 10px 0;
  margin-top: 100px;
  border: solid red;
`;

export const NavbarItem = styled.div`
  color: ${(props) => props.theme.colors.navbarText};
  cursor: pointer;
  padding: 10px 20px;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.buttonText};
  }
`;
