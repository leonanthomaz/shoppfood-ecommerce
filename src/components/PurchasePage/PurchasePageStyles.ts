import styled from "styled-components";

export const CheckoutContainer = styled.div`
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 8rem);
  padding: 0 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1, p {
    text-align: center;
    color: ${(props) => props.theme.colors.heading};  // Se quiser usar cor do tema
  }

  img {
    margin: 1rem 0;
    width: 8rem;
    animation: animate-image 2s infinite;
  }

  @keyframes animate-image {
    from {
      transform: translate(-250%, 0);
    }
    to {
      transform: translate(250%, 0);
    }
  }
`;
