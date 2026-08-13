import React from 'react';

export const WizardSkeleton: React.FC = () => {
    return (
        // Contenedor principal restringido a la altura de la pantalla
        <div className="flex flex-col h-[calc(100dvh-6rem)] lg:h-[calc(100vh-8rem)] max-w-3xl mx-auto w-full animate-pulse">
            
            {/* HEADER FIJO */}
            <div className="shrink-0 mb-6">
                <div className="h-8 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl mb-6"></div>
                <div className="h-10 w-64 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-2xl mb-8"></div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-2 flex-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50"></div>
                    ))}
                </div>
            </div>

            {/* BODY SCROLLEABLE (Simulamos la lista de servicios) */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col gap-4">
                    <div className="h-8 w-48 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl mb-2"></div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-24 rounded-2xl bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm shrink-0 flex justify-between items-center p-5">
                            <div className="space-y-3">
                                <div className="h-5 w-40 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                                <div className="h-4 w-20 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-lg"></div>
                            </div>
                            <div className="h-8 w-24 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER FIJO */}
            <div className="shrink-0 mt-6 border-t border-zinc-200/50 dark:border-white/10 pt-6 flex justify-between items-center">
                <div className="h-10 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                <div className="h-8 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
            </div>
        </div>
    );
};