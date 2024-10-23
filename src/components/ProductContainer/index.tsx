// src/components/ProductContainer/index.tsx
import React, { Fragment } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import { Box, Divider, Typography } from '@mui/material';
import ProductCard from '../ProductCard';
import CategoryIcon from '@mui/icons-material/Category';

const ProductContainer: React.FC = () => {
  const { categories } = useProduct();

  return (
    <Box sx={{ padding: '20px' }}>
      {categories.map((category) => (
        <Box key={category.id} sx={{ marginBottom: '30px' }}>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            { category.products.length > 0 ?
            <>
            <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: '700' }}>
              {category.name}
            </Typography> 
            </>
            : ""
            }
            <Divider sx={{ marginY: 2, marginX: 2 }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            {category.products
              .filter((product) => product.active)
              .map((product) => (
                <Fragment key={product.id}>
                <ProductCard product={product} />
                </Fragment>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProductContainer;
