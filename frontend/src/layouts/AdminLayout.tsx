import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar'; 
import { Loader } from '../components/Loader';

const AdminLayout: React.FC = () => {
    return (
        <div className="h-screen bg-[#09090B] flex text-white font-sans overflow-hidden">
            
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                {/* 🔥 LE PASAMOS LA ORDEN DE QUE ESQUIVE EL MENÚ DE ADMIN */}
                <Loader tipoLayout="admin" />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-500/5 blur-[150px] pointer-events-none rounded-full"></div>
                <div className="p-4 sm:p-8 relative z-10">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;