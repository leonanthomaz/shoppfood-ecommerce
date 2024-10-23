import styled from 'styled-components';

export const NavbarContainer = styled.nav`
  width: 100%;
  height: 5rem;
  background-color: ${(props) => props.theme.colors.navbar};
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const Logo = styled.div`
  color: ${(props) => props.theme.colors.navbarText};
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
  width: 80px;
  height: 80px;
  cursor: pointer;

  img {
    height: 100%;
    width: auto;
  }
`;

export const NavLinks = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: start;
  position: relative;
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.secondary};
  margin-left: 20px;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh);
    background-color: ${(props) => props.theme.colors.navbar};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease-in-out;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    z-index: 999;
    display: flex;
    margin-left: 0px;
  }

  a, button {
    margin: 10px;
    color: ${(props) => props.theme.colors.navbarText};
    font-size: 18px;
    font-weight: bold;
    transition: color 0.3s;
    background: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      color: ${(props) => props.theme.colors.hover};
    }
  }
`;

export const FooterContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    max-height: 120px;

    img {
      width: 200px;
    }

    p {
      color: ${(props) => props.theme.colors.navbarText};
      font-size: 14px;
    }
  }
`;

export const SeparatorLine = styled.hr`
  width: 80%;
  border: 0;
  border-top: 1px solid ${(props) => props.theme.colors.navbarText};
  margin: 20px 0;
`;

export const Hamburger = styled.div`
  display: none;
  color: ${(props) => props.theme.colors.navbarText};
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const CloseIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.navbarText};
  font-size: 30px;

  @media (min-width: 769px) {
    display: none;
  }
`;
