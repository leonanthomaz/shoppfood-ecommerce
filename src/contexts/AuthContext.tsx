import { createContext, useReducer, useEffect, ReactNode, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getUserDetails, apiLoginWithGoogle, updateUserDetails } from '../functions/User';
import { toast } from 'react-toastify';
import { AuthContextActions, AuthContextState, User } from '../types/User';
// import { Address, AddressDTO } from '../types/Address';

export interface AuthContextType {
  state: AuthContextState;
  dispatch: React.Dispatch<AuthContextActions>;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (token: string) => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (user: User) => void;
  // updateInfoCheckout: (editableUser: User, address: Address) => Promise<void>;
}

const initialState: AuthContextState = {
  authenticated: !!localStorage.getItem("USER_TOKEN"),
  user: JSON.parse(localStorage.getItem('CURRENT_USER') || 'null'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthContextState, action: AuthContextActions): AuthContextState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const user = state.user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("USER_TOKEN");
      if (token && !state.user) {
        try {
          const data = await getUserDetails(token);
          dispatch({ type: 'SET_USER', payload: data });
          localStorage.setItem('CURRENT_USER', JSON.stringify(data));
        } catch {
          localStorage.removeItem("USER_TOKEN");
          localStorage.removeItem('CURRENT_USER');
        }
      }
    };

    initializeAuth();
  }, [state.user]);

  const login = async (email: string, password: string) => {
    try {
      const token = await apiLogin(email, password);
      localStorage.setItem("USER_TOKEN", token);
      dispatch({ type: 'LOGIN' });
      const user = await getUserDetails(token);
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('CURRENT_USER', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed');
    }
  };

  const loginWithGoogle = async (token: string): Promise<void> => {
    try {
      const response = await apiLoginWithGoogle(token);
      localStorage.setItem("USER_TOKEN", response.token);
      dispatch({ type: 'LOGIN' });
      const user = await getUserDetails(response.token);
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('CURRENT_USER', JSON.stringify(user));
    } catch (error) {
      console.error('Login com Google falhou', error);
      throw new Error('Login com Google falhou');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiRegister(name, email, password);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error('Registro falhou', error);
      throw new Error('Registro falhou');
    }
  };

  const logout = () => {
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem('CURRENT_USER');
    toast("Logout realizado com sucesso!");
    dispatch({ type: 'LOGOUT' });
  };

  // const updateInfoCheckout = async (editableUser: User, address: AddressDTO) => {
  //   try {
  //     await updateUserDetails(editableUser, address);
  //     toast("Atualizados com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao atualizar dados...", error);
  //   }
  // };

  return (
    <AuthContext.Provider value={{ 
      state, 
      dispatch, 
      login, 
      register, 
      loginWithGoogle, 
      logout, 
      isAuthenticated: state.authenticated, 
      updateUser: (user: User) => dispatch({ type: 'SET_USER', payload: user }), 
      // updateInfoCheckout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
