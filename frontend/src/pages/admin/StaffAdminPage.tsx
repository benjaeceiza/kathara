import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

export const StaffAdminPage: React.FC = () => {
  // MOCK DATA (Acá vemos la estructura que armamos en tu super-modelo de Usuario)
  const [staffMock, setStaffMock] = useState([
    { 
      _id: '1', 
      nombre: "Benjamín", 
      apellido: "Eceiza", 
      rol: "admin", 
      recibeTurnos: true, 
      email: "benjaeceiza400@gmail.com", 
      telefono: "+54 2657 123456", 
      activo: true,
      avatar: "https://ui-avatars.com/api/?name=Benjamín+Eceiza&background=27272a&color=f97316"
    },
    { 
      _id: '2', 
      nombre: "Gonzalo", 
      apellido: "Silvani", 
      rol: "peluquero", 
      recibeTurnos: true, 
      email: "gonza@kathara.com", 
      telefono: "+54 2657 111222", 
      activo: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    { 
      _id: '3', 
      nombre: "Valentina", 
      apellido: "Brayn", 
      rol: "peluquero", 
      recibeTurnos: false, // Está en el sistema, pero no recibe turnos de clientes
      email: "valen@kathara.com", 
      telefono: "+54 2657 333444", 
      activo: false, // Cuenta pausada
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
  ]);

  const [busqueda, setBusqueda] = useState('');

  // Filtro por nombre o apellido
  const staffFiltrado = staffMock.filter(miembro => 
    `${miembro.nombre} ${miembro.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. HEADER Y BOTÓN NUEVO STAFF */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" /> Equipo & Staff.
          </h1>
          <p className="text-zinc-400 mt-1">Gestioná los accesos, roles y visibilidad de tus barberos.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Agregar Miembro
        </button>
      </div>

      {/* 2. BARRA DE BÚSQUEDA */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o apellido..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* 3. GRILLA DE STAFF */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staffFiltrado.map((miembro) => (
          <div 
            key={miembro._id} 
            className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
              miembro.activo 
                ? 'bg-zinc-900 border-white/5 hover:border-white/20' 
                : 'bg-zinc-950 border-red-500/20 opacity-75'
            }`}
          >
            {/* Etiquetas Superiores */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-2">
                {/* Badge de Estado */}
                {miembro.activo ? (
                  <span className="w-fit px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Cuenta Activa
                  </span>
                ) : (
                  <span className="w-fit px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Cuenta Pausada
                  </span>
                )}
                
                {/* Badge de Visibilidad en Agenda */}
                {miembro.recibeTurnos && miembro.activo && (
                   <span className="w-fit flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <CalendarDays className="w-3 h-3" /> Visible en App
                 </span>
                )}
              </div>
              
              {/* Botones de Acción */}
              <div className="flex gap-2">
                <button title="Editar Perfil" className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button title="Desactivar/Eliminar" className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info del Perfil */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative">
                <img 
                  src={miembro.avatar} 
                  alt={miembro.nombre} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-800 shadow-xl mb-3"
                />
                {/* Si es Admin, le ponemos un escudito */}
                {miembro.rol === 'admin' && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-zinc-900" title="Administrador">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-white">{miembro.nombre} {miembro.apellido}</h3>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {miembro.rol === 'admin' ? 'Administrador' : 'Peluquero'}
              </p>
            </div>

            {/* Contacto */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-sm truncate">{miembro.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span className="text-sm">{miembro.telefono}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};