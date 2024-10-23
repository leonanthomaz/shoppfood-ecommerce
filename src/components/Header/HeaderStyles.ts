import styled from 'styled-components';
import header from '@/assets/imgs/header.jpg';

export const HeaderContainer = styled.header`
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.secondary};
  height: 70vh;
  text-align: center;
  z-index: 0;
  overflow: hidden;

  background-image: url(${header});

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5); 
    z-index: -1;
  }
`;
