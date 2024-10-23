import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useMuiTheme } from './styles/muiTheme';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/globalStyles';

import { GlobalProvider } from './contexts/GlobalContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StoreProvider } from './contexts/StoreContext';

const Root = () => {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
};

const MainApp = () => {
  const muiTheme = useMuiTheme();

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <GlobalProvider>
            <ProductProvider>
              <AuthProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_ID_CLIENT}>
                  <CartProvider>
                    <OrderProvider>
                      <App />
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />
                    </OrderProvider>
                  </CartProvider>
                </GoogleOAuthProvider>
              </AuthProvider>
            </ProductProvider>
          </GlobalProvider>
        </Router>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
