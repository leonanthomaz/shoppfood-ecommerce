import React from 'react';
import { Button, Skeleton, Box } from '@mui/material';
import { Category } from '../../types/Category';
import { useGlobal } from '../../contexts/GlobalContext';
import { useStore } from '../../contexts/StoreContext';

interface NavbarMenuProps {
  categories: Category[];
  setSelectedCategory: (id: number) => void;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ categories, setSelectedCategory }) => {
  const { isLoading } = useGlobal();
  const { store } = useStore()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', 
    borderBottom: store ? `2px solid ${store.primaryColor}` : '2px solid #ff4b4b', paddingBottom: '10px' }}>
      {isLoading ? (
        Array.from(new Array(5)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={100}
            height={40}
            sx={{ margin: '0 10px' }}
          />
        ))
      ) : (
        categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant="contained"
            sx={{
              margin: '0 5px',
              backgroundColor: store ? store.primaryColor : '#d21919',
              color: '#fff',
              '&:hover': {
                backgroundColor: store ? store.primaryColor : '#dd4b4b',
              },
            }}
          >
            {category.name}
          </Button>
        ))
      )}
    </Box>
  );
};

export default NavbarMenu;
