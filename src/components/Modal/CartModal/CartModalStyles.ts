// src/components/ReusableModal/ModalStyles.ts
export const ModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Fundo escurecido
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#333',
      color: '#f5f5f5',
      borderRadius: '10px',
      padding: '10px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh', // Define uma altura máxima para o modal
      overflowY: 'auto', // Adiciona barra de rolagem vertical se necessário
    },
  };
  