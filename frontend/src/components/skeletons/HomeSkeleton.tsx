import React from 'react';

export const HomeSkeleton: React.FC = () => {
    return (
        // El animate-pulse hace que todo respire al mismo tiempo
        <div className="w-full space-y-20 animate-pulse">
            
            {/* 🦴 SKELETON DEL HERO */}
            <section className="relative w-full min-h-[82vh] rounded-[2.5rem] bg-zinc-200/30 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-white/5 p-8 sm:p-14 lg:p-16 flex flex-col justify-between overflow-hidden backdrop-blur-sm">
                
                {/* Header del Hero */}
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                    <div className="h-12 w-40 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                </div>
                
                {/* Texto Central */}
                <div className="max-w-3xl my-auto space-y-6 py-10">
                    <div className="h-4 w-64 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                    <div className="h-20 w-3/4 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-3xl"></div>
                    <div className="h-20 w-1/2 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-3xl"></div>
                    <div className="h-4 w-full max-w-md bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full mt-6"></div>
                    <div className="h-4 w-3/4 max-w-sm bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                </div>
                
                {/* Barra Inferior */}
                <div className="pt-8 border-t border-zinc-300/50 dark:border-white/10 flex flex-wrap gap-6 justify-between">
                    <div className="h-5 w-32 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                    <div className="h-5 w-40 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                    <div className="h-5 w-40 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                    <div className="h-5 w-48 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                </div>
            </section>

            {/* 🦴 SKELETON DEL STAFF */}
            <section className="py-6">
                {/* Encabezado Cápsula */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 p-6 sm:p-8 rounded-[2rem]">
                    <div className="space-y-4">
                        <div className="h-8 w-40 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                        <div className="h-12 w-64 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-2xl"></div>
                    </div>
                    <div className="space-y-2 w-full max-w-sm">
                        <div className="h-4 w-full bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                        <div className="h-4 w-3/4 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full float-right"></div>
                    </div>
                </div>
                
                {/* Grilla de Barberos */}
                <div className="flex flex-wrap justify-center gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full max-w-[280px] aspect-square rounded-[2rem] bg-zinc-200/50 dark:bg-zinc-800/40 border border-zinc-300/50 dark:border-white/5 shrink-0 relative overflow-hidden">
                            {/* Detalles de la tarjeta del staff */}
                            <div className="absolute bottom-6 left-6 space-y-3">
                                <div className="h-5 w-20 bg-zinc-300/80 dark:bg-zinc-700/80 rounded-full"></div>
                                <div className="h-6 w-40 bg-zinc-300/80 dark:bg-zinc-700/80 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🦴 SKELETON BENTO CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[320px] rounded-[2rem] bg-zinc-200/30 dark:bg-zinc-900/30 border border-zinc-300/50 dark:border-white/5 p-8 flex flex-col justify-between backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-300/50 dark:bg-zinc-800/80"></div>
                        <div className="space-y-3">
                            <div className="h-8 w-3/4 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-xl"></div>
                            <div className="h-4 w-full bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                            <div className="h-4 w-5/6 bg-zinc-300/50 dark:bg-zinc-800/80 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </section>

        </div>
    );
};