import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scissors, 
  User, 
  Clock, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

import imgGonza from "../../assets/gonza.png";
import imgValen from "../../assets/valen.png";

// 1. TIPADOS DE DATOS (INTERFACES)
interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  precio: number;
  destacado?: boolean;
}

interface Barbero {
  id: string;
  nombre: string;
  apodo: string;
  rol: string;
  avatar: string;
  bio: string;
  especialidades: string[];
}

 const ServiciosStaffPage: React.FC = () => {
  // 2. CATÁLOGO DE SERVICIOS KATHARA
  const servicios: Servicio[] = [
    {
      id: "SRV-1",
      nombre: "Skin Fade + Perfilado de Barba",
      descripcion: "Degradado perfecto a cero con máquina y navaja, diseño de contornos faciales y ritual con toalla caliente y aceites esenciales.",
      duracion: "50 min",
      precio: 12000,
      destacado: true
    },
    {
      id: "SRV-2",
      nombre: "Corte Clásico & Texturizado a Tijera",
      descripcion: "Corte de autor adaptado a la forma de tu cráneo y tipo de cabello. Incluye lavado premium con shampoo mentolado y peinado con cera mate.",
      duracion: "40 min",
      precio: 10000
    },
    {
      id: "SRV-3",
      nombre: "Ritual de Barba Tradicional",
      descripcion: "El clásico afeitado italiano. Vapor de ozono para abrir poros, espuma templada, navaja libre y masaje facial post-afeitado.",
      duracion: "35 min",
      precio: 8500
    },
    {
      id: "SRV-4",
      nombre: "Taper Fade & Freestyle Design",
      descripcion: "Degradado en patillas y nuca con líneas o diseños geométricos personalizados en los laterales. Ideal para un look urbano.",
      duracion: "45 min",
      precio: 11000
    }
  ];

  // 3. STAFF DE MAESTROS BARBEROS
  const staff: Barbero[] = [
    {
      id: "ST-1",
      nombre: "Gonza Silvani",
      apodo: "Negro",
      rol: "Director & Master Barber",
      avatar: imgGonza,
      bio: "Fundador de Kathara. Con más de 8 años en la industria, Mateo se especializa en cortes milimétricos y el rescate del afeitado clásico a navaja.",
      especialidades: ["Skin Fade", "Barba Tradicional", "Tijera Avanzada"]
    },
    {
      id: "ST-2",
      nombre: "Valentino Brayn",
      apodo: "Fade",
      rol: "Urban Style Specialist",
      avatar: imgValen,
      bio: "El rey del degradado y los peinados con textura. Lucas transforma cualquier cabello rebelde en una obra de arte moderna y fácil de peinar.",
      especialidades: ["Taper Fade", "Texturizado", "Diseños Freestyle"]
    }
  ];

  return (
    <div className="space-y-20 pb-24 max-w-6xl mx-auto animate-fadeIn">
      
      {/* ========================================================= */}
      {/* HERO / ENCABEZADO PRINCIPAL                               */}
      {/* ========================================================= */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-extrabold text-orange-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experiencia Kathara</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Servicios & Staff.
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Conocé nuestros servicios de cuidado personal diseñados para tu desconexión, y a los artesanos barberos encargados de elevar tu estilo al máximo nivel.
        </p>
      </div>


      {/* ========================================================= */}
      {/* SECCIÓN 1: CATÁLOGO DE SERVICIOS                          */}
      {/* ========================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Scissors className="w-6 h-6 text-orange-500" />
              <span>Nuestros Servicios</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">Elegí el servicio perfecto y agendá tu turno online en segundos.</p>
          </div>
          <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest">Lista Oficial 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicios.map((s) => (
            <div 
              key={s.id}
              className={`relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                s.destacado 
                  ? 'bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-orange-500/50 shadow-2xl shadow-orange-950/20' 
                  : 'bg-zinc-900/40 border border-white/5 hover:border-white/15'
              }`}
            >
              {/* Etiqueta Más Solicitado */}
              {s.destacado && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-[10px] uppercase tracking-widest shadow-md">
                  🔥 Más Solicitado
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-400 transition-colors">
                    {s.nombre}
                  </h3>
                  <span className="text-xl sm:text-2xl font-black text-white shrink-0 font-mono">
                    ${s.precio}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/80 border border-white/5 text-zinc-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{s.duracion} aprox.</span>
                </div>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {s.descripcion}
                </p>
              </div>

              {/* Botón de Acción Directo al Wizard de Reservas */}
              <div className="pt-8 mt-6 border-t border-white/5">
                <Link 
                  to={`/reservar?servicio=${encodeURIComponent(s.nombre)}`}
                  className={`w-full py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    s.destacado
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:opacity-90 shadow-orange-500/20'
                      : 'bg-zinc-800 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  <span>Solicitar este servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECCIÓN 2: STAFF DE BARBEROS                              */}
      {/* ========================================================= */}
      <section className="space-y-8 pt-8" id="staff">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <User className="w-6 h-6 text-orange-500" />
              <span>Maestros Barberos</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">Hacé clic en cualquier profesional para ver su portafolio de trabajos y biografía.</p>
          </div>
          <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest">Staff Oficial</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {staff.map((b) => (
            <div 
              key={b.id}
              className="group relative rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-orange-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-xl"
            >
              {/* Resplandor hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="space-y-6 relative z-10">
                {/* Foto del Barbero con Anillo Neón */}
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-zinc-800 border border-white/10">
                  <img 
                    src={b.avatar} 
                    alt={b.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="px-3 py-1 rounded-full bg-orange-500/90 text-black font-black text-[10px] uppercase tracking-widest shadow-lg">
                      "{b.apodo}"
                    </span>
                  </div>
                </div>

                {/* Info y Especialidades */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    <span>{b.nombre}</span>
                    <span className="text-xs font-mono font-normal text-zinc-500">#{b.id}</span>
                  </h3>
                  <p className="text-xs font-extrabold text-amber-400/90 uppercase tracking-wider">{b.rol}</p>
                  <p className="text-zinc-400 text-xs line-clamp-2 pt-1 leading-relaxed">{b.bio}</p>
                </div>

                {/* Pastillas de especialidades */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {b.especialidades.map((esp, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-white/5">
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              {/* 🔥 LINK DIRECTO A LA PÁGINA DEL PORTAFOLIO (/staff/:id) */}
              <div className="pt-6 mt-6 border-t border-white/5 relative z-10">
                <Link 
                  to={`/staff/${b.id}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-800/80 group-hover:bg-orange-500 text-zinc-300 group-hover:text-black font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Ver Portafolio</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ServiciosStaffPage;