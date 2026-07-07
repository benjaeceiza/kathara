import React from 'react';
import { HeroSection } from './HeroSection';
import { BentoCards } from './BentoCards';
import StaffSection from './StaffSection';
import ReviewsSection from './ReviewsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
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