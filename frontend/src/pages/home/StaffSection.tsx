
import { Scissors, Share2, Star, Award } from 'lucide-react';
import img from "../../assets/gonza.png";
import img2 from "../../assets/valen.png";

 const StaffSection: React.FC = () => {
  // Acá provisoriamente ponemos datos fijos, pero después lo conectamos directo con tu base de MongoDB
  const barberos = [
    {
      id: 1,
      nombre: "Gonza Silvani",
      rol: "Master Barber & Fundador",
      especialidad: "Degradés visagistas & Barba tradicional",
      foto: img,
      val: "4.9",
      exp: "8 años exp."
    },
    {
      id: 2,
      nombre: "Valentino Brayn",
      rol: "Estilista Senior",
      especialidad: "Taper fade, Freestyle & Colorimetría",
      foto: img2,
      val: "5.0",
      exp: "5 años exp."
    }
  ];

  return (
    <section className="py-6">
      {/* Encabezado de la sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Maestros del Estilo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Conocé a nuestro Staff.
          </h2>
        </div>
        <p className="text-zinc-400 text-sm sm:text-base max-w-md">
          Profesionales apasionados por la precisión milimétrica y el asesoramiento estético. Elegí a tu barbero de confianza.
        </p>
      </div>

      {/* Grilla de Barberos */}
      <div className="flex justify-center gap-6">
        {barberos.map((b) => (
          <div 
            key={b.id}
            className="bg-zinc-900/40 border border-white/5 rounded-[2rem] w-full max-w-xl overflow-hidden group hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Foto del barbero con degradado oscuro abajo */}
            <div className="relative h-72 w-full overflow-hidden bg-zinc-800">
              <img 
                src={b.foto} 
                alt={b.nombre} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
              
              {/* Badge de valoración flotante */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white">
                <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{b.val}</span>
              </div>

              {/* Años de experiencia */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-xs font-bold text-orange-300">
                {b.exp}
              </div>
            </div>

            {/* Información y Botón */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">{b.rol}</p>
                <h3 className="text-xl font-bold text-white mb-2">{b.nombre}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed flex items-center gap-2 mb-6">
                  <Scissors className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{b.especialidad}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button className="text-xs font-bold text-white hover:text-orange-400 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                  <span>Reservar con él</span>
                  <span>➜</span>
                </button>
                
                <a href="#" className="p-2 rounded-full bg-zinc-800/80 hover:bg-orange-500 hover:text-black text-zinc-400 transition-all">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StaffSection;