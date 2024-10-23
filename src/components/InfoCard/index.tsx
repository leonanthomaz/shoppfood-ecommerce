// InfoCard.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faMoneyBillWave, faStore, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { InfoCardContainer, InfoSectionsContainer, InfoSection, SectionIcon, SectionContent, SearchContainer, Logo } from './InfoCardStyles';
import SearchResults from '../SearchResults';
import { Product } from '../../types/Product';
import { useProduct } from '../../contexts/ProductContext';
import { useStore } from '../../contexts/StoreContext';
import logo from '@/assets/imgs/logo-rf-w.png';
import { Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';

const InfoCard: React.FC = () => {
  const { fetchProducts } = useProduct();
  const { store, logoImageUrl } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProductsByStore = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByStore();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results);
      setIsResultsVisible(true);
    } else {
      setFilteredProducts([]);
      setIsResultsVisible(false);
    }
  }, [searchTerm, products]);

  const clearSearch = () => setSearchTerm('');

  return (
    <InfoCardContainer>
      <Box>
      <Logo style={{ backgroundColor: store?.primaryColor}}>
        <img src={logoImageUrl || logo} alt="Logo" />
      </Logo>
      </Box>
      <Box>
      <Typography 
        variant='body2' 
        textAlign='center' 
        fontSize= {isSmallScreen ? '20px' : '45px' }
        fontWeight='800'
        sx={{  borderRadius: '10px', padding: '5px', color: store?.primaryColor, fontFamily: "Oswald, sans-serif"}}>
          {store?.name}
      </Typography>
      <Divider sx={{ marginY: 2, marginX: 2 }} />
      <InfoSectionsContainer>
        <InfoSection>
          <SectionIcon><FontAwesomeIcon icon={faMotorcycle} size="lg"/></SectionIcon>
          <SectionContent>{store?.deliveryTime} min</SectionContent>
        </InfoSection>
        <InfoSection>
          <SectionIcon><FontAwesomeIcon icon={faMoneyBillWave} size="lg"/></SectionIcon>
          <SectionContent>Pedido mínimo: R${store?.minimumValue ? store?.minimumValue.toFixed(2) : 0}</SectionContent>
        </InfoSection>
        <InfoSection>
          <SectionIcon><FontAwesomeIcon icon={faStore} size="lg" /></SectionIcon>
          <SectionContent>{store?.open ? 'Aberto' : 'Fechado'}</SectionContent>
        </InfoSection>
      </InfoSectionsContainer>
      </Box>
      <SearchContainer>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm ? (
          <FontAwesomeIcon 
            icon={faTimes} 
            size="lg" 
            onClick={clearSearch} 
            style={{ cursor: 'pointer' }} 
          />
        ) : (
          <FontAwesomeIcon 
            icon={faSearch} 
            size="lg" 
          />
        )}
      </SearchContainer>
      <SearchResults products={filteredProducts} isVisible={isResultsVisible} />
    </InfoCardContainer>
  );
};

export default InfoCard;
