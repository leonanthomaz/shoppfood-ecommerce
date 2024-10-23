import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${(props) => props.theme.fonts.main};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
  }

  button, select, option, input {
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    font-family: ${(props) => props.theme.fonts.heading};
    color: ${(props) => props.theme.colors.heading};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  p {
    font-family: ${(props) => props.theme.fonts.main};
  }

  .accent {
    font-family: ${(props) => props.theme.fonts.accent};
  }

  @media (max-width: 1080px) {
    html {
      font-size: 93.75%;
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%;
    }
  }

  @media (max-width: 600px) {
    html {
      font-size: 81.25%;
    }
  }

  /* Estilos de carregamento */
  .loading {
    position: relative;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
  }

  .loading::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(230,230,230,0.8) 50%, rgba(255,255,255,0) 100%);
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Para aplicar o efeito a todos os elementos enquanto carregam */
  .loading-global {
    background: #f0f0f0;
    position: relative;
    overflow: hidden;
  }
  
  .loading-global::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(230,230,230,0.8) 50%, rgba(255,255,255,0) 100%);
    animation: loading 1.5s infinite;
  }
`;
