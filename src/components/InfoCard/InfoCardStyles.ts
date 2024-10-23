import styled from 'styled-components';

export const InfoCardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 800px;
  position: relative;
  z-index: 10;
  margin-top: -180px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 95%;
  }
`;

export const Logo = styled.div`
  position: absolute; /* Permite posicionar a logo absolutamente */
  top: -35%;
  left: 50%; /* Centraliza horizontalmente */
  transform: translate(-50%, -50%); /* Ajusta a posição para o centro da logo */
  color: ${(props) => props.theme.colors.navbarText};
  background-color: transparent;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  width: 200px;
  height: 200px;
  padding: 5px;
  z-index: 1; 

  img {
    height: 100%;
    border-radius: 50%;
    width: auto;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }

`;

export const InfoSectionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    /* flex-direction: column;
    align-items: flex-start; */
  }
`;

export const InfoSection = styled.div`
  display: flex;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const SectionIcon = styled.div`
  margin-right: 10px;
  /* color: ${(props) => props.theme.colors.primary}; */
  

  @media (max-width: 768px) {
    font-size: 12px;
    margin-right: 5px;
  }
`;

export const SectionContent = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};

  @media (max-width: 450px) {
    font-size: 10px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 5px;
  padding: 5px;
  background-color: ${(props) => props.theme.colors.secondary};

  input {
    border: none;
    outline: none;
    font-size: 16px;
    color: ${(props) => props.theme.colors.text};
    flex: 1;
    padding: 10px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
    
  }


  svg {
    color: ${(props) => props.theme.colors.primary};
    margin-left: 10px;

    @media (max-width: 768px) {
      margin-left: 5px;
    }
  }
`;
