import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Layout, Save, Loader2, UploadCloud } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { getApariencia, actualizarApariencia, subirFondoBackend } from '../../../services/apariencia.service';

export const AparienciaAdminPage: React.FC = () => {
    const { token } = useAuthStore();

    const [formData, setFormData] = useState({ fondoHero: '', fondoGeneral: '' });
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [subiendoHero, setSubiendoHero] = useState(false);
    const [subiendoGeneral, setSubiendoGeneral] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await getApariencia();
                setFormData({
                    fondoHero: data.fondoHero || '',
                    fondoGeneral: data.fondoGeneral || ''
                });
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    // 🔥 AHORA LE PEGAMOS A TU BACKEND DIRECTAMENTE
    const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'hero' | 'general') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (tipo === 'hero') setSubiendoHero(true);
        else setSubiendoGeneral(true);

        try {
            // 🔥 LE PASAMOS EL TIPO AL SERVICIO PARA QUE VIAJE AL BACKEND
            const secureUrl = await subirFondoBackend(file, tipo, token!);

            if (tipo === 'hero') {
                setFormData({ ...formData, fondoHero: secureUrl });
            } else {
                setFormData({ ...formData, fondoGeneral: secureUrl });
            }
        } catch (error: any) {
            alert(`Error al subir imagen: ${error.message}`);
        } finally {
            if (tipo === 'hero') setSubiendoHero(false);
            else setSubiendoGeneral(false);
        }
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await actualizarApariencia(formData, token!);
            alert("¡Diseño actualizado con éxito!");
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-24">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Layout className="w-8 h-8 text-orange-500" /> Personalización.
                </h1>
                <p className="text-zinc-400 mt-1">Configurá las imágenes y fondos principales de tu web.</p>
            </div>

            <form onSubmit={handleGuardar} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="space-y-6">
                    {/* FONDO HERO */}
                    <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                            <ImageIcon className="w-5 h-5 text-orange-500" /> Portada Principal (Hero)
                        </h3>
                        <p className="text-xs text-zinc-500 mb-4">Subí la imagen que los clientes verán apenas entren a la web. Ideal: imagen apaisada y oscura.</p>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-orange-500/50 hover:bg-white/5 transition-all cursor-pointer relative">
                            {subiendoHero ? (
                                <div className="flex flex-col items-center text-orange-500">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Subiendo...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-400 group">
                                    <UploadCloud className="w-8 h-8 mb-2 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-sm font-bold">Clic para seleccionar imagen</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleSubirImagen(e, 'hero')}
                                disabled={subiendoHero}
                            />
                        </label>
                        {formData.fondoHero && (
                            <p className="text-[10px] text-green-500 mt-3 flex items-center gap-1 font-bold">
                                ✅ Imagen cargada lista para guardar
                            </p>
                        )}
                    </div>

                    {/* FONDO GENERAL */}
                    <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                            <ImageIcon className="w-5 h-5 text-orange-500" /> Fondo General
                        </h3>
                        <p className="text-xs text-zinc-500 mb-4">Subí un patrón o textura. Si preferís un color sólido, podés pegar el código HEX acá abajo.</p>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-orange-500/50 hover:bg-white/5 transition-all cursor-pointer relative mb-4">
                            {subiendoGeneral ? (
                                <div className="flex flex-col items-center text-orange-500">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Subiendo...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-400 group">
                                    <UploadCloud className="w-8 h-8 mb-2 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-sm font-bold">Clic para subir textura</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleSubirImagen(e, 'general')}
                                disabled={subiendoGeneral}
                            />
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">O color HEX:</span>
                            <input
                                type="text"
                                value={formData.fondoGeneral}
                                onChange={(e) => setFormData({ ...formData, fondoGeneral: e.target.value })}
                                placeholder="#09090B"
                                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-24 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={guardando || subiendoHero || subiendoGeneral}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {guardando ? <><Loader2 className="w-5 h-5 animate-spin" /> Actualizando...</> : <><Save className="w-5 h-5" /> Guardar Cambios</>}
                    </button>
                </div>

                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden relative min-h-[400px] shadow-2xl flex flex-col items-center justify-center">
                    <div
                        className="absolute inset-0 z-0 opacity-50 transition-all duration-500"
                        style={{
                            background: formData.fondoGeneral?.startsWith('http') ? `url(${formData.fondoGeneral}) center/cover fixed` : formData.fondoGeneral || '#09090B'
                        }}
                    ></div>

                    <div className="relative z-10 w-[80%] max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl mt-8 transition-all duration-500">
                        <div
                            className="h-48 bg-zinc-800 flex items-center justify-center transition-all duration-500"
                            style={{
                                background: formData.fondoHero ? `url(${formData.fondoHero}) center/cover` : '#27272a'
                            }}
                        >
                            {!formData.fondoHero && <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">Sin Portada</span>}
                        </div>
                        <div className="p-4 bg-zinc-900/90 backdrop-blur-md text-center">
                            <h4 className="text-white font-black text-xl">Kathara Barber</h4>
                            <p className="text-zinc-500 text-xs mt-1">Vista Previa</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};