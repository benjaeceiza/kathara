import React, { useState, useEffect, useRef } from 'react';
import {
    Briefcase, PlusCircle, Sparkles, Layout, Camera, UserCircle,
    Image as ImageIcon, AlignLeft, AtSign, Save, Edit2, Trash2, Upload,
    Phone, Scissors, CheckCircle2, X, ChevronLeft, ChevronRight,Clock
} from 'lucide-react';
import {
    obtenerMiPortafolio,
    crearMiPortafolio,
    actualizarDatosPortafolio,
    subirFotoPortada,
    subirImagenGaleria,
    eliminarImagenGaleria,
    subirAvatarUsuario,
    actualizarOrdenGaleria
} from '../../services/portafolioService';
import { useAuthStore } from '../../store/authStore';
import { Toast } from '../../components/ui/Toast';

export default function PortafolioAdminPage() {
    const { usuario } = useAuthStore();
    const [portafolio, setPortafolio] = useState<any>(null);

    const [cargando, setCargando] = useState(true);
    const [creando, setCreando] = useState(false);
    const [guardandoDatos, setGuardandoDatos] = useState(false);
    const [subiendoPortada, setSubiendoPortada] = useState(false);
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const [subiendoGaleria, setSubiendoGaleria] = useState(false);

    const [editandoInfo, setEditandoInfo] = useState(false);
    const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });

    const portadaInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const galeriaInputRef = useRef<HTMLInputElement>(null);

    // MOCK DE SERVICIOS
    const [serviciosDisponibles] = useState([
        { id: '1', nombre: 'Corte Clásico' },
        { id: '2', nombre: 'Skin Fade' },
        { id: '3', nombre: 'Barba Ritual' },
        { id: '4', nombre: 'Colorimetría' },
        { id: '5', nombre: 'Alisado Keratina' },
        { id: '6', nombre: 'Corte + Barba' }
    ]);

    const [formData, setFormData] = useState({
        biografiaProfesional: '',
        instagram: '',
        whatsapp: '',
        especialidades: '',
        horarios: '',
        serviciosSeleccionados: [] as string[]
    });

    useEffect(() => {
        cargarPortafolio();
    }, []);

    const cargarPortafolio = async () => {
        try {
            setCargando(true);
            const data = await obtenerMiPortafolio();
            if (data) {
                setPortafolio(data);

                // 🔥 Skills dinámicas extraídas del portafolio o del usuario
                const skillsArray = data.especialidades && data.especialidades.length > 0
                    ? data.especialidades
                    : (data.peluquero?.especialidades || []);

                setFormData({
                    biografiaProfesional: data.biografiaProfesional || '',
                    instagram: data.redesProfesionales?.instagram || '',
                    whatsapp: data.peluquero?.telefono || data.redesProfesionales?.whatsapp || usuario?.telefono || '',
                    especialidades: skillsArray.join(', '),
                    horarios: data.horarios || '',
                    serviciosSeleccionados: data.serviciosQueRealiza || []
                });

                // Actualizamos store si vino el avatar fresco por populate
                if (data.peluquero?.avatar) {
                    useAuthStore.setState((state: any) => ({
                        usuario: { ...state.usuario, avatar: data.peluquero.avatar, telefono: data.peluquero.telefono }
                    }));
                }
            }
        } catch (error) {
            console.error("Error al cargar portafolio", error);
        } finally {
            setCargando(false);
        }
    };

    const handleCrearPortafolio = async () => {
        try {
            setCreando(true);
            const nuevoPortafolio = await crearMiPortafolio();
            setPortafolio(nuevoPortafolio);
            setToast({ visible: true, mensaje: '¡Portafolio creado con éxito!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally {
            setCreando(false);
        }
    };

    const handleGuardarDatos = async () => {
        try {
            setGuardandoDatos(true);
            const datos = {
                biografiaProfesional: formData.biografiaProfesional,
                redesProfesionales: {
                    instagram: formData.instagram,
                    whatsapp: formData.whatsapp,
                    tiktok: portafolio.redesProfesionales?.tiktok || ''
                },
                especialidades: formData.especialidades.split(',').map(e => e.trim()).filter(e => e !== ''),
                horarios: formData.horarios,
                serviciosQueRealiza: formData.serviciosSeleccionados
            };

            const actualizado = await actualizarDatosPortafolio(datos);
            setPortafolio(actualizado);

            useAuthStore.setState((state: any) => ({
                usuario: {
                    ...state.usuario,
                    telefono: formData.whatsapp,
                    especialidades: datos.especialidades
                }
            }));

            setEditandoInfo(false);
            setToast({ visible: true, mensaje: '¡Portafolio guardado con éxito!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally {
            setGuardandoDatos(false);
        }
    };

    const handleToggleServicio = (id: string) => {
        if (!editandoInfo) return;
        setFormData(prev => {
            const seleccionados = prev.serviciosSeleccionados.includes(id)
                ? prev.serviciosSeleccionados.filter(s => s !== id)
                : [...prev.serviciosSeleccionados, id];
            return { ...prev, serviciosSeleccionados: seleccionados };
        });
    };

    const handleSubirPortada = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setSubiendoPortada(true);
            const actualizado = await subirFotoPortada(e.target.files[0]);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: '¡Portada actualizada!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally {
            setSubiendoPortada(false);
            if (portadaInputRef.current) portadaInputRef.current.value = '';
        }
    };

    const handleSubirAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setSubiendoAvatar(true);
            const actualizado = await subirAvatarUsuario(e.target.files[0]);
            setPortafolio(actualizado);

            if (actualizado.peluquero?.avatar) {
                useAuthStore.setState((state: any) => ({
                    usuario: { ...state.usuario, avatar: actualizado.peluquero.avatar }
                }));
            }

            setToast({ visible: true, mensaje: '¡Foto de perfil actualizada!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally {
            setSubiendoAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleSubirGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setSubiendoGaleria(true);
            const actualizado = await subirImagenGaleria(e.target.files[0]);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: '¡Imagen agregada!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally {
            setSubiendoGaleria(false);
            if (galeriaInputRef.current) galeriaInputRef.current.value = '';
        }
    };

    const handleEliminarImagen = async (public_id: string) => {
        if (!window.confirm('¿Seguro que querés borrar esta foto?')) return;
        try {
            const actualizado = await eliminarImagenGaleria(public_id);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: 'Imagen eliminada', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        }
    };

    // 🔥 Mover imagen de lugar en la galería (Reordenar)
    const handleMoverImagen = async (index: number, direccion: 'izquierda' | 'derecha') => {
        const galeria = [...portafolio.galeria];
        const destino = direccion === 'izquierda' ? index - 1 : index + 1;

        if (destino < 0 || destino >= galeria.length) return;

        // Intercambiamos posiciones
        const temp = galeria[index];
        galeria[index] = galeria[destino];
        galeria[destino] = temp;

        try {
            const actualizado = await actualizarOrdenGaleria(galeria);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: 'Orden actualizado', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        }
    };

    if (cargando) return <div className="flex justify-center h-[60vh]"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

    if (!portafolio) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 relative">
                    <Briefcase className="w-12 h-12 text-orange-500 relative z-10" />
                    <Sparkles className="w-6 h-6 text-orange-400 absolute top-2 right-0 animate-pulse" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Tu Vitrina <span className="text-orange-500">Profesional</span></h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">Creá tu portafolio personalizado para mostrar tus mejores cortes y dejar que los clientes vean tu estilo único.</p>
                <button onClick={handleCrearPortafolio} disabled={creando} className="group flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black text-lg rounded-2xl transition-all disabled:opacity-50">
                    {creando ? 'Creando...' : <><PlusCircle className="w-6 h-6" /> Crear Mi Portafolio Ahora</>}
                </button>
            </div>
        );
    }

    const avatarActual = portafolio.peluquero?.avatar || usuario?.avatar;
    const skillsList = formData.especialidades ? formData.especialidades.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-32">

            {/* 1. HEADER VISUAL */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden relative">
                <div className="h-48 sm:h-64 w-full bg-zinc-950 relative group">
                    {portafolio.fotoPortada ? (
                        <img src={portafolio.fotoPortada} alt="Portada" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                            <ImageIcon className="w-12 h-12 text-zinc-500 mb-2" />
                            <span className="text-sm font-bold text-zinc-500 uppercase">Sin Portada</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" ref={portadaInputRef} onChange={handleSubirPortada} />
                    <button onClick={() => portadaInputRef.current?.click()} disabled={subiendoPortada} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-3 bg-black/80 hover:bg-orange-500 hover:text-black text-white rounded-xl font-bold transition-all disabled:opacity-50 border border-white/10 hover:border-transparent shadow-2xl">
                        {subiendoPortada ? 'Subiendo...' : <><Camera className="w-5 h-5" /> Cambiar Portada</>}
                    </button>
                </div>

                <div className="px-8 pb-8 pt-0 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">

                        {/* AVATAR CLICKEABLE PARA CAMBIAR FOTO DE PERFIL */}
                        <div className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-zinc-900 bg-zinc-800 shadow-2xl overflow-hidden z-10 shrink-0">
                            {avatarActual ? (
                                <img src={avatarActual} alt={usuario?.nombre} className="w-full h-full object-cover" />
                            ) : (
                                <span className="w-full h-full flex items-center justify-center text-4xl font-black text-orange-500">
                                    {usuario?.nombre?.charAt(0)}
                                </span>
                            )}

                            <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleSubirAvatar} />
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={subiendoAvatar}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-xs"
                            >
                                <Camera className="w-6 h-6 text-orange-400" />
                                {subiendoAvatar ? 'Subiendo...' : 'Cambiar Foto'}
                            </button>
                        </div>

                        <div className="text-center sm:text-left flex-1 pb-2">
                            <h1 className="text-3xl font-black text-white">{usuario?.nombre} {usuario?.apellido}</h1>

                            {/* 🔥 SKILLS DINÁMICAS EN EL HEADER */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                {skillsList.length > 0 ? (
                                    skillsList.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs rounded-full uppercase tracking-wider">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Master Barber</span>
                                )}
                            </div>
                        </div>

                        <div className="pb-2">
                            {!editandoInfo ? (
                                <button onClick={() => setEditandoInfo(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all shadow-lg">
                                    <Edit2 className="w-4 h-4" /> Habilitar Edición
                                </button>
                            ) : (
                                <button onClick={() => { setEditandoInfo(false); cargarPortafolio(); }} className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-bold rounded-xl transition-all shadow-lg">
                                    <X className="w-4 h-4" /> Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. COLUMNA IZQUIERDA: INFO & REDES */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6 relative z-10">
                            <AlignLeft className="w-5 h-5 text-orange-500" /> Info & Redes
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tu Biografía</label>
                                <textarea
                                    disabled={!editandoInfo} value={formData.biografiaProfesional} onChange={(e) => setFormData({ ...formData, biografiaProfesional: e.target.value })} rows={4}
                                    placeholder="Contale a los clientes quién sos..."
                                    className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all resize-none ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" /> Horarios de Atención
                                </label>
                                <input
                                    type="text"
                                    disabled={!editandoInfo}
                                    value={formData.horarios}
                                    onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                                    placeholder="Ej: Martes a Sábados: 10:00 - 20:00"
                                    className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Scissors className="w-4 h-4" /> Skills (Separadas por coma)
                                </label>
                                <input
                                    type="text" disabled={!editandoInfo} value={formData.especialidades} onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                                    placeholder="Ej: Fade, Navaja, Color..."
                                    className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Contacto Público</label>
                                <div className="relative">
                                    <AtSign className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${editandoInfo ? 'text-orange-500' : 'text-zinc-600'}`} />
                                    <input
                                        type="text" disabled={!editandoInfo} value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        placeholder="Usuario (Ej: gonza.kathara)"
                                        className={`w-full border rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${editandoInfo ? 'text-orange-500' : 'text-zinc-600'}`} />
                                    <input
                                        type="text" disabled={!editandoInfo} value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        placeholder="WhatsApp (Ej: 5492657123456)"
                                        className={`w-full border rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {editandoInfo && <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>}
                    </div>
                </div>

                {/* 3. COLUMNA DERECHA: GALERÍA DE TRABAJOS CON BOTONES DE REORDENAR */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 h-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-orange-500" /> Galería de Trabajos
                                </h3>
                                <p className="text-sm text-zinc-500 mt-1">Usá las flechas para ordenar tus fotos o eliminalas cuando quieras.</p>
                            </div>
                            <input type="file" accept="image/*" className="hidden" ref={galeriaInputRef} onChange={handleSubirGaleria} />
                            <button onClick={() => galeriaInputRef.current?.click()} disabled={subiendoGaleria} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-black font-bold rounded-xl transition-all border border-orange-500/30 hover:border-transparent disabled:opacity-50">
                                {subiendoGaleria ? 'Subiendo...' : <><Upload className="w-4 h-4" /> Agregar Foto</>}
                            </button>
                        </div>

                        {portafolio.galeria && portafolio.galeria.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-[150px] sm:auto-rows-[200px]">
                                {portafolio.galeria.map((foto: any, i: number) => (
                                    <div key={foto.public_id} className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                        <img src={foto.url} alt="Corte" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                        {/* Overlay con botones de reordenar y eliminar */}
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-xs">

                                            {/* Botones de orden (Izquierda / Derecha) */}
                                            <div className="flex items-center gap-2 bg-zinc-900/90 border border-white/10 rounded-xl p-1 shadow-lg">
                                                <button
                                                    onClick={() => handleMoverImagen(i, 'izquierda')}
                                                    disabled={i === 0}
                                                    className="p-2 text-white hover:text-orange-400 disabled:opacity-30 transition-colors"
                                                    title="Mover a la izquierda"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <span className="text-xs font-bold text-zinc-400">{i + 1}</span>
                                                <button
                                                    onClick={() => handleMoverImagen(i, 'derecha')}
                                                    disabled={i === portafolio.galeria.length - 1}
                                                    className="p-2 text-white hover:text-orange-400 disabled:opacity-30 transition-colors"
                                                    title="Mover a la derecha"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Botón de borrar */}
                                            <button
                                                onClick={() => handleEliminarImagen(foto.public_id)}
                                                className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-transform hover:scale-110 shadow-lg shadow-red-500/20"
                                                title="Eliminar foto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-black/30 rounded-2xl border border-white/5 border-dashed">
                                <Camera className="w-12 h-12 text-zinc-700 mb-4" />
                                <h4 className="text-white font-bold mb-1">Tu galería está vacía</h4>
                                <p className="text-zinc-500 text-sm text-center max-w-sm">Subí tu primer foto para que los clientes puedan ver la calidad de tus cortes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. STRIP DE SERVICIOS HABILITADOS */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
                <div className="mb-8">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-orange-500" /> Especialidad & Servicios
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                        Seleccioná exactamente qué trabajos realizás. Esto filtrará las opciones cuando un cliente intente sacar turno con vos.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {serviciosDisponibles.map(servicio => {
                        const seleccionado = formData.serviciosSeleccionados.includes(servicio.id);
                        return (
                            <div
                                key={servicio.id}
                                onClick={() => handleToggleServicio(servicio.id)}
                                className={`relative overflow-hidden group flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 ${seleccionado
                                        ? 'bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                                        : 'bg-zinc-950 border-white/5 hover:border-white/10 hover:bg-zinc-800'
                                    } ${!editandoInfo ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${seleccionado ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/40' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                    <Scissors className="w-5 h-5" />
                                </div>

                                <span className={`text-sm font-bold text-center leading-tight transition-colors ${seleccionado ? 'text-orange-400' : 'text-zinc-400 group-hover:text-white'}`}>
                                    {servicio.nombre}
                                </span>

                                {seleccionado && (
                                    <div className="absolute top-3 right-3 text-orange-500">
                                        <CheckCircle2 className="w-5 h-5 fill-black" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 5. BOTÓN GIGANTE DE GUARDADO FLOTANTE */}
            {editandoInfo && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={handleGuardarDatos}
                        disabled={guardandoDatos}
                        className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-lg rounded-full transition-all shadow-[0_10px_40px_rgba(249,115,22,0.4)] hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className="w-6 h-6" />
                        {guardandoDatos ? 'Guardando...' : 'GUARDAR PORTAFOLIO'}
                    </button>
                </div>
            )}

            <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
        </div>
    );
}