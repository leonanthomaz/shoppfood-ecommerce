import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  font-size: 36px;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 400px;
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;

  ::placeholder {
    color: ${(props) => props.theme.colors.placeholder};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => props.theme.colors.buttonBackground};
  border: none;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.buttonText};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.buttonHover};
  }
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 15px;
  font-size: 14px;
`;
