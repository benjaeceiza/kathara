import React from 'react';

export const ServiciosSkeleton: React.FC = () => {
    return (
        <div className="space-y-16 pb-20 max-w-5xl mx-auto animate-pulse px-4 sm:px-6 pt-8">
            
            {/* 🦴 HERO SKELETON */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="h-6 w-32 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full mx-auto"></div>
                <div className="h-12 w-3/4 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-2xl mx-auto"></div>
                <div className="h-4 w-5/6 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full mx-auto mt-4"></div>
                <div className="h-4 w-4/6 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full mx-auto"></div>
            </div>

            {/* 🦴 SERVICIOS SKELETON */}
            <section className="space-y-6">
                <div className="flex justify-between items-end border-b border-zinc-200/50 dark:border-white/10 pb-4">
                    <div className="h-8 w-48 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                    <div className="h-4 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-2xl bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm p-5 flex flex-col justify-between h-[200px]">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-6 w-40 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                                    <div className="h-6 w-16 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                                    <div className="h-3 w-5/6 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                                </div>
                                <div className="h-6 w-20 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-md"></div>
                            </div>
                            <div className="h-10 w-full bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl mt-4"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🦴 STAFF SKELETON */}
            <section className="space-y-6 pt-4">
                <div className="flex justify-between items-end border-b border-zinc-200/50 dark:border-white/10 pb-4">
                    <div className="h-8 w-40 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                    <div className="h-4 w-24 bg-zinc-300/50 dark:bg-zinc-800/50 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-3xl bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm p-5 h-[280px] flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-300/60 dark:bg-zinc-700/60 shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-5 w-3/4 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-md"></div>
                                        <div className="h-3 w-1/2 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                                    <div className="h-3 w-4/5 bg-zinc-300/40 dark:bg-zinc-800/40 rounded-full"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-5 w-16 bg-zinc-300/50 dark:bg-zinc-800/50 rounded"></div>
                                    <div className="h-5 w-20 bg-zinc-300/50 dark:bg-zinc-800/50 rounded"></div>
                                </div>
                            </div>
                            <div className="h-10 w-full bg-zinc-300/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};