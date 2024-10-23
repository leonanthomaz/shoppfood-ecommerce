import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import CancelOrderModal from '../components/Modal/CancelOrderModal';
import CepModal from '../components/Modal/CepModal';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import LoadingPage from '../components/Loading/LoadingPage';

interface GlobalContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showCepModal: boolean;
  setShowCepModal: (show: boolean) => void;
  showCancelOrderModal: boolean;
  setShowCancelOrderModal: (show: boolean) => void;
  cancelOrder: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCepModal, setShowCepModal] = useState<boolean>(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState<boolean>(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const cancelOrder = async () => {
    const orderCode = localStorage.getItem("ORDER_CODE");
    try {
      await api.post(`/order/cancel/${orderCode}`);
      localStorage.removeItem("ORDER_CODE");
      toast.success("Pedido cancelado com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar o pedido:", error);
      toast.error("Erro ao cancelar o pedido.");
    } finally {
      setShowCancelOrderModal(false);
    }
  };

  // Exibir o modal do CEP ao inicializar o app
  useEffect(() => {
    const userCep = localStorage.getItem('USER_CEP');
    const cepNotValidated = localStorage.getItem('cepNotValidated');
    if (!userCep && !cepNotValidated) {
      setShowCepModal(true);
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setLoading,
        showCepModal,
        setShowCepModal,
        showCancelOrderModal,
        setShowCancelOrderModal,
        cancelOrder,
      }}
    >
      {/* Renderiza a página de loading se estiver carregando */}
      {isLoading && <LoadingPage />}
      
      {/* Renderiza o conteúdo principal */}
      {children}

      {/* Modais */}
      {showCepModal && <CepModal />}
      {showCancelOrderModal && (
        <CancelOrderModal
          open={showCancelOrderModal}
          onClose={() => setShowCancelOrderModal(false)}
          onConfirm={cancelOrder}
        />
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
