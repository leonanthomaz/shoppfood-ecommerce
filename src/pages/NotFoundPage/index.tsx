// src/pages/NotFoundPage/index.tsx
import React from 'react';
import { NotFoundContainer } from './NotFoundPageStyles';

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <h1>Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
