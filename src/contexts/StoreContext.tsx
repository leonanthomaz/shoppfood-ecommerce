// contexts/StoreContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { getMerchantCode } from '../services/api';
import { Store } from '../types/Store';

interface StoreContextType {
  store: Store | undefined;
  logoImageUrl: string | null;
  headerImageUrl: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store>();
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const merchantCode = getMerchantCode();

    const getStore = async () => {
      try {
        const storeData = await axios.get(`http://localhost:8080/store/find?merchantCode=${merchantCode}`);
        setStore(storeData.data);
      } catch (error) {
        console.error('Erro ao buscar loja:', error);
      }
    };

    getStore();
  }, []);

  useEffect(() => {
    const merchantCode = getMerchantCode();
    if (store?.logoImage) {
      const loadImage = async () => {
        if (store?.logoImage) {
            try {
                const response = await axios.get(
                    `http://localhost:8080/store/store/logo/${merchantCode}/${store.logoImage}`,
                    { responseType: 'blob' }
                  );
        
                  if (response.data) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setLogoImageUrl(imageUrl);
                  }
            } catch (error) {
              console.error('Erro ao carregar a imagem da logo:', error);
            }
          }
          if (store?.headerImage) {
            try {
                const response = await axios.get(
                    `http://localhost:8080/store/store/header/${merchantCode}/${store.headerImage}`,
                    { responseType: 'blob' }
                  );
        
                  if (response.data) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setHeaderImageUrl(imageUrl);
                  }
            } catch (error) {
              console.error('Erro ao carregar a imagem do cabeçalho:', error);
            }
        }
      };

      loadImage();
    }
  }, [store]);

  return (
    <StoreContext.Provider value={{ 
      store, logoImageUrl, headerImageUrl }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};
