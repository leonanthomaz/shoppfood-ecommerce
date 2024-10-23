import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faUtensils, faEnvelope, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavbarContainer, Logo, NavLinks, Hamburger, CloseIconWrapper, FooterContainer, SeparatorLine } from './NavbarStyles';
import logo from '@/assets/imgs/logo-rf-w.png';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Adicionei a função de logout
  const { store, logoImageUrl } = useStore();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <NavbarContainer style={{ backgroundColor: store?.primaryColor}}>
      
      <Link to="/">
        <Logo>
          <img src={logoImageUrl ? logoImageUrl : logo } alt="Logo" />
        </Logo>
      </Link>
      <NavLinks open={isOpen} style={{ backgroundColor: store?.primaryColor}}>
        <CloseIconWrapper onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseIconWrapper>
        <Box 
        display='flex' 
        flexDirection={ isSmallScreen ? 'column' : 'row'}
        >
          <Link to="/" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '4px' }} /> INÍCIO
          </Link>
          <Link to="/menu" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faUtensils} style={{ marginRight: '4px' }} /> CARDÁPIO
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '4px' }} /> CONTATO
          </Link>
        
        {isAuthenticated ? (
          <>
          <Link to="/profile">
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '4px' }} /> MINHA ÁREA
          </Link>
          <Link to="/" onClick={() => { logout(); toggleMenu(); }}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '4px' }} /> LOGOUT
          </Link>
          </>
        ) : (
          <Link to="/login" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '4px' }} /> LOGIN
          </Link>
        )}
        </Box>
        {isOpen && (
          <FooterContainer>
            <SeparatorLine />
            <p>Desenvolvido por:</p>
            <img src={logo} alt="Logo da Empresa" />
          </FooterContainer>
        )}
      </NavLinks>
      
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <Hamburger onClick={toggleMenu}>
          {isOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </Hamburger>
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;
