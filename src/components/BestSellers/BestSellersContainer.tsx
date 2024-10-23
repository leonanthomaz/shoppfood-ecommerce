import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ProductCard from '../ProductCard';
import axios from 'axios';
import { useProduct } from '../../contexts/ProductContext';

const BestSellers: React.FC = () => {
  const { products } = useProduct(); // Pegando os produtos do contexto
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get('http://localhost:8090/orders/bestsellers');
        setProductsList(response.data);

        if (response.data.length === 0) {
          console.log("Nenhum best seller encontrado. Carregando produtos mais recentes.");
          setProductsList(products.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 10));
        }
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [products]);

  return (
    <Box>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: '700' }}>
          Mais Vendidos
        </Typography>
        <Divider sx={{ marginY: 2, marginX: 2 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          padding: '10px 0',
          gap: '16px',
        }}
      >
        {!loading && productsList.length === 0 && (
          <Typography variant="body1">Nenhum produto encontrado.</Typography>
        )}
        {!loading && productsList.length > 0 && productsList.filter((product) => product.active).map((product, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 260px',
              marginRight: '16px',
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
        {loading && <Typography variant="body1">Carregando produtos...</Typography>}
      </Box>
    </Box>
  );
};

export default BestSellers;
