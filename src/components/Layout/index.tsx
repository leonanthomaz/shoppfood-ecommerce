import { ReactNode } from 'react';
import NavbarFlex from '../NavbarFooter';
import { LayoutContainer, MainContent } from './LayoutStyles';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
    <LayoutContainer>
        <MainContent>
        {children}
        </MainContent>
        <NavbarFlex/>
    </LayoutContainer>
  )
}

export default Layout