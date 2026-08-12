import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar'; 
import { Loader } from '../components/Loader';
import { Menu } from 'lucide-react'; 

const AdminLayout: React.FC = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="h-screen bg-[#09090B] flex flex-col lg:flex-row text-white font-sans overflow-hidden">
            
            <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-zinc-950 z-40 shrink-0 shadow-md">
                <div className="flex items-center gap-2">
                    <span className="font-black text-lg tracking-wider text-white uppercase">Kathara Admin</span>
                </div>
                <button 
                    onClick={() => setMenuAbierto(true)}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            <AdminSidebar 
                menuAbierto={menuAbierto} 
                cerrarMenu={() => setMenuAbierto(false)} 
            />

            {/* 🔥 ACÁ ESTABA EL PROBLEMA: Agregamos overflow-x-hidden */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide lg:ml-64">
                <Loader tipoLayout="admin" />
                
                {/* 🔥 Y acá cambiamos w-[800px] por w-full max-w-[800px] */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-orange-500/5 blur-[150px] pointer-events-none rounded-full"></div>
                
                <div className="p-4 sm:p-8 relative z-10">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;