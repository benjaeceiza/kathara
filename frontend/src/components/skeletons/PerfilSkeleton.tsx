import React from 'react';

export const PerfilSkeleton: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse pb-12 relative pt-8 px-4 sm:px-0">
            
            {/* 🦴 HEADER SKELETON */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-300/50 dark:bg-zinc-800/50"></div>
                    <div className="h-8 w-56 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                </div>
                <div className="h-4 w-80 max-w-full bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* 🦴 COLUMNA IZQUIERDA SKELETON */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                    {/* Avatar */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-zinc-300/60 dark:bg-zinc-700/60 mb-4"></div>
                        <div className="h-6 w-40 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg mb-3"></div>
                        <div className="h-4 w-20 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                    </div>

                    {/* Métricas */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6">
                        <div className="h-4 w-32 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-full mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-2xl"></div>
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-2xl"></div>
                        </div>
                    </div>

                    {/* Cerrar Sesión */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6">
                        <div className="h-28 w-full bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                    </div>
                </div>

                {/* 🦴 COLUMNA DERECHA SKELETON */}
                <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Datos */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="h-6 w-48 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                            <div className="h-10 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-xl"></div>
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-xl"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-xl"></div>
                            <div className="h-12 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Seguridad (Cerrada) */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 sm:p-8 flex justify-between items-center">
                        <div className="h-6 w-48 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                        <div className="h-5 w-5 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                    </div>

                    {/* Preferencias */}
                    <div className="bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 sm:p-8 flex justify-between items-center">
                        <div className="h-12 w-48 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                        <div className="h-10 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};