import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Camera, Save, Edit2, 
  History, Star, ShieldCheck, Lock, Key, 
  ChevronDown, ChevronUp, Trash2, LogOut, 
  Settings, Sun, Moon, Palette
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/themeStore'; 
import { actualizarDatosPersonales, cambiarClave, actualizarAvatar, eliminarAvatar } from '../../../services/usuarioService';
import { Toast } from '../../../components/ui/Toast';
import { ImageCropper } from '../../../components/ui/ImageCropper';
import { getCroppedImg } from '../../../components/utils/cropImage';
import { PerfilSkeleton } from '../../../components/skeletons/PerfilSkeleton'; // 🔥 Importamos el esqueleto

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario, actualizarUsuario, logout } = useAuthStore();
  const { tema, toggleTema } = useThemeStore(); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cargandoPerfil, setCargandoPerfil] = useState(true); // 🔥 Estado inicial de carga
  const [editando, setEditando] = useState(false);
  const [mostrarSeguridad, setMostrarSeguridad] = useState(false);
  const [menuAvatarAbierto, setMenuAvatarAbierto] = useState(false);
  
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [cargandoPass, setCargandoPass] = useState(false);
  const [cargandoAvatar, setCargandoAvatar] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

  const [toast, setToast] = useState<{ visible: boolean; mensaje: string; tipo: 'success' | 'error' }>({
    visible: false,
    mensaje: '',
    tipo: 'success'
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  // 🔥 Mini delay para lucir el Skeleton y evitar parpadeos
  useEffect(() => {
    const timer = setTimeout(() => setCargandoPerfil(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error') => {
    setToast({ visible: true, mensaje, tipo });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImagenSeleccionada(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedAreaPixels: any) => {
    if (!imagenSeleccionada) return;
    try {
      setCargandoAvatar(true);
      setImagenSeleccionada(null);
      const croppedFile = await getCroppedImg(imagenSeleccionada, croppedAreaPixels);
      const respuesta = await actualizarAvatar(croppedFile);
      actualizarUsuario(respuesta.usuario);
      mostrarNotificacion('¡Foto de perfil actualizada!', 'success');
    } catch (error: any) {
      mostrarNotificacion(error.message || 'Error al subir la imagen', 'error');
    } finally {
      setCargandoAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const handleEliminarAvatar = async () => {
    if (!window.confirm('¿Estás seguro de que querés eliminar tu foto de perfil?')) return;
    try {
      setCargandoEliminar(true);
      const respuesta = await eliminarAvatar();
      actualizarUsuario(respuesta.usuario);
      mostrarNotificacion('¡Foto eliminada correctamente!', 'success');
    } catch (error: any) {
      mostrarNotificacion(error.message || 'Hubo un error al eliminar', 'error');
    } finally {
      setCargandoEliminar(false);
    }
  };

  const handleGuardarDatos = async () => {
    try {
      setCargandoDatos(true);
      const respuesta = await actualizarDatosPersonales({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      });
      actualizarUsuario(respuesta.usuario);
      mostrarNotificacion('¡Datos guardados con éxito!', 'success');
      setEditando(false);
    } catch (error: any) {
      mostrarNotificacion(error.message || 'Hubo un error al guardar', 'error');
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      mostrarNotificacion("Las contraseñas nuevas no coinciden", 'error');
      return;
    }
    try {
      setCargandoPass(true);
      await cambiarClave(passwords.actual, passwords.nueva);
      mostrarNotificacion('¡Contraseña actualizada correctamente!', 'success');
      setPasswords({ actual: '', nueva: '', confirmar: '' });
      setMostrarSeguridad(false);
    } catch (error: any) {
      mostrarNotificacion(error.message || 'La contraseña actual es incorrecta', 'error');
    } finally {
      setCargandoPass(false);
    }
  };

  const handleCambiarTema = (nuevoTema: 'dark' | 'light') => {
    if (tema !== nuevoTema) {
      toggleTema();
      mostrarNotificacion(`Tema ${nuevoTema === 'dark' ? 'Oscuro' : 'Claro'} activado`, 'success');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🔥 MOSTRAMOS EL SKELETON
  if (cargandoPerfil || !usuario) return <PerfilSkeleton />;

  const estadisticas = {
    turnosCompletados: usuario?.turnosCompletados || 0,
    faltas: usuario?.faltas || 0,
    exentoSena: usuario?.exentoSena || false, 
    miembroDesde: usuario?.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString() : "Reciente"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12 relative pt-8 px-4 sm:px-0">
      
      {/* HEADER */}
      <div className="mb-8 transition-colors duration-700">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
          <Settings className="w-8 h-8 text-zinc-900 dark:text-white" /> Ajustes de Cuenta
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1 transition-colors">Gestioná tu acceso, preferencias de sistema y perfil administrativo.</p>
      </div>

      {/* 🔥 GRID PRINCIPAL: Pasamos de items-stretch a items-start para evitar el efecto chicle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA                                         */}
        {/* ========================================================= */}
        {/* 🔥 lg:sticky lg:top-28 hace que esta columna baje con vos si abrís el acordeón de contraseñas */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-28">
          
          {/* TARJETA AVATAR */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-visible group transition-all shadow-md">
            <div className="relative mb-4">
              <input 
                type="file" accept="image/jpeg, image/png, image/webp" 
                className="hidden" ref={fileInputRef} onChange={handleFileSelect} 
              />
              <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-950 shadow-xl flex items-center justify-center overflow-hidden relative transition-colors">
                {(cargandoAvatar || cargandoEliminar) && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm transition-colors">
                    <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {usuario?.avatar ? (
                  <img src={usuario.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-zinc-900 dark:text-white uppercase transition-colors">
                    {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                  </span>
                )}
              </div>
              <button 
                onClick={() => { usuario?.avatar ? setMenuAvatarAbierto(!menuAvatarAbierto) : fileInputRef.current?.click(); }}
                disabled={cargandoAvatar || cargandoEliminar}
                className="absolute bottom-0 right-0 p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full hover:scale-110 transition-all shadow-lg cursor-pointer disabled:opacity-50 z-20"
              >
                {usuario?.avatar ? <Edit2 className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              </button>
              {menuAvatarAbierto && <div className="fixed inset-0 z-20" onClick={() => setMenuAvatarAbierto(false)} />}
              {menuAvatarAbierto && (
                <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-30 animate-fadeIn transition-colors">
                  <button 
                    onClick={() => { setMenuAvatarAbierto(false); fileInputRef.current?.click(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-zinc-900 dark:text-white" /> Cambiar foto
                  </button>
                  <button 
                    onClick={() => { setMenuAvatarAbierto(false); handleEliminarAvatar(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-zinc-100 dark:border-white/5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar foto
                  </button>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white transition-colors">{usuario.nombre} {usuario.apellido}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 uppercase tracking-widest font-bold transition-colors">{usuario.rol}</p>
          </div>

          {/* TARJETA MÉTRICAS */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 shadow-md transition-colors">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 transition-colors">Métricas de Cuenta</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-black/50 border border-zinc-200/50 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span className="text-sm font-bold text-zinc-900 dark:text-white transition-colors">Sesiones Activas</span>
                </div>
                <span className="text-lg font-black text-zinc-900 dark:text-white transition-colors">1</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-black/50 border border-zinc-200/50 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-zinc-900 dark:text-white" />
                  <span className="text-sm font-bold text-zinc-900 dark:text-white transition-colors">Miembro Desde</span>
                </div>
                <span className="text-sm font-black text-zinc-500 dark:text-zinc-400 transition-colors">{estadisticas.miembroDesde}</span>
              </div>
            </div>
          </div>

          {/* 🔥 ZONA DE PELIGRO: Le sacamos el flex-1 para que no se estire */}
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-6 text-center transition-colors">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-red-600 dark:text-red-400 mb-1">Finalizar Sesión</h3>
              <p className="text-xs text-red-500/80 dark:text-red-400/80 leading-relaxed px-2">Saldrás de tu cuenta de forma segura.</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 uppercase text-xs tracking-widest"
            >
              Cerrar Sesión
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA                                           */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* MÓDULO 1: DATOS Y CONTACTO */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-md transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2 transition-colors">
                <User className="w-5 h-5 text-zinc-900 dark:text-white" /> Información de Contacto
              </h3>
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="flex justify-center items-center gap-2 px-5 h-10 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              ) : (
                <button
                  onClick={handleGuardarDatos}
                  disabled={cargandoDatos}
                  className="flex justify-center items-center gap-2 px-5 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {cargandoDatos ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar</>}
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Nombre</label>
                  <input 
                    type="text" name="nombre" disabled={!editando} value={formData.nombre} onChange={handleChange} maxLength={15}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors ${
                      editando ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-zinc-900 dark:focus:border-white shadow-inner' : 'bg-zinc-100/50 dark:bg-black/30 border-zinc-200 dark:border-white/5 text-zinc-500 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Apellido</label>
                  <input 
                    type="text" name="apellido" disabled={!editando} value={formData.apellido} onChange={handleChange} maxLength={15}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none transition-colors ${
                       editando ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-zinc-900 dark:focus:border-white shadow-inner' : 'bg-zinc-100/50 dark:bg-black/30 border-zinc-200 dark:border-white/5 text-zinc-500 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Correo (Solo Lectura)</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" disabled value={usuario?.email || ''}
                      className="w-full bg-zinc-100/50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-500 cursor-not-allowed focus:outline-none transition-colors"
                    />
                    <ShieldCheck className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Teléfono / WhatsApp</label>
                  <div className="relative">
                    <Phone className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${editando ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`} />
                    <input 
                      type="tel" name="telefono" disabled={!editando} value={formData.telefono} onChange={handleChange}
                      className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-colors ${
                         editando ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-zinc-900 dark:focus:border-white shadow-inner' : 'bg-zinc-100/50 dark:bg-black/30 border-zinc-200 dark:border-white/5 text-zinc-500 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MÓDULO 2: SEGURIDAD */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-300 shadow-md">
            <button 
              onClick={() => setMostrarSeguridad(!mostrarSeguridad)}
              className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h3 className="text-xl font-black text-zinc-900 dark:text-white transition-colors">Seguridad y Contraseña</h3>
              </div>
              {mostrarSeguridad ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
            </button>

            {mostrarSeguridad && (
              <div className="p-6 sm:p-8 pt-0 border-t border-zinc-200/50 dark:border-white/5 animate-fadeIn">
                <form onSubmit={handleCambiarPassword} className="space-y-6 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Contraseña Actual</label>
                    <div className="relative">
                      <Key className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password" name="actual" required disabled={cargandoPass}
                        value={passwords.actual} onChange={handlePasswordChange}
                        placeholder="Ingresá tu contraseña actual"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Nueva Contraseña</label>
                      <input 
                        type="password" name="nueva" required minLength={6} disabled={cargandoPass}
                        value={passwords.nueva} onChange={handlePasswordChange}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 transition-colors">Confirmar Nueva</label>
                      <input 
                        type="password" name="confirmar" required minLength={6} disabled={cargandoPass}
                        value={passwords.confirmar} onChange={handlePasswordChange}
                        placeholder="Repetí la contraseña"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={cargandoPass || !passwords.actual || !passwords.nueva || !passwords.confirmar}
                      className="w-full sm:w-52 flex justify-center items-center py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                    >
                      {cargandoPass ? 'Procesando...' : 'Actualizar Clave'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* MÓDULO 3: PREFERENCIAS DEL SISTEMA */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-md transition-colors">
             <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-zinc-900 dark:text-white transition-colors" />
                <h3 className="text-xl font-black text-zinc-900 dark:text-white transition-colors">Preferencias Visuales</h3>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 dark:bg-black/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-white/5 transition-colors">
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 transition-colors">Apariencia de la Interfaz</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors">Personalizá cómo ves el panel administrativo.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-white/10 transition-colors">
                  <button
                    onClick={() => handleCambiarTema('light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      tema === 'light' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Sun className="w-4 h-4" /> Claro
                  </button>
                  <button
                    onClick={() => handleCambiarTema('dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      tema === 'dark' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4" /> Oscuro
                  </button>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      <Toast 
        mensaje={toast.mensaje} 
        tipo={toast.tipo} 
        visible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      {imagenSeleccionada && (
        <ImageCropper 
          imageSrc={imagenSeleccionada}
          onCropCompleteAction={handleCropComplete}
          onClose={() => {
            setImagenSeleccionada(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      )}
    </div>
  );
}