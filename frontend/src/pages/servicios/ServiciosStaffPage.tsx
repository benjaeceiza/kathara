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
import { ServiciosSkeleton } from '../../components/skeletons/ServiciosSkeleton'; // 🔥 Importamos el esqueleto

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
  tituloProfesional?: string;
  especialidades: string[];
}

const ServiciosStaffPage: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [staff, setStaff] = useState<Barbero[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 🔥 Mini delay para lucir el Skeleton premium
        await new Promise(r => setTimeout(r, 800)); 

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
          avatar: b.avatar || `https://ui-avatars.com/api/?name=${b.nombre}+${b.apellido}&background=000&color=fff`
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

  // 🔥 MOSTRAMOS EL SKELETON
  if (cargando) return <ServiciosSkeleton />;

  return (
    <div className="space-y-16 pb-20 max-w-5xl mx-auto animate-fadeIn px-4 sm:px-6">
      
      {/* ========================================================= */}
      {/* HERO / ENCABEZADO PRINCIPAL                               */}
      {/* ========================================================= */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8 transition-colors duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest shadow-sm transition-all duration-500 hover:scale-105 cursor-default">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experiencia Kathara</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight transition-colors duration-700 drop-shadow-sm">
          Servicios & Staff.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium transition-colors duration-700">
          Conocé nuestros servicios diseñados para tu desconexión, y a los artesanos encargados de elevar tu estilo al máximo nivel.
        </p>
      </div>


      {/* ========================================================= */}
      {/* SECCIÓN 1: CATÁLOGO DE SERVICIOS                          */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/50 dark:border-white/10 pb-4 group/header transition-colors duration-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 transition-colors duration-700">
              <Scissors className="w-5 h-5 text-zinc-900 dark:text-white transition-transform duration-500 group-hover/header:rotate-12" />
              <span>Nuestros Servicios</span>
            </h2>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-700">Lista Oficial</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {servicios.map((s) => (
            <div 
              key={s.id}
              className={`group relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-1.5 backdrop-blur-md ${
                s.destacado 
                  ? 'bg-zinc-900 dark:bg-white border border-transparent shadow-xl hover:shadow-2xl hover:scale-[1.01]' 
                  : 'bg-white/60 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/10 hover:border-zinc-900 dark:hover:border-white shadow-md hover:shadow-lg'
              }`}
            >
              {s.destacado && (
                <div className="absolute top-0 right-5 -translate-y-1/2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform duration-300">
                  <Star className="w-3 h-3 text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white" />
                  <span className="text-zinc-900 dark:text-white font-black text-[9px] uppercase tracking-widest">Más Solicitado</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-lg font-black transition-all duration-300 group-hover:translate-x-1 ${
                      s.destacado ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'
                  }`}>
                    {s.nombre}
                  </h3>
                  <span className={`text-lg font-black shrink-0 transition-transform duration-300 group-hover:scale-110 origin-right ${
                      s.destacado ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'
                  }`}>
                    ${s.precio}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-2 transition-colors duration-300 ${
                    s.destacado ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-600 dark:text-zinc-400'
                }`}>
                  {s.descripcion}
                </p>

                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors duration-300 ${
                    s.destacado 
                    ? 'bg-white/10 dark:bg-black/10 text-white dark:text-zinc-900' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}>
                  <Clock className="w-3 h-3" />
                  {s.duracionMinutos > 60
                    ? <span>{Math.floor(s.duracionMinutos / 60)}h {s.duracionMinutos % 60}m</span>
                    : <span>{s.duracionMinutos} min</span>
                  }
                </div>
              </div>

              <div className={`pt-5 mt-4 border-t transition-colors duration-300 ${
                  s.destacado ? 'border-white/20 dark:border-black/10' : 'border-zinc-200/50 dark:border-white/10 group-hover:border-zinc-900 dark:group-hover:border-white'
              }`}>
                <Link 
                  to={`/reservar?servicio=${encodeURIComponent(s.nombre)}&id=${s.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    s.destacado
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:scale-[1.02] shadow-lg'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 shadow-sm'
                  }`}
                >
                  <span>Reservar ahora</span>
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/50 dark:border-white/10 pb-4 group/header transition-colors duration-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 transition-colors duration-700">
              <User className="w-5 h-5 text-zinc-900 dark:text-white transition-transform duration-500 group-hover/header:-translate-y-1" />
              <span>Profesionales</span>
            </h2>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-700">Staff Oficial</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((b) => (
            <div 
              key={b.id}
              className="group relative rounded-3xl bg-white/20 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 hover:border-zinc-900 dark:hover:border-white p-5 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-white/90 dark:hover:bg-zinc-900/70 hover:shadow-xl"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  {/* 🔥 Avatar a todo color siempre */}
                  <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 transition-all duration-500 group-hover:border-zinc-900 dark:group-hover:border-white group-hover:shadow-lg">
                    <img 
                      src={b.avatar} 
                      alt={b.nombre} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-black capitalize text-zinc-900 dark:text-white transition-all duration-300 group-hover:translate-x-1">
                      {b.nombre}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5 transition-colors duration-300">
                      {b.tituloProfesional || 'Estilista'}
                    </p>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed transition-colors duration-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-300">
                  {b.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {b.especialidades?.map((esp, i) => (
                    <span key={i} className="text-[9px] font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors duration-300 group-hover:border-zinc-900 dark:group-hover:border-white group-hover:text-zinc-900 dark:group-hover:text-white">
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-zinc-200/50 dark:border-white/10 relative z-10 transition-colors duration-300 group-hover:border-zinc-900 dark:group-hover:border-white">
                <Link 
                  to={`/staff/${b.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-zinc-900 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-lg"
                >
                  <span>Ver perfil y trabajos</span>
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