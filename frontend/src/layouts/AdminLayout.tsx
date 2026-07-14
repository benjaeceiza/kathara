import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar'; // Importamos tu nuevo componente

const AdminLayout: React.FC = () => {
    return (
        // 🔥 EL BUG FIX ESTÁ ACÁ: Cambiamos 'min-h-screen' por 'h-screen'
        <div className="h-screen bg-[#09090B] flex text-white font-sans overflow-hidden">
            
            {/* INYECTAMOS EL COMPONENTE SEPARADO */}
            <AdminSidebar />

            {/* ÁREA CENTRAL DE CONTENIDO */}
            {/* El 'overflow-y-auto' acá es lo que permite que el centro haga scroll, pero la barra lateral NO */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-500/5 blur-[150px] pointer-events-none rounded-full"></div>
                <div className="p-4 sm:p-8 relative z-10">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;