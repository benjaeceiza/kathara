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
      {menuAbierto && (
        <div 
          onClick={cerrarMenu} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
        />
      )}

      {/* 🔥 Cambiamos h-screen por h-[100dvh] y sacamos justify-between */}
      <aside className={`fixed top-0 left-0 h-[100dvh] z-50 w-72 lg:w-64 border-r border-white/10 bg-zinc-900/95 lg:bg-zinc-900/40 backdrop-blur-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out ${
        menuAbierto ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* 🔥 PARTE SUPERIOR FIJA */}
        <div className="flex items-center justify-between mb-6 px-1 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/5 shrink-0">
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

        {/* 🔥 PARTE CENTRAL SCROLLEABLE */}
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

            {estaLogueado && usuario?.rol === 'admin' && (
              <div className="mt-6 border-t border-white/5 pt-6">
                <Link 
                  to="/admin" 
                  onClick={cerrarMenu}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-black transition-all font-black uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-fadeIn"
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="text-[11px]">Panel Admin</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* 🔥 PARTE INFERIOR FIJA */}
        <div className="pt-4 mt-2 border-t border-white/10 px-1 shrink-0">
          {estaLogueado ? (
            <Link 
              to="/perfil"
              onClick={cerrarMenu}
              className="flex items-center justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
              title="Ir a mis ajustes"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0 overflow-hidden">
                  {usuario?.avatar ? (
                    <img src={usuario.avatar} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                    {usuario?.nombre || 'Cliente'}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {usuario?.rol || 'VIP'}
                  </p>
                </div>
              </div>
              
              <Settings className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
            </Link>
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