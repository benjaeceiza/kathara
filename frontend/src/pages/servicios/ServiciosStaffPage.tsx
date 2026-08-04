import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scissors, 
  User, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Star
} from 'lucide-react';

import { getServicios } from '../../services/servicios.service';
import { getStaff } from '../../services/staff.service';

// 1. TIPADOS DE DATOS (INTERFACES)
interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
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
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [staff, setStaff] = useState<Barbero[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataServicios, dataStaff] = await Promise.all([
          getServicios(),
          getStaff()
        ]);

        const serviciosAdaptados = dataServicios.map((s: any) => ({
          ...s,
          id: s._id || s.id
        }));

        const staffAdaptado = dataStaff.map((b: any) => ({
          ...b,
          id: b._id || b.id,
          avatar: b.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
        }));

        setServicios(serviciosAdaptados);
        setStaff(staffAdaptado);
      } catch (error) {
        console.error("Error al cargar la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <p className="text-orange-500 font-bold uppercase tracking-widest text-xs animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Cargando catálogo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20 max-w-5xl mx-auto animate-fadeIn px-4 sm:px-6">
      
      {/* ========================================================= */}
      {/* HERO / ENCABEZADO PRINCIPAL                               */}
      {/* ========================================================= */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] font-black text-orange-400 uppercase tracking-widest transition-all duration-500 hover:scale-105 hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] cursor-default">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experiencia Kathara</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight leading-tight transition-all duration-700 hover:from-white hover:to-orange-100">
          Servicios & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Staff.</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
          Conocé nuestros servicios diseñados para tu desconexión, y a los artesanos encargados de elevar tu estilo al máximo nivel.
        </p>
      </div>


      {/* ========================================================= */}
      {/* SECCIÓN 1: CATÁLOGO DE SERVICIOS                          */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/5 pb-4 group/header">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-orange-500 transition-transform duration-500 group-hover/header:rotate-12" />
              <span>Nuestros Servicios</span>
            </h2>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lista Oficial</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {servicios.map((s) => (
            <div 
              key={s.id}
              // 🔥 Agregamos -translate-y-1.5 y sombra de color al hacer hover en la tarjeta entera
              className={`group relative rounded-2xl border border-white bg- p-5 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-1.5 ${
                s.destacado 
                  ? 'bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-orange-500/30 shadow-lg shadow-orange-500/10 hover:border-orange-500/60 hover:shadow-orange-500/20' 
                  : 'bg-zinc-900/30 border border-white hover:border-white/20 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-white/5 '
              }`}
            >
              {s.destacado && (
                <div className="absolute top-0 right-5 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center gap-1 shadow-md hover:scale-105 transition-transform duration-300">
                  <Star className="w-3 h-3 text-black fill-black" />
                  <span className="text-black font-black text-[9px] uppercase tracking-widest">Más Solicitado</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  {/* 🔥 El título se desliza un toque a la derecha al hacer hover */}
                  <h3 className="text-lg font-black text-white transition-all duration-300 group-hover:text-orange-400 group-hover:translate-x-1">
                    {s.nombre}
                  </h3>
                  {/* 🔥 El precio hace un mini zoom desde la derecha */}
                  <span className="text-lg font-black text-orange-400 shrink-0 transition-transform duration-300 group-hover:scale-110 origin-right">
                    ${s.precio}
                  </span>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-zinc-300">
                  {s.descripcion}
                </p>

                {/* 🔥 El icono del reloj cambia de color a naranja suave en hover */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/5 text-zinc-300 text-[11px] font-bold transition-colors duration-300 group-hover:border-white/10">
                  <Clock className="w-3 h-3 text-zinc-500 transition-colors duration-300 group-hover:text-orange-400/80" />
                  {s.duracionMinutos > 60
                    ? <span>{Math.floor(s.duracionMinutos / 60)}h {s.duracionMinutos % 60}m</span>
                    : <span>{s.duracionMinutos} min</span>
                  }
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/5 transition-colors duration-300 group-hover:border-white/10">
                <Link 
                  to={`/reservar?servicio=${encodeURIComponent(s.nombre)}`}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    s.destacado
                      ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                      : 'bg-white/5 text-zinc-300 hover:bg-white hover:text-black hover:shadow-lg'
                  }`}
                >
                  <span>Reservar ahora</span>
                  {/* 🔥 La flechita se desliza en hover */}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECCIÓN 2: STAFF DE BARBEROS                              */}
      {/* ========================================================= */}
      <section className="space-y-6 pt-4" id="staff">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/5 pb-4 group/header">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500 transition-transform duration-500 group-hover/header:-translate-y-1" />
              <span>Maestros Barberos</span>
            </h2>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Staff Oficial</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((b) => (
            <div 
              key={b.id}
              // 🔥 Levantamiento y sombra en el cuadro del barbero
              className="group relative rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-orange-500/30 p-5 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-zinc-900/60 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.15)]"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  {/* 🔥 Marco del avatar que se ilumina */}
                  <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 transition-all duration-500 group-hover:border-orange-500/60 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                    <img 
                      src={b.avatar} 
                      alt={b.nombre} 
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                    />
                  </div>
                  <div>
                    {/* 🔥 Movimiento del nombre */}
                    <h3 className="text-base font-black text-white transition-all duration-300 group-hover:text-orange-400 group-hover:translate-x-1">
                      {b.nombre}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5 transition-colors duration-300 group-hover:text-zinc-400">
                      {b.rol === 'admin' ? 'Master Barber' : 'Estilista'}
                    </p>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
                  {b.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {b.especialidades?.map((esp, i) => (
                    <span key={i} className="text-[9px] font-bold px-2 py-1 rounded bg-black/40 text-zinc-400 border border-white/5 transition-all duration-300 group-hover:border-orange-500/20 group-hover:text-orange-300 group-hover:bg-orange-500/5">
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 relative z-10 transition-colors duration-300 group-hover:border-white/10">
                <Link 
                  to={`/staff/${b.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 group-hover:bg-orange-500 text-zinc-300 group-hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ver perfil y trabajos</span>
                  {/* 🔥 Flechita en movimiento al hacer hover en la tarjeta */}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
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