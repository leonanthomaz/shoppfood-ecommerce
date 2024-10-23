import { createTheme } from '@mui/material/styles';
import { useStore } from '../contexts/StoreContext';

export const useMuiTheme = () => {
  const { store } = useStore(); // Pega o tema da store

  // Define o tema do Material-UI usando as cores dinâmicas
  return createTheme({
    typography: {
      fontWeightBold: 700,
      fontFamily: "'Poppins', sans-serif",
    },
    palette: {
      primary: {
        main: store?.primaryColor || '#f74343', // Usa a cor salva no contexto ou a cor padrão
      },
      secondary: {
        main: '#ffffff', // Usa a cor salva no contexto ou a cor padrão
      },
      // Outras configurações de paleta
    },
    // Outras configurações do tema do Material-UI
  });
};
