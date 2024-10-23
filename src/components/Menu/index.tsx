import React, { useState, useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import { Container, Typography, Box } from '@mui/material';
import NavbarMenu from './NavbarMenu';
import ProductCard from '../ProductCard';
import Layout from '../Layout';
import { MainContent } from './MenuStyles';
import { useGlobal } from '../../contexts/GlobalContext';
import { useStore } from '../../contexts/StoreContext';

const Menu: React.FC = () => {
  const { store } = useStore()
  const { setLoading } = useGlobal()
  const { categories } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const selectedCategoryProducts = categories.find(category => category.id === selectedCategory)?.products || [];

  return (
    <Layout>
      <MainContent>
        <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Menu
        </Typography>
          {/* Menu de navegação de categorias */}
          <NavbarMenu categories={categories} setSelectedCategory={setSelectedCategory} />

          {/* Box de produtos */}
          <Box display="flex" flexWrap="wrap" marginTop={2}>
            {selectedCategoryProducts.length > 0 ? (
              selectedCategoryProducts.filter((product) => product.active).map(product => (
                <Box key={product.id} sx={{ width: { xs: '100%', sm: '48%', md: '30%' }, marginBottom: 2 }}>
                  <ProductCard product={product} />
                </Box>
              ))
            ) : (
              // Mensagem de erro caso não encontre produtos na categoria
              <Box display="flex" justifyContent="center" alignItems="center" height="60vh" width="100%">
                <Typography variant="body1" color={ store ? store.primaryColor : '#e40e0e'}>
                  PRODUTOS NÃO ENCONTRADOS.
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default Menu;
