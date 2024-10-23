import styled from 'styled-components';

export const CardContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  max-width: 100%;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
`;

export const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 1.2em;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 1em;
    }
  }

  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text};
    font-size: 1em;

    @media (max-width: 768px) {
      font-size: 0.8em;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1em;

    @media (max-width: 768px) {
      font-size: 0.9em;
    }
  }

  h4 {
    margin: 0;
    font-size: 1.5em;
    color: ${(props) => props.theme.colors.primary};

    @media (max-width: 768px) {
      font-size: 1.2em;
    }
  }
`;

export const Image = styled.div`
  flex: 1;
  max-width: 150px;
  max-height: 150px;

  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    object-fit: cover;

    @media (max-width: 450px) {
      width: 100%;
      max-width: 100px;
    }
  }
`;

export const PeopleIcon = styled.span`
  font-size: 1.2em;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

export const AddToCartButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: all ease 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.hover};
  }
`;