import React from 'react';
import { Scissors, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const BentoCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors duration-700">
      
      {/* Tarjeta 1: Corte (Vidrio) */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 p-8 rounded-[2rem] flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-zinc-900 dark:hover:border-white transition-all shadow-xl duration-500">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 group-hover:scale-110 transition-transform">
          <Scissors className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors duration-700">Corte & Estilo</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-700">Asesoramiento estético personalizado según tu tipo de rostro y degradés milimétricos.</p>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm group-hover:gap-3 transition-all">
          <span>Ver catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Tarjeta 2: Barba (Vidrio) */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 p-8 rounded-[2rem] flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-zinc-900 dark:hover:border-white transition-all shadow-xl duration-500">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors duration-700">Barba & Ritual</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-700">Toalla caliente, aceites esenciales, vapor y perfilado tradicional con navaja.</p>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm group-hover:gap-3 transition-all">
          <span>Conocer ritual</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Tarjeta 3: Call to Action (Sólido Alto Contraste) */}
      <div className="bg-zinc-900 dark:bg-white p-8 rounded-[2rem] flex flex-col justify-between h-[320px] relative overflow-hidden shadow-2xl transition-colors duration-700">
        <div className="flex justify-between items-start">
          <span className="px-3.5 py-1.5 bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold rounded-full tracking-wider uppercase transition-colors duration-700">
            VIP Member
          </span>
          <Sparkles className="w-6 h-6 text-white/50 dark:text-black/50" />
        </div>
        <div>
          <h3 className="text-3xl font-black mb-2 text-white dark:text-zinc-900 leading-tight transition-colors duration-700">¿Listo para tu cambio?</h3>
          <p className="text-zinc-400 dark:text-zinc-600 font-semibold text-sm transition-colors duration-700">Asegurá tu turno en menos de 1 minuto y bloqueá tu horario.</p>
        </div>
        <button className="w-full py-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-2xl font-black text-center text-sm uppercase tracking-widest transition-all shadow-lg cursor-pointer">
          Reservar Ahora
        </button>
      </div>

    </section>
  );
};