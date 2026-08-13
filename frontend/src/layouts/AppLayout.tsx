import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Sidebar } from '../components/Sidebar';
import Footer from '../components/Footer';
import { Menu } from 'lucide-react';
import logo from '../assets/logo.png';
import { Loader } from '../components/Loader'; 
import { getApariencia } from '../services/apariencia.service'; 
import { useThemeStore } from '../store/themeStore'; // 🔥 Importamos el tema global

export const AppLayout: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fondoPersonalizado, setFondoPersonalizado] = useState<string>('');
  
  // 🔥 Leemos el estado del tema
  const { tema } = useThemeStore();

  useEffect(() => {
      const cargarFondo = async () => {
          try {
              const data = await getApariencia();
              if (data.fondoGeneral) {
                  setFondoPersonalizado(data.fondoGeneral);
              }
          } catch (error) {
              console.error("Error al cargar el fondo de la web:", error);
          }
      };
      cargarFondo();
  }, []);

  const esImagen = fondoPersonalizado.startsWith('http');
  
  // 🔥 Si no hay foto, le pone color "Blanco Humo" de día y "Negro" de noche
  const colorFondoPorDefecto = tema === 'dark' ? '#09090B' : '#f4f4f5';

  return (
    <div 
      // 🔥 Le sacamos el 'text-white' clavado. Ahora usa texto oscuro de día y blanco de noche
      className="min-h-screen text-zinc-900 dark:text-white flex flex-col font-sans w-full overflow-x-hidden relative transition-colors duration-700"
      style={{
        background: esImagen ? `url(${fondoPersonalizado}) center/cover fixed` : fondoPersonalizado || colorFondoPorDefecto
      }}
    >
      {esImagen && <div className="fixed inset-0 bg-white/20 dark:bg-black/60 pointer-events-none z-0 transition-colors duration-700"></div>}

      <div className="relative z-10 flex flex-col flex-1 w-full">
        {/* HEADER MOBILE: También lo hacemos doble cara (Blanco de día, Oscuro de noche) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 px-4 py-3 flex items-center justify-between transition-colors duration-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0">
              <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-base tracking-wider text-zinc-900 dark:text-white uppercase block leading-none">Kathara</span>
          </div>
          <button onClick={() => setMenuAbierto(true)} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-orange-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex flex-1 w-full">
          <Sidebar menuAbierto={menuAbierto} cerrarMenu={() => setMenuAbierto(false)} />

          <main className="flex-1 w-full lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto flex flex-col justify-between min-h-screen relative">
            
            <Loader tipoLayout="cliente" />

            <div className="space-y-12">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;