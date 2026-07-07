import React from 'react';
import { Scissors, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const BentoCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Tarjeta 1: Corte */}
      <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-orange-500/40 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
          <Scissors className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Corte & Estilo</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Asesoramiento estético personalizado según tu tipo de rostro y degradés milimétricos.</p>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-orange-400 font-bold text-sm group-hover:gap-3 transition-all">
          <span>Ver catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Tarjeta 2: Barba */}
      <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md flex flex-col justify-between h-[320px] relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Barba & Ritual</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Toalla caliente, aceites esenciales, vapor y perfilado tradicional con navaja.</p>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm group-hover:gap-3 transition-all">
          <span>Conocer ritual</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Tarjeta 3: Call to Action */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 p-8 rounded-[2rem] flex flex-col justify-between h-[320px] text-black relative overflow-hidden shadow-xl shadow-orange-950/40">
        <div className="flex justify-between items-start">
          <span className="px-3.5 py-1.5 bg-black/90 text-white text-xs font-extrabold rounded-full tracking-wider uppercase">
            VIP Member
          </span>
          <Sparkles className="w-6 h-6 text-black/60" />
        </div>
        <div>
          <h3 className="text-3xl font-black mb-2 text-white leading-tight">¿Listo para tu cambio?</h3>
          <p className="text-black/80 font-semibold text-sm">Asegurá tu turno en menos de 1 minuto y bloqueá tu horario.</p>
        </div>
        <button className="w-full py-4 bg-zinc-950 hover:bg-black text-white rounded-2xl font-black text-center text-sm uppercase tracking-widest transition-all shadow-lg cursor-pointer">
          Reservar Ahora
        </button>
      </div>

    </section>
  );
};