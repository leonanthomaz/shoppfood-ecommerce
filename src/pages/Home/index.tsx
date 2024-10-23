import React, { useEffect, useState } from 'react';
import ProductContainer from '../../components/ProductContainer';
import { HomeWrapper, ProductsContainer } from './HomeStyles';
import InfoCard from '../../components/InfoCard';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import BestSellers from '../../components/BestSellers/BestSellersContainer';
// import { api, getMerchantCode } from '../../services/api';
import { Delivery } from '../../types/Delivery';

const Home: React.FC = () => {
  // const [deliveryInfo, setDeliveryInfo] = useState<Delivery | null>(null);

  // console.log("INFORMAÇÕES: ", deliveryInfo)

  // useEffect(() => {
  //   const fetchDeliveryInfo = async () => {
  //     const merchantCode = getMerchantCode();
  //     try {
  //       const response = await api.get(`/delivery/check/${merchantCode}`);
  //       setDeliveryInfo(response.data);
  //     } catch (error) {
  //       console.error('Erro ao buscar informações de entrega:', error);
  //     }
  //   };

  //   fetchDeliveryInfo();
  // }, []);

  return (
    <Layout>
      <Header/>
      <InfoCard />
      <HomeWrapper>
        <BestSellers />
        <ProductContainer />
      </HomeWrapper>
    </Layout>
  );
};

export default Home;
