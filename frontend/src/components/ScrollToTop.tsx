import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // A) Sube el scroll general del navegador
    window.scrollTo(0, 0);
    
    // B) Sube el scroll interno de nuestro panel Admin
    const adminMain = document.querySelector('main');
    if (adminMain) {
      adminMain.scrollTo(0, 0);
    }
  }, [pathname]);

  // Este componente no renderiza nada visualmente, solo ejecuta la lógica
  return null; 
};