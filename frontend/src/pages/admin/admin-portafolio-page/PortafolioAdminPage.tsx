import React, { useState, useEffect } from 'react';
import { Briefcase, PlusCircle, Sparkles, Save } from 'lucide-react';
import {
    obtenerMiPortafolio,
    crearMiPortafolio,
    actualizarDatosPortafolio,
    subirFotoPortada,
    subirImagenGaleria,
    eliminarImagenGaleria,
    subirAvatarUsuario
} from '../../../services/portafolioService';
import { useAuthStore } from '../../../store/authStore';
import { Toast } from '../../../components/ui/Toast';

// IMPORTAMOS TUS NUEVOS COMPONENTES:
import PortafolioHeader from './PortafolioHeader';
import PortafolioInfoRedes from './PortafolioInfoRedes';
import PortafolioGaleria from './PortafolioGaleria';
import PortafolioServicios from './PortafolioServicios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function PortafolioAdminPage() {
    const { usuario } = useAuthStore();
    const [portafolio, setPortafolio] = useState<any>(null);
    const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);

    const [cargando, setCargando] = useState(true);
    const [creando, setCreando] = useState(false);
    const [guardandoDatos, setGuardandoDatos] = useState(false);
    const [subiendoPortada, setSubiendoPortada] = useState(false);
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const [subiendoGaleria, setSubiendoGaleria] = useState(false);

    const [editandoInfo, setEditandoInfo] = useState(false);
    const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });

    const [formData, setFormData] = useState({
        tituloProfesional: '',
        biografiaProfesional: '',
        instagram: '',
        whatsapp: '',
        especialidades: '',
        horarios: '',
        serviciosSeleccionados: [] as string[]
    });

    useEffect(() => {
        cargarPortafolio();
        cargarServicios();
    }, []);

    const cargarServicios = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/api/servicios`);
            if (respuesta.ok) {
                const data = await respuesta.json();
                setServiciosDisponibles(data.servicios || data || []);
            }
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
        }
    };

    const cargarPortafolio = async () => {
        try {
            setCargando(true);
            const data = await obtenerMiPortafolio();
            if (data) {
                setPortafolio(data);
                const skillsArray = data.especialidades && data.especialidades.length > 0
                    ? data.especialidades : (data.peluquero?.especialidades || []);

                setFormData({
                    tituloProfesional: data.peluquero?.tituloProfesional || (usuario as any)?.tituloProfesional || 'Estilista',
                    biografiaProfesional: data.biografiaProfesional || '',
                    instagram: data.redesProfesionales?.instagram || '',
                    whatsapp: data.peluquero?.telefono || data.redesProfesionales?.whatsapp || usuario?.telefono || '',
                    especialidades: skillsArray.join(', '),
                    horarios: data.horarios || '',
                    serviciosSeleccionados: data.serviciosQueRealiza || []
                });

                if (data.peluquero?.avatar) {
                    useAuthStore.setState((state: any) => ({
                        usuario: {
                            ...state.usuario,
                            avatar: data.peluquero.avatar,
                            telefono: data.peluquero.telefono,
                            tituloProfesional: data.peluquero.tituloProfesional
                        }
                    }));
                }
            }
        } catch (error) {
            console.error("Error al cargar portafolio", error);
        } finally {
            setCargando(false);
        }
    };

    // ... (Mantienes tus handlers de guardar datos, crear portafolio, y subida de imagenes. Extraje el logica fuerte a los componentes)
    // Dejo los handlers originales acá:
    const handleCrearPortafolio = async () => { /* tu logica */ };

    const handleGuardarDatos = async () => {
        try {
            setGuardandoDatos(true);
            const datos = {
                tituloProfesional: formData.tituloProfesional,
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
                    ...state.usuario, telefono: formData.whatsapp,
                    especialidades: datos.especialidades, tituloProfesional: formData.tituloProfesional
                }
            }));
            setEditandoInfo(false);
            setToast({ visible: true, mensaje: '¡Portafolio guardado con éxito!', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
        } finally { setGuardandoDatos(false); }
    };

    const handleToggleServicio = (id: string) => {
        if (!editandoInfo) return;
        setFormData(prev => {
            const seleccionados = prev.serviciosSeleccionados.includes(id)
                ? prev.serviciosSeleccionados.filter(s => s !== id) : [...prev.serviciosSeleccionados, id];
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
        } catch (error: any) { setToast({ visible: true, mensaje: error.message, tipo: 'error' }); }
        finally { setSubiendoPortada(false); }
    };

    const handleSubirAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setSubiendoAvatar(true);
            const actualizado = await subirAvatarUsuario(e.target.files[0]);
            setPortafolio(actualizado);
            if (actualizado.peluquero?.avatar) {
                useAuthStore.setState((state: any) => ({ usuario: { ...state.usuario, avatar: actualizado.peluquero.avatar } }));
            }
            setToast({ visible: true, mensaje: '¡Foto de perfil actualizada!', tipo: 'success' });
        } catch (error: any) { setToast({ visible: true, mensaje: error.message, tipo: 'error' }); }
        finally { setSubiendoAvatar(false); }
    };

    const handleSubirGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setSubiendoGaleria(true);
            const actualizado = await subirImagenGaleria(e.target.files[0]);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: '¡Imagen agregada!', tipo: 'success' });
        } catch (error: any) { setToast({ visible: true, mensaje: error.message, tipo: 'error' }); }
        finally { setSubiendoGaleria(false); }
    };

    const handleEliminarImagen = async (public_id: string) => {
        if (!window.confirm('¿Seguro que querés borrar esta foto?')) return;
        try {
            const actualizado = await eliminarImagenGaleria(public_id);
            setPortafolio(actualizado);
            setToast({ visible: true, mensaje: 'Imagen eliminada', tipo: 'success' });
        } catch (error: any) { setToast({ visible: true, mensaje: error.message, tipo: 'error' }); }
    };

    if (cargando) return <div className="flex flex-col items-center justify-center h-[100vh]"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

    if (!portafolio) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                {/* TU ESTADO EMPTY DE ANTES ACA */}
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Tu Vitrina <span className="text-orange-500">Profesional</span></h1>
                <button onClick={handleCrearPortafolio} disabled={creando} className="group flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black text-lg rounded-2xl transition-all disabled:opacity-50">
                    {creando ? 'Creando...' : <><PlusCircle className="w-6 h-6" /> Crear Mi Portafolio Ahora</>}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-32">

            <PortafolioHeader
                portafolio={portafolio} usuario={usuario} formData={formData}
                editandoInfo={editandoInfo} setEditandoInfo={setEditandoInfo}
                cargarPortafolio={cargarPortafolio}
                subiendoPortada={subiendoPortada} handleSubirPortada={handleSubirPortada}
                subiendoAvatar={subiendoAvatar} handleSubirAvatar={handleSubirAvatar}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <PortafolioInfoRedes
                        formData={formData} setFormData={setFormData} editandoInfo={editandoInfo}
                    />
                </div>

                <div className="lg:col-span-2">
                    <PortafolioGaleria
                        portafolio={portafolio} setPortafolio={setPortafolio} editandoInfo={editandoInfo}
                        subiendoGaleria={subiendoGaleria} handleSubirGaleria={handleSubirGaleria}
                        handleEliminarImagen={handleEliminarImagen} setToast={setToast}
                        cargarPortafolio={cargarPortafolio}
                    />
                </div>
            </div>

            <PortafolioServicios
                serviciosDisponibles={serviciosDisponibles} formData={formData}
                handleToggleServicio={handleToggleServicio} editandoInfo={editandoInfo}
            />

            {editandoInfo && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={handleGuardarDatos} disabled={guardandoDatos}
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