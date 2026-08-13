import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { BentoCards } from './BentoCards';
import StaffSection from './StaffSection';
import ReviewsSection from './ReviewsSection';
import { HomeSkeleton } from '../../components/skeletons/HomeSkeleton'; 

export const HomePage: React.FC = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 🔥 Le damos 1.5 segundos de gracia a la página para que 
    // descargue las fotos y los datos del staff en segundo plano.
    const timer = setTimeout(() => {
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mientras está cargando, mostramos los cristales
  if (cargando) {
    return <HomeSkeleton />;
  }

  return (
    // Le agregamos 'animate-fadeIn' para que cuando desaparezca el skeleton, 
    // la página real entre con un difuminado re suave.
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. La portada monumental */}
      <HeroSection />

      {/* 2. Las tres tarjetas de acceso rápido */}
      <BentoCards />

      {/* 3. Nuestro Staff de barberos */}
      <StaffSection />

      {/* 4. Reseñas y testimonios de clientes */}
      <ReviewsSection />

    </div>
  );
};