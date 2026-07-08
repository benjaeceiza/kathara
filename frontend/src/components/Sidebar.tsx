
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Home, Calendar, Scissors, User, LogOut, X, History } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

interface SidebarProps {
  alCerrarSesion: () => void;
  menuAbierto: boolean;
  cerrarMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ alCerrarSesion, menuAbierto, cerrarMenu }) => {
  const usuario = useAuthStore((state) => state.usuario);
  const estaLogueado = useAuthStore((state) => state.estaLogueado);
  const navigate = useNavigate();
  
  // 🔥 2. LEEMOS LA URL ACTUAL EN TIEMPO REAL
  const location = useLocation();

  const handleLogout = () => {
    alCerrarSesion();
    cerrarMenu();
    navigate('/');
  };

  // 🔥 3. FUNCIÓN HELPER: Decide si el link está activo según la URL
  const esActivo = (ruta: string) => {
    if (ruta === '/') {
      return location.pathname === '/'; // Solo da true si estás exactamente en el Home
    }
    return location.pathname.startsWith(ruta); // Para /mis-turnos, /perfil, /reservar, etc.
  };

  // 🔥 4. FUNCIÓN QUE ARMA LAS CLASES DE ESTILO DINÁMICAMENTE
  const getClasesLink = (ruta: string) => {
    const activo = esActivo(ruta);
    return `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
      activo 
        ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-orange-400 font-bold border-l-2 border-orange-500 shadow-sm' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-white font-medium'
    }`;
  };

  const getClasesIcono = (ruta: string) => {
    const activo = esActivo(ruta);
    return `w-5 h-5 shrink-0 transition-colors ${
      activo ? 'text-orange-400' : 'text-zinc-500 group-hover:text-orange-400'
    }`;
  };

  return (
    <>
      {/* Backdrop Oscuro en Celular */}
      {menuAbierto && (
        <div 
          onClick={cerrarMenu} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`fixed top-0 left-0 h-screen z-50 w-72 lg:w-64 border-r border-white/10 bg-zinc-900/95 lg:bg-zinc-900/40 backdrop-blur-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${
        menuAbierto ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Branding Superior */}
          <div className="flex items-center justify-between mb-10 px-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center  shadow-lg shadow-white/5 shrink-0">
                <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white uppercase block leading-none">Kathara</span>
                <span className="text-[9px] text-orange-400 font-bold tracking-widest uppercase block mt-0.5">Barber Studio</span>
              </div>
            </div>

            <button 
              onClick={cerrarMenu}
              className="p-2 rounded-xl text-zinc-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* NAVEGACIÓN 100% DINÁMICA                                  */}
          {/* ========================================================= */}
          <nav className="space-y-2">
            
            {/* 1. RUTAS PÚBLICAS */}
            <Link to="/" onClick={cerrarMenu} className={getClasesLink('/')}>
              <Home className={getClasesIcono('/')} />
              <span className="text-sm">Inicio</span>
            </Link>
            
            <Link to="/reservar" onClick={cerrarMenu} className={getClasesLink('/reservar')}>
              <Calendar className={getClasesIcono('/reservar')} />
              <span className="text-sm">Reservar Turno</span>
            </Link>

            <a href="/servicios" onClick={cerrarMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white font-medium transition-all group">
              <Scissors className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-orange-400 transition-colors" />
              <span className="text-sm">Servicios & Staff</span>
            </a>

            {/* 2. RUTAS PRIVADAS (Solo si inició sesión) */}
            {estaLogueado && (
              <>
                <Link to="/mis-turnos" onClick={cerrarMenu} className={`${getClasesLink('/mis-turnos')} animate-fadeIn`}>
                  <History className={getClasesIcono('/mis-turnos')} />
                  <span className="text-sm">Mis Turnos</span>
                </Link>
                
                <Link to="/perfil" onClick={cerrarMenu} className={`${getClasesLink('/perfil')} animate-fadeIn`}>
                  <User className={getClasesIcono('/perfil')} />
                  <span className="text-sm">Mi Perfil</span>
                </Link>
              </>
            )}

          </nav>
        </div>

        {/* ========================================================= */}
        {/* PARTE INFERIOR: PERFIL O BOTÓN DE LOGIN                   */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-white/10 px-1">
          {estaLogueado ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0">
                  {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{usuario?.nombre || 'Cliente'}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{usuario?.rol || 'VIP'}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={cerrarMenu}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>⚡ Iniciar Sesión</span>
            </Link>
          )}
        </div>

      </aside>
    </>
  );
};