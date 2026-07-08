import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // 1. IMPORTAMOS OUTLET ACÁ
import { Sidebar } from '../components/Sidebar';
import  Footer  from '../components/Footer';
import { Menu } from 'lucide-react';
import logo from '../assets/logo.png';

interface AppLayoutProps {
  alCerrarSesion: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ alCerrarSesion }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col font-sans w-full overflow-x-hidden">
      
      {/* Header Móvil */}
      <header className="lg:hidden sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center  shrink-0">
            <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-base tracking-wider text-white uppercase block leading-none">Kathara</span>
        </div>
        <button onClick={() => setMenuAbierto(true)} className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-orange-400 hover:bg-zinc-800 transition-all cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar y Contenido Principal */}
      <div className="flex flex-1 w-full">
        <Sidebar alCerrarSesion={alCerrarSesion} menuAbierto={menuAbierto} cerrarMenu={() => setMenuAbierto(false)} />

        <main className="flex-1 w-full lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto flex flex-col justify-between min-h-screen">
          <div className="space-y-12">
            
            {/* 🔥 ACÁ ESTABA EL ERROR: Reemplazamos <HomePage /> por <Outlet /> */}
            <Outlet />

          </div>
          <Footer />
        </main>
      </div>

    </div>
  );
};

export default AppLayout;