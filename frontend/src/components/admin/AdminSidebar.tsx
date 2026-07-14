
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Scissors, Users, LogOut, Globe, UserSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import logo from "../../assets/logo.png";

export const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Turnos', path: '/admin/turnos', icon: <CalendarDays className="w-5 h-5" /> },
        { name: 'Clientes', path: '/admin/clientes', icon: <UserSquare className="w-5 h-5" /> }, // 🔥 NUEVO BOTÓN
        { name: 'Servicios', path: '/admin/servicios', icon: <Scissors className="w-5 h-5" /> },
        { name: 'Staff', path: '/admin/staff', icon: <Users className="w-5 h-5" /> },
    ];

    return (
        // 🔥 Le agregamos h-full para que ocupe todo el alto clavado
        <aside className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col justify-between hidden md:flex h-full z-50 shadow-2xl">
            <div>
                {/* Logo y Marca */}
                <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                        <img src={logo} alt="Kathara" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <span className="font-black text-lg tracking-wider text-white uppercase block leading-none">Kathara</span>
                        <span className="text-[9px] text-orange-400 font-extrabold tracking-widest uppercase">Admin Panel</span>
                    </div>
                </div>

                {/* Menú de Navegación */}
                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold tracking-wide ${isActive
                                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón para volver a la web pública */}
                <div className="px-4 mt-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold tracking-wide"
                    >
                        <Globe className="w-5 h-5" />
                        Ver sitio web
                    </Link>
                </div>
            </div>

            {/* Parte Inferior: Perfil y Logout */}
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0">
                            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">
                                {usuario?.nombre} {usuario?.apellido}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                Administrador
                            </p>
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
            </div>
        </aside>
    );
};