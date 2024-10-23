import React from 'react';
import { HeaderContainer } from './HeaderStyles';
import { useStore } from '../../contexts/StoreContext'; // Certifique-se de ajustar o caminho conforme necessário

const Header: React.FC = () => {
  const { headerImageUrl } = useStore();

  return (
    <HeaderContainer style={{ backgroundImage: `url(${headerImageUrl ?? ''})` }} />
  );
};

export default Header;
