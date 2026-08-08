import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Award, ArrowUpRight } from 'lucide-react'; 
import { getStaff } from '../../services/staff.service'; 

interface IBarbero {
  _id: string;
  nombre: string;
  apellido: string;
  rol: string;
  avatar?: string;
  tituloProfesional?: string;
  especialidades?: string[];
}

const StaffSection: React.FC = () => {
  const navigate = useNavigate();
  
  const [barberos, setBarberos] = useState<IBarbero[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff();
        setBarberos(data);
      } catch (error) {
        console.error("Error al cargar el staff:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <section className="py-6">
      {/* Encabezado de la sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Maestros del Estilo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Nuestro Staff.
          </h2>
        </div>
        <p className="text-zinc-400 text-sm sm:text-base max-w-md">
          Precisión milimétrica y asesoramiento estético. Elegí a tu profesional de confianza.
        </p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse flex items-center gap-2 text-zinc-500">
            <Scissors className="w-5 h-5 animate-spin" /> Cargando profesionales...
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {barberos.map((b) => (
            <div 
              key={b._id}
              onClick={() => navigate(`/staff/${b._id}`)}
              className="group relative w-full max-w-[280px] aspect-square rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-orange-500/30 transition-all duration-500 shadow-2xl shrink-0"
            >
              {/* Foto de fondo */}
              <img 
                src={b.avatar || `https://ui-avatars.com/api/?name=${b.nombre}+${b.apellido}&background=27272a&color=f97316`} 
                alt={`${b.nombre} ${b.apellido}`} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Degradado oscuro para que el texto resalte */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

              {/* 🔥 ÍCONO DE VER PORTAFOLIO ARRIBA A LA DERECHA */}
              <div 
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 group-hover:bg-orange-500 backdrop-blur-md text-white group-hover:text-black transition-all z-30 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                title="Ver portafolio"
              >
                <ArrowUpRight className="w-5 h-5" />
              </div>

              {/* Info del barbero abajo */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-500 z-30">
                <div className="mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                    {b.rol === 'admin'|| b.rol === 'peluquero' ? b.tituloProfesional : 'Estilista'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-white leading-none mb-1">
                  {b.nombre} {b.apellido}
                </h3>
                
                {/* Especialidad (aparece en hover) */}
                <div className="overflow-hidden">
                  <p className="text-zinc-400 text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-2">
                    <Scissors className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="line-clamp-1">{b.especialidades?.[0] || 'Corte Clásico & Fade'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StaffSection;