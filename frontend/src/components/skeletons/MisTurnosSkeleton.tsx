import React from 'react';

export const MisTurnosSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 sm:space-y-10 pb-16 max-w-5xl mx-auto animate-pulse px-4 sm:px-0 pt-8">
            
            {/* 🦴 CABECERA SKELETON */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/50 dark:border-white/10 pb-6">
                <div className="space-y-3 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-48 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-2xl"></div>
                        <div className="h-6 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                    </div>
                    <div className="h-4 w-64 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                </div>
            </div>

            {/* 🦴 TURNOS ACTIVOS SKELETON */}
            <section className="space-y-4">
                <div className="h-4 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                <div className="h-32 w-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col lg:flex-row justify-between gap-5">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-xl shrink-0"></div>
                        <div className="space-y-2 w-full">
                            <div className="h-6 w-40 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                            <div className="h-4 w-32 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                        <div className="h-8 w-20 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                        <div className="h-10 w-full sm:w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-lg mt-4 lg:mt-0"></div>
                    </div>
                </div>
            </section>

            {/* 🦴 HISTORIAL SKELETON */}
            <section className="space-y-4 pt-6">
                <div className="h-4 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                {[1, 2].map(i => (
                    <div key={i} className="h-24 w-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-2xl p-4 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-xl shrink-0"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-md"></div>
                                <div className="h-3 w-48 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                            </div>
                        </div>
                        <div className="h-8 w-16 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-lg"></div>
                    </div>
                ))}
            </section>
        </div>
    );
};