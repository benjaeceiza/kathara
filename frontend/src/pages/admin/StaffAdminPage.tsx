import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Edit2, Trash2, Phone, Mail,
  ShieldCheck, CalendarDays, X, Save, Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getStaff, crearStaff, actualizarStaff, eliminarStaff } from '../../services/staff.service';
import ModalDangerAction from '../../components/modals/ModalDangerAction';

export const StaffAdminPage: React.FC = () => {
  const { token } = useAuthStore();
  const [staffDB, setStaffDB] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados para el Modal ABM
  const [modalForm, setModalForm] = useState({ isOpen: false, modo: 'crear', id: '' });
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    password: '', rol: 'peluquero', recibeTurnos: true, activo: true
  });
  const [guardando, setGuardando] = useState(false);

  // Estado para Modal Eliminar
  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '' });
  const [eliminando, setEliminando] = useState(false);

  // 🔄 CARGAR DATOS
  const cargarStaff = async () => {
    try {
      setCargando(true);
      const data = await getStaff(token);
      setStaffDB(data);
    } catch (error) {
      console.error("Error al cargar staff:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarStaff();
  }, []);

  // 📝 ABRIR MODAL
  const abrirModalForm = (miembro?: any) => {
    if (miembro) {
      setFormData({
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        email: miembro.email,
        telefono: miembro.telefono || '',
        password: '', // No se muestra la pass al editar por seguridad
        rol: miembro.rol,
        recibeTurnos: miembro.recibeTurnos,
        activo: miembro.activo
      });
      setModalForm({ isOpen: true, modo: 'editar', id: miembro._id });
    } else {
      setFormData({
        nombre: '', apellido: '', email: '', telefono: '',
        password: '', rol: 'peluquero', recibeTurnos: true, activo: true
      });
      setModalForm({ isOpen: true, modo: 'crear', id: '' });
    }
  };

  // 💾 GUARDAR
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (modalForm.modo === 'crear') {
        if (!formData.password) throw new Error('La contraseña es obligatoria para usuarios nuevos.');
        await crearStaff(formData, token!);
      } else {
        // Si editamos, borramos el password del payload si está vacío para no pisarlo
        const payload = { ...formData };

        if (modalForm.modo === 'crear') {
          if (!formData.password) throw new Error('La contraseña es obligatoria para usuarios nuevos.');
          await crearStaff(formData, token!);
        } else {
          // 🔥 MAGIA TYPESCRIPT: Separamos "password" del resto de los datos
          const { password, ...restoDelFormulario } = formData;

          // Si hay password, mandamos todo. Si está vacía, mandamos "restoDelFormulario"
          const payload = password ? formData : restoDelFormulario;

          await actualizarStaff(modalForm.id, payload, token!);
        }
        await actualizarStaff(modalForm.id, payload, token!);
      }
      await cargarStaff();
      setModalForm({ isOpen: false, modo: 'crear', id: '' });
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // 🗑️ ELIMINAR
  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await eliminarStaff(modalEliminar.id, token!);
      await cargarStaff();
      setModalEliminar({ isOpen: false, id: '' });
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setEliminando(false);
    }
  };

  const staffFiltrado = staffDB.filter(miembro =>
    `${miembro.nombre} ${miembro.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24">

      {/* 1. HEADER Y BOTÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" /> Equipo & Staff.
          </h1>
          <p className="text-zinc-400 mt-1">Gestioná los accesos, roles y visibilidad de tus barberos.</p>
        </div>
        <button
          onClick={() => abrirModalForm()}
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
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
            className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${miembro.activo
              ? 'bg-zinc-900 border-white/5 hover:border-white/20'
              : 'bg-zinc-950 border-red-500/20 opacity-75'
              }`}
          >
            {/* Etiquetas Superiores */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-2">
                {miembro.activo ? (
                  <span className="w-fit px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Cuenta Activa</span>
                ) : (
                  <span className="w-fit px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Cuenta Pausada</span>
                )}

                {miembro.recibeTurnos && miembro.activo && (
                  <span className="w-fit flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CalendarDays className="w-3 h-3" /> Visible en App
                  </span>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2">
                <button onClick={() => abrirModalForm(miembro)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setModalEliminar({ isOpen: true, id: miembro._id })} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info del Perfil */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative">
                <img
                  src={miembro.avatar || `https://ui-avatars.com/api/?name=${miembro.nombre}+${miembro.apellido}&background=27272a&color=f97316`}
                  alt={miembro.nombre}
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-800 shadow-xl mb-3"
                />
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
                <span className="text-sm">{miembro.telefono || 'Sin teléfono'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================= */}
      {/* MODAL ABM (CREAR / EDITAR) */}
      {/* ========================================= */}
      {modalForm.isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center sm:items-center items-end p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-zinc-950 sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slideUp sm:animate-scaleIn max-h-[90vh]">

            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-white">
                {modalForm.modo === 'crear' ? 'Nuevo Miembro' : 'Editar Perfil'}
              </h2>
              <button onClick={() => setModalForm({ ...modalForm, isOpen: false })} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="overflow-y-auto p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Nombre</label>
                  <input required type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 transition-colors" placeholder="Ej: Juan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Apellido</label>
                  <input required type="text" value={formData.apellido} onChange={e => setFormData({ ...formData, apellido: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 transition-colors" placeholder="Ej: Pérez" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email (Login)</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 transition-colors" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Teléfono</label>
                  <input type="text" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 transition-colors" placeholder="+54 2657..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Contraseña {modalForm.modo === 'editar' && <span className="text-zinc-600 lowercase font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  required={modalForm.modo === 'crear'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 transition-colors"
                  placeholder="********"
                  autoComplete="new-password" // 🔥 Agregamos esta línea
                />
              </div>

              {/* CONTROLES DE ROL Y VISIBILIDAD */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Rol del Sistema</label>
                  <select value={formData.rol} onChange={e => setFormData({ ...formData, rol: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-orange-500">
                    <option value="peluquero">Peluquero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2" title="¿Aparece en la app de clientes?">Recibe Turnos</label>
                  <select value={formData.recibeTurnos ? 'true' : 'false'} onChange={e => setFormData({ ...formData, recibeTurnos: e.target.value === 'true' })} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-orange-500">
                    <option value="true">Sí, agenda activa</option>
                    <option value="false">No, solo gestión</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Estado Cuenta</label>
                  <select value={formData.activo ? 'true' : 'false'} onChange={e => setFormData({ ...formData, activo: e.target.value === 'true' })} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-orange-500">
                    <option value="true">🟢 Activa</option>
                    <option value="false">🔴 Pausada</option>
                  </select>
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
        title="¿Eliminar Staff?"
        message="Se borrará permanentemente el acceso de este usuario. Los turnos históricos quedarán huérfanos. Se recomienda 'Pausar' la cuenta en su lugar."
        confirmText="Sí, Eliminar"
      />

    </div>
  );
};