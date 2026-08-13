import { Link, useLocation } from 'react-router-dom'; 
import { Home, Calendar, Scissors, X, History, LayoutDashboard, Settings } from 'lucide-react'; 
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

interface SidebarProps {
  menuAbierto: boolean;
  cerrarMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ menuAbierto, cerrarMenu }) => {
  const usuario = useAuthStore((state) => state.usuario);
  const estaLogueado = useAuthStore((state) => state.estaLogueado);
  const location = useLocation();

  const esActivo = (ruta: string) => {
    if (ruta === '/') {
      return location.pathname === '/'; 
    }
    return location.pathname.startsWith(ruta); 
  };

  // 🔥 LÓGICA MONOCROMÁTICA PARA LOS LINKS
  const getClasesLink = (ruta: string) => {
    const activo = esActivo(ruta);
    return `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
      activo 
        ? 'bg-white/90 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-bold shadow-md border border-zinc-200/50 dark:border-white/10' 
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white font-medium'
    }`;
  };

  // 🔥 LÓGICA MONOCROMÁTICA PARA LOS ÍCONOS
  const getClasesIcono = (ruta: string) => {
    const activo = esActivo(ruta);
    return `w-5 h-5 shrink-0 transition-colors ${
      activo 
        ? 'text-zinc-900 dark:text-white' 
        : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
    }`;
  };

  return (
    <>
      {/* Fondo oscuro cuando se abre en celulares */}
      {menuAbierto && (
        <div 
          onClick={cerrarMenu} 
          className="fixed inset-0 bg-zinc-900/40 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn transition-colors duration-700"
        />
      )}

      {/* 🔥 CONTENEDOR PRINCIPAL GLASSMORPHISM */}
      <aside className={`fixed top-0 left-0 h-[100dvh] z-50 w-72 lg:w-64 border-r border-zinc-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl flex flex-col p-6 transition-all duration-500 ease-in-out ${
        menuAbierto ? 'translate-x-0 shadow-2xl shadow-black/20 dark:shadow-black' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* PARTE SUPERIOR FIJA */}
        <div className="flex items-center justify-between mb-6 px-1 shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo de alto contraste */}
            <div className="w-11 h-11 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-white/5 shrink-0 transition-colors duration-700">
              <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain dark:invert" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-zinc-900 dark:text-white uppercase block leading-none transition-colors duration-700">Kathara</span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase block mt-0.5 transition-colors duration-700">Barber Studio</span>
            </div>
          </div>

          <button 
            onClick={cerrarMenu}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white lg:hidden cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PARTE CENTRAL SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2 pb-4">
          <nav className="space-y-2">
            <Link to="/" onClick={cerrarMenu} className={getClasesLink('/')}>
              <Home className={getClasesIcono('/')} />
              <span className="text-sm">Inicio</span>
            </Link>
            
            <Link to="/reservar" onClick={cerrarMenu} className={getClasesLink('/reservar')}>
              <Calendar className={getClasesIcono('/reservar')} />
              <span className="text-sm">Reservar Turno</span>
            </Link>

            <Link to="/servicios" onClick={cerrarMenu} className={getClasesLink('/servicios')}>
              <Scissors className={getClasesIcono('/servicios')} />
              <span className="text-sm">Servicios & Staff</span>
            </Link>

            {estaLogueado && (
              <>
                <Link to="/mis-turnos" onClick={cerrarMenu} className={`${getClasesLink('/mis-turnos')} animate-fadeIn`}>
                  <History className={getClasesIcono('/mis-turnos')} />
                  <span className="text-sm">Mis Turnos</span>
                </Link>
              </>
            )}

            {/* 🔥 BOTÓN ADMIN - ALTO CONTRASTE INVERTIDO */}
            {estaLogueado && usuario?.rol === 'admin' && (
              <div className="mt-6 border-t border-zinc-200/50 dark:border-white/5 pt-6 transition-colors duration-700">
                <Link 
                  to="/admin" 
                  onClick={cerrarMenu}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-black uppercase tracking-widest shadow-xl animate-fadeIn"
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="text-[11px]">Panel Admin</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* PARTE INFERIOR FIJA */}
        <div className="pt-4 mt-2 border-t border-zinc-200/50 dark:border-white/10 px-1 shrink-0 transition-colors duration-700">
          {estaLogueado ? (
            <Link 
              to="/perfil"
              onClick={cerrarMenu}
              className="flex items-center justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer group"
              title="Ir a mis ajustes"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-900 dark:text-white shrink-0 overflow-hidden transition-colors duration-700">
                  {usuario?.avatar ? (
                    <img src={usuario.avatar} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {usuario?.nombre || 'Cliente'}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {usuario?.rol || 'VIP'}
                  </p>
                </div>
              </div>
              
              <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>
          ) : (
            /* 🔥 BOTÓN LOGIN - ALTO CONTRASTE INVERTIDO */
            <Link 
              to="/login" 
              onClick={cerrarMenu}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>⚡ Iniciar Sesión</span>
            </Link>
          )}
        </div>

      </aside>
    </>
  );
};