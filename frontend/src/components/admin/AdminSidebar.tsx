import { Link, useLocation } from 'react-router-dom'; 
import { LayoutDashboard, CalendarDays, Scissors, Users, Globe, UserSquare, Briefcase, Settings, X, Palette } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import logo from "../../assets/logo.png";

interface AdminSidebarProps {
  menuAbierto: boolean;
  cerrarMenu: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ menuAbierto, cerrarMenu }) => {
    const location = useLocation();
    const { usuario } = useAuthStore(); 

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Turnos', path: '/admin/turnos', icon: <CalendarDays className="w-5 h-5" /> },
        { name: 'Clientes', path: '/admin/clientes', icon: <UserSquare className="w-5 h-5" /> },
        { name: 'Servicios', path: '/admin/servicios', icon: <Scissors className="w-5 h-5" /> },
        { name: 'Staff', path: '/admin/staff', icon: <Users className="w-5 h-5" /> },
        { name: 'Portafolio', path: '/admin/portafolio', icon: <Briefcase className="w-5 h-5" /> }, 
        { name: 'Apariencia', path: '/admin/apariencia', icon: <Palette className="w-5 h-5" /> }, 
    ];

    return (
        <>
            {menuAbierto && (
                <div 
                    onClick={cerrarMenu} 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
                />
            )}

            {/* 🔥 Cambiamos h-screen por h-[100dvh] y sacamos justify-between */}
            <aside className={`fixed top-0 left-0 h-[100dvh] z-50 w-72 lg:w-64 border-r border-white/10 bg-zinc-950 flex flex-col p-6 transition-transform duration-300 ease-in-out ${
                menuAbierto ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full lg:translate-x-0'
            }`}>
                
                {/* 🔥 PARTE SUPERIOR FIJA: Logo y Marca con Botón X */}
                <div className="flex items-center justify-between mb-6 px-1 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/5 shrink-0">
                            <img src={logo} alt="Kathara" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <span className="font-black text-lg tracking-wider text-white uppercase block leading-none">Kathara</span>
                            <span className="text-[9px] text-orange-400 font-extrabold tracking-widest uppercase block mt-0.5">Admin Panel</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={cerrarMenu}
                        className="p-2 rounded-xl text-zinc-400 hover:text-white lg:hidden cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* 🔥 PARTE CENTRAL SCROLLEABLE: Menú de Navegación */}
                <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2 space-y-6 pb-4">
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={cerrarMenu} 
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-orange-400 font-bold border-l-2 border-orange-500 shadow-sm'
                                            : 'text-zinc-400 hover:bg-white/5 hover:text-white font-medium'
                                    }`}
                                >
                                    <div className={`shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-orange-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-6 border-t border-white/5 pt-6">
                        <Link
                            to="/"
                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold tracking-wide"
                        >
                            <Globe className="w-5 h-5 shrink-0" />
                            Ver sitio web
                        </Link>
                    </div>
                </div>

                {/* 🔥 PARTE INFERIOR FIJA: Perfil de Admin */}
                <div className="pt-4 mt-2 border-t border-white/10 px-1 shrink-0">
                    <Link 
                        to="/admin/perfil"
                        onClick={cerrarMenu}
                        className="flex items-center justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0 overflow-hidden">
                                {usuario?.avatar ? (
                                    <img src={usuario.avatar} alt="Perfil" className="w-full h-full object-cover" />
                                ) : (
                                    usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A'
                                )}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                                    {usuario?.nombre} {usuario?.apellido}
                                </p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                    Administrador
                                </p>
                            </div>
                        </div>
                        <Settings className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                    </Link>
                </div>
            </aside>
        </>
    );
};