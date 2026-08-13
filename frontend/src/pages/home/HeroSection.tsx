import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, Clock, Coffee, MapPin } from 'lucide-react';
import { getApariencia } from '../../services/apariencia.service'; 
// 🔥 ELIMINAMOS EL IMPORT DE heroImg

export const HeroSection: React.FC = () => {
    const [fondoPersonalizado, setFondoPersonalizado] = useState<string>('');

    useEffect(() => {
        const cargarApariencia = async () => {
            try {
                const data = await getApariencia();
                if (data.fondoHero) {
                    setFondoPersonalizado(data.fondoHero);
                }
            } catch (error) {
                console.error("Error al cargar la apariencia del hero:", error);
            }
        };
        cargarApariencia();
    }, []);

    return (
        <section
            // 🔥 LÓGICA MÁGICA: Si hay fondo lo pone en el style, si no, lo deja vacío
            style={fondoPersonalizado ? { backgroundImage: `url(${fondoPersonalizado})` } : {}}
            // 🔥 COLOR FIJO DE RESPALDO: Le agregamos bg-zinc-200 dark:bg-zinc-900 al final por si no hay foto
            className="relative w-full min-h-[82vh] rounded-[2.5rem] overflow-hidden p-8 sm:p-14 lg:p-16 flex flex-col justify-between border border-zinc-200/50 dark:border-white/10 shadow-2xl bg-cover bg-center bg-no-repeat transition-all duration-700 bg-zinc-200 dark:bg-zinc-900"
        >

            {/* LUCES Y CORTINAS DINÁMICAS */}
            <div className="absolute inset-0 bg-white/5 dark:bg-zinc-950/20 pointer-events-none transition-colors duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent dark:from-zinc-950 dark:via-zinc-950/70 transition-colors duration-700 pointer-events-none"></div>
            
            {/* HEADER DEL HERO */}
            <div className="flex flex-wrap gap-4 justify-between items-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white shadow-sm transition-all duration-700">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                    <span>ESTILO & PRECISIÓN DE AUTOR</span>
                </div>

                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-sm transition-all shadow-xl cursor-pointer group">
                    <span>Reservar Ahora</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* TEXTO CENTRAL */}
            <div className="max-w-3xl my-auto z-10 py-10 drop-shadow-sm">
                <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-400 font-bold tracking-widest uppercase mb-4 transition-colors duration-700">
                    La evolución del cuidado personal
                </p>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-white leading-[0.92] mb-6 transition-colors duration-700">
                    Kathara <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 dark:from-white dark:via-zinc-400 dark:to-white">
                        Studio.
                    </span>
                </h1>
                <p className="text-zinc-800 dark:text-zinc-300 text-base sm:text-lg max-w-xl font-medium leading-relaxed transition-colors duration-700">
                    Cortes visagistas, perfilado de barba con navaja y un ritual de relajación diseñado exclusivamente para vos.
                </p>
            </div>

            {/* BARRA INFERIOR DE VENTAJAS */}
            <div className="pt-8 border-t border-zinc-200/50 dark:border-white/10 flex flex-wrap gap-6 sm:gap-10 justify-between items-center z-10 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-400 transition-colors duration-700">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold transition-colors duration-700">
                    <Star className="w-4 h-4 text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white transition-colors duration-700" />
                    <span>4.9</span>
                    <span className="text-zinc-500 font-normal">(+500 Reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-900 dark:text-white transition-colors duration-700" />
                    <span>Atención puntual sin esperas</span>
                </div>

                <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-zinc-900 dark:text-white transition-colors duration-700" />
                    <span>Café & Bebida de cortesía</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-900 dark:text-white transition-colors duration-700" />
                    <span>Villa Mercedes, San Luis</span>
                </div>
            </div>
        </section>
    );
};