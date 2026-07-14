import  { useState } from 'react';
import { 
  Scissors, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  Tag
} from 'lucide-react';

export const ServiciosAdminPage: React.FC = () => {
  // MOCK DATA (Luego conectaremos esto con tu getServicios del backend)
  const [serviciosMock, setServiciosMock] = useState([
    { _id: '1', nombre: "Skin Fade + Perfilado", descripcion: "Degradado a navaja con perfilado de barba y cejas.", precio: 12000, duracionMinutos: 50, activo: true },
    { _id: '2', nombre: "Corte Clásico & Texturizado", descripcion: "Corte tradicional a tijera o máquina con textura.", precio: 10000, duracionMinutos: 40, activo: true },
    { _id: '3', nombre: "Ritual de Barba", descripcion: "Toalla caliente, navaja tradicional y aceites.", precio: 8500, duracionMinutos: 35, activo: true },
    { _id: '4', nombre: "Colorimetría / Platinado", descripcion: "Decoloración global y matización.", precio: 25000, duracionMinutos: 120, activo: false },
  ]);

  const [busqueda, setBusqueda] = useState('');

  // Filtramos los servicios según lo que escriba el admin en el buscador
  const serviciosFiltrados = serviciosMock.filter(srv => 
    srv.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. HEADER Y BOTÓN NUEVO SERVICIO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Scissors className="w-8 h-8 text-orange-500" /> Catálogo de Servicios.
          </h1>
          <p className="text-zinc-400 mt-1">Administrá los cortes, precios y duraciones de tu local.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Nuevo Servicio
        </button>
      </div>

      {/* 2. BARRA DE BÚSQUEDA */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar servicio por nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* 3. GRILLA DE SERVICIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {serviciosFiltrados.map((servicio) => (
          <div 
            key={servicio._id} 
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              servicio.activo 
                ? 'bg-zinc-900 border-white/5 hover:border-white/20' 
                : 'bg-zinc-950 border-red-500/20 opacity-75'
            }`}
          >
            <div>
              {/* Etiqueta de Estado */}
              <div className="flex justify-between items-start mb-4">
                {servicio.activo ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Activo
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Pausado
                  </span>
                )}
                
                {/* Botones de Acción (Editar / Borrar) */}
                <div className="flex gap-2">
                  <button title="Editar Servicio" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button title="Eliminar" className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info del Servicio */}
              <h3 className="text-xl font-black text-white mb-2">{servicio.nombre}</h3>
              <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                {servicio.descripcion}
              </p>
            </div>

            {/* Footer de la Card (Precio y Duración) */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">{servicio.duracionMinutos} min</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Tag className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-black">${servicio.precio.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Card para Crear Nuevo (Alternativa visual) */}
        <div className="p-6 rounded-3xl border border-dashed border-white/10 bg-zinc-900/50 hover:bg-zinc-900 hover:border-orange-500/50 transition-all flex flex-col items-center justify-center min-h-[250px] cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-white">Agregar Servicio</h3>
          <p className="text-sm text-zinc-500 mt-1 text-center">Creá una nueva opción para tus clientes</p>
        </div>
      </div>

    </div>
  );
};