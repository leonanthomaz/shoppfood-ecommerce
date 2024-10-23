import React from 'react';
import ProductCard from '../ProductCard';
import { SearchResultsContainer, ProductList } from './SearchResultsStyles';
import { Product } from '../../types/Product';
import { Grid } from '@mui/material';

interface SearchResultsProps {
  products: Product[];
  isVisible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, isVisible }) => {
  return (
    <SearchResultsContainer $isVisible={isVisible}>
      <ProductList container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </ProductList>
    </SearchResultsContainer>
  );
};

export default SearchResults;
