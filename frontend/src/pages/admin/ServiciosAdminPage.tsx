import React, { useState, useEffect } from 'react';
import { 
  Scissors, Search, Plus, Edit2, Trash2, Clock, Tag, X, Save, Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getServicios, crearServicio, actualizarServicio, eliminarServicio } from '../../services/servicios.service';
import ModalDangerAction from '../../components/modals/ModalDangerAction';

export const ServiciosAdminPage: React.FC = () => {
  const { token } = useAuthStore();
  const [serviciosDB, setServiciosDB] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados para el Modal ABM (Crear / Editar)
  const [modalForm, setModalForm] = useState({ isOpen: false, modo: 'crear', id: '' });
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: 0, activo: true,
    horas: 0, minutos: 0 // 🔥 Manejo separado en la UI
  });
  const [guardando, setGuardando] = useState(false);

  // Estado para el Modal de Eliminar
  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '' });
  const [eliminando, setEliminando] = useState(false);

  // 🔄 CARGAR DATOS
  const cargarServicios = async () => {
    try {
      setCargando(true);
      const data = await getServicios();
      setServiciosDB(data);
    } catch (error) {
      console.error("Error al cargar servicios", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // 📝 ABRIR MODAL (Crear o Editar)
  const abrirModalForm = (servicio?: any) => {
    if (servicio) {
      // Editar: Desarmamos los minutos totales en horas y minutos (ej: 90min -> 1h 30m)
      const horas = Math.floor(servicio.duracionMinutos / 60);
      const minutos = servicio.duracionMinutos % 60;
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio: servicio.precio,
        activo: servicio.activo,
        horas,
        minutos
      });
      setModalForm({ isOpen: true, modo: 'editar', id: servicio._id });
    } else {
      // Crear: Formulario vacío
      setFormData({ nombre: '', descripcion: '', precio: 0, activo: true, horas: 0, minutos: 30 });
      setModalForm({ isOpen: true, modo: 'crear', id: '' });
    }
  };

  // 💾 GUARDAR SERVICIO
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      // 🔥 Volvemos a juntar las horas y minutos para mandar a la BD
      const duracionTotal = (Number(formData.horas) * 60) + Number(formData.minutos);
      
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        activo: formData.activo,
        duracionMinutos: duracionTotal
      };

      if (modalForm.modo === 'crear') {
        await crearServicio(payload, token!);
      } else {
        await actualizarServicio(modalForm.id, payload, token!);
      }

      await cargarServicios();
      setModalForm({ isOpen: false, modo: 'crear', id: '' });
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // 🗑️ ELIMINAR SERVICIO
  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await eliminarServicio(modalEliminar.id, token!);
      await cargarServicios();
      setModalEliminar({ isOpen: false, id: '' });
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setEliminando(false);
    }
  };

  const serviciosFiltrados = serviciosDB.filter(srv => 
    srv.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Renderizado de carga
  if (cargando) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      
      {/* 1. HEADER Y BOTÓN NUEVO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Scissors className="w-8 h-8 text-orange-500" /> Catálogo de Servicios.
          </h1>
          <p className="text-zinc-400 mt-1">Administrá los cortes, precios y duraciones de tu local.</p>
        </div>
        <button 
          onClick={() => abrirModalForm()}
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
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
        {serviciosFiltrados.map((servicio) => {
          // Para mostrarlo lindo en la grilla (ej: 1h 30m)
          const h = Math.floor(servicio.duracionMinutos / 60);
          const m = servicio.duracionMinutos % 60;
          const duracionDisplay = h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m} min`;

          return (
            <div 
              key={servicio._id} 
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                servicio.activo 
                  ? 'bg-zinc-900 border-white/5 hover:border-white/20' 
                  : 'bg-zinc-950 border-red-500/20 opacity-75'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {servicio.activo ? (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Activo</span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Pausado</span>
                  )}
                  
                  <div className="flex gap-2">
                    <button onClick={() => abrirModalForm(servicio)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setModalEliminar({ isOpen: true, id: servicio._id })} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-2">{servicio.nombre}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-6">{servicio.descripcion}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold">{duracionDisplay}</span>
                </div>
                <div className="flex items-center gap-1 text-white">
                  <Tag className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-black">${servicio.precio.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div onClick={() => abrirModalForm()} className="p-6 rounded-3xl border border-dashed border-white/10 bg-zinc-900/50 hover:bg-zinc-900 hover:border-orange-500/50 transition-all flex flex-col items-center justify-center min-h-[250px] cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-white">Agregar Servicio</h3>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL ABM (CREAR / EDITAR) */}
      {/* ========================================= */}
      {modalForm.isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center sm:items-center items-end p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-zinc-950 sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slideUp sm:animate-scaleIn max-h-[90vh]">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-white">
                {modalForm.modo === 'crear' ? 'Nuevo Servicio' : 'Editar Servicio'}
              </h2>
              <button onClick={() => setModalForm({ ...modalForm, isOpen: false })} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="overflow-y-auto p-6 space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Nombre del Servicio</label>
                <input 
                  required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Ej: Skin Fade + Barba"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Descripción</label>
                <textarea 
                  rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Detalles del corte o tratamiento..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Precio ($)</label>
                  <input 
                    required type="number" min="0" value={formData.precio} onChange={e => setFormData({...formData, precio: Number(e.target.value)})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Estado</label>
                  <select 
                    value={formData.activo ? 'true' : 'false'} onChange={e => setFormData({...formData, activo: e.target.value === 'true'})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                  >
                    <option value="true">🟢 Activo (Visible)</option>
                    <option value="false">🔴 Pausado (Oculto)</option>
                  </select>
                </div>
              </div>

              {/* 🔥 BLOQUE DE DURACIÓN (HORAS Y MINUTOS) */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                <label className="block text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duración Estimada
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold mb-1 block">Horas</span>
                    <input 
                      type="number" min="0" max="10" value={formData.horas} onChange={e => setFormData({...formData, horas: Number(e.target.value)})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-orange-500 transition-colors text-center font-black"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold mb-1 block">Minutos</span>
                    <input 
                      type="number" min="0" max="59" step="5" value={formData.minutos} onChange={e => setFormData({...formData, minutos: Number(e.target.value)})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-orange-500 transition-colors text-center font-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button type="button" onClick={() => setModalForm({ ...modalForm, isOpen: false })} className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {guardando ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando</> : <><Save className="w-4 h-4" /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      <ModalDangerAction
        isOpen={modalEliminar.isOpen}
        onClose={() => setModalEliminar({ isOpen: false, id: '' })}
        onConfirm={confirmarEliminacion}
        isLoading={eliminando}
        title="¿Eliminar Servicio?"
        message="Se borrará permanentemente del catálogo. Los turnos que ya fueron reservados con este servicio no se verán afectados, pero ya nadie podrá pedirlo de nuevo."
        confirmText="Sí, Eliminar"
      />

    </div>
  );
};