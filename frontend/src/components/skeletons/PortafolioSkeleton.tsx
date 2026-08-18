import React from 'react';

export const PortafolioSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen animate-pulse transition-colors duration-700 relative">
            <div className="fixed inset-0 z-0 pointer-events-none bg-zinc-200 dark:bg-zinc-950 transition-colors duration-700"></div>

            <main className="max-w-5xl mx-auto px-6 relative z-10 pt-28 sm:pt-40 pb-24">
                {/* AVATAR SKELETON */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-10">
                    <div className="w-40 h-40 rounded-3xl border-4 border-white/50 dark:border-white/10 bg-zinc-300/80 dark:bg-zinc-700/80 shrink-0 shadow-xl"></div>
                    <div className="text-center sm:text-left pb-3 space-y-3 w-full">
                        <div className="h-10 w-64 mx-auto sm:mx-0 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-xl"></div>
                        <div className="h-4 w-40 mx-auto sm:mx-0 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                    </div>
                </div>

                {/* INFO GRID SKELETON */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="md:col-span-2 space-y-8">
                        <div className="pl-5 border-l-2 border-zinc-300 dark:border-zinc-700 space-y-3">
                            <div className="h-4 w-full bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                            <div className="h-4 w-5/6 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                            <div className="h-4 w-4/6 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                            <div className="h-8 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-28 w-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-3xl"></div>
                        <div className="flex gap-3">
                            <div className="h-14 flex-1 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-2xl"></div>
                            <div className="h-14 flex-1 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-2xl"></div>
                        </div>
                    </div>
                </div>

                {/* GALERÍA SKELETON RESPONSIVE */}
                <div className="mb-8">
                    <div className="h-8 w-64 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-xl mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[350px] md:auto-rows-[200px]">
                        <div className="md:col-span-2 md:row-span-2 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-3xl"></div>
                        <div className="hidden md:block bg-zinc-300/50 dark:bg-zinc-800/50 rounded-3xl"></div>
                        <div className="hidden md:block bg-zinc-300/50 dark:bg-zinc-800/50 rounded-3xl"></div>
                        <div className="hidden md:block bg-zinc-300/50 dark:bg-zinc-800/50 rounded-3xl"></div>
                        <div className="hidden md:block bg-zinc-300/50 dark:bg-zinc-800/50 rounded-3xl"></div>
                    </div>
                </div>

                <div className="mt-24 h-40 w-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 rounded-[2rem]"></div>
            </main>
        </div>
    );
};