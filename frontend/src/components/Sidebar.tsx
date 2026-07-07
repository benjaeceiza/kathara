
import { Home, Calendar, Scissors, User, LogOut, X } from 'lucide-react';
import logo from "../assets/logo.png";
import { useAuthStore } from '../store/authStore';

interface SidebarProps {
    alCerrarSesion: () => void;
    menuAbierto: boolean;
    cerrarMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ alCerrarSesion, menuAbierto, cerrarMenu }) => {
    const usuario = useAuthStore((state) => state.usuario);


    return (
        <>
            {/* 1. BACKDROP OSCURO EN CELULAR: Si el menú está abierto, oscurece el fondo y al tocarlo se cierra */}
            {menuAbierto && (
                <div
                    onClick={cerrarMenu}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
                />
            )}

            {/* 2. EL SIDEBAR: En PC es fijo (translate-x-0). En celular se esconde a la izquierda (-translate-x-full) hasta que abren el menú */}
            <aside className={`fixed top-0 left-0 h-screen z-50 w-72 lg:w-64 border-r border-white/10 bg-zinc-900/95 lg:bg-zinc-900/40 backdrop-blur-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${menuAbierto ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div>
                    {/* Cabecera del Sidebar con Logo y Botón Cerrar (Solo visible en Celular) */}
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

                        {/* Botón X para cerrar en celular */}
                        <button
                            onClick={cerrarMenu}
                            className="p-2 rounded-xl text-zinc-400 hover:text-white lg:hidden cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Menú de Navegación (Al tocar un link en celular, cerramos el menú) */}
                    <nav className="space-y-2">
                        <a href="#" onClick={cerrarMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-transparent text-orange-400 font-bold border-l-2 border-orange-500 transition-all">
                            <Home className="w-5 h-5 shrink-0" />
                            <span className="text-sm">Inicio</span>
                        </a>

                        <a href="#" onClick={cerrarMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white font-medium transition-all group">
                            <Calendar className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                            <span className="text-sm">Reservar Turno</span>
                        </a>

                        <a href="#" onClick={cerrarMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white font-medium transition-all group">
                            <Scissors className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                            <span className="text-sm">Servicios & Staff</span>
                        </a>

                        <a href="#" onClick={cerrarMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white font-medium transition-all group">
                            <User className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                            <span className="text-sm">Mi Perfil</span>
                        </a>
                    </nav>
                </div>

                {/* Perfil Abajo & Botón Salir */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-3 overflow-hidden">

                        {/* 1. Le ponemos usuario?.nombre */}
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0">
                            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {/* 2. Le ponemos usuario?.nombre y usuario?.rol */}
                        <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{usuario?.nombre || 'Cliente'}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{usuario?.rol || 'VIP'}</p>
                        </div>

                    </div>

                    <button
                        onClick={alCerrarSesion}
                        title="Cerrar Sesión"
                        className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>
        </>
    );
};