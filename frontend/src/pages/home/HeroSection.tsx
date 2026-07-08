
import { Sparkles, ArrowRight, Star, Clock, Coffee, MapPin } from 'lucide-react';
import heroImg from "../../assets/hero.png";

export const HeroSection: React.FC = () => {
    return (
        <section
            style={{ backgroundImage: `url(${heroImg})` }}
            className="relative w-full min-h-[82vh] rounded-[2.5rem] overflow-hidden p-8 sm:p-14 lg:p-16 flex flex-col justify-between border border-white/10 shadow-2xl bg-cover bg-center bg-no-repeat">

            {/* Luces de fondo difuminadas (Ambient Glows) */}
            <div className="absolute  bg-zinc-600/20  pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent pointer-events-none"></div>
            {/* Header del Hero */}
            <div className="flex flex-wrap gap-4 justify-between items-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-orange-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ESTILO & PRECISIÓN DE AUTOR</span>
                </div>

                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-extrabold text-sm transition-all shadow-xl cursor-pointer group">
                    <span>Reservar Ahora</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Texto Central */}
            <div className="max-w-3xl my-auto z-10 py-10">
                <p className="text-sm sm:text-base text-zinc-400 font-semibold tracking-widest uppercase mb-4">
                    La evolución del cuidado personal
                </p>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.92] mb-6">
                    Kathara <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-white">
                        Barber Studio.
                    </span>
                </h1>
                <p className="text-zinc-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                    Cortes visagistas, perfilado de barba con navaja y un ritual de relajación diseñado exclusivamente para vos.
                </p>
            </div>

            {/* Barra inferior de estadísticas / ventajas */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap gap-6 sm:gap-10 justify-between items-center z-10 text-xs sm:text-sm font-medium text-zinc-400">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span>4.9</span>
                    <span className="text-zinc-500 font-normal">(+500 Reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Atención puntual sin esperas</span>
                </div>

                <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <span>Café & Bebida de cortesía</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Villa Mercedes, San Luis</span>
                </div>
            </div>
        </section >
    );
};