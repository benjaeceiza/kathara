import React, { useRef } from 'react';
import { Camera, Edit2, X, ImageIcon } from 'lucide-react';

export default function PortafolioHeader({
    portafolio,
    usuario,
    formData,
    editandoInfo,
    setEditandoInfo,
    cargarPortafolio,
    subiendoPortada,
    handleSubirPortada,
    subiendoAvatar,
    handleSubirAvatar
}: any) {
    const portadaInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const avatarActual = portafolio?.peluquero?.avatar || usuario?.avatar;
    const skillsList = formData.especialidades ? formData.especialidades.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="h-48 sm:h-64 w-full bg-zinc-950 relative group">
                {portafolio?.fotoPortada ? (
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
                        <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mt-1">{formData.tituloProfesional || 'Profesional'}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                            {skillsList.map((skill: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs rounded-xl">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pb-2">
                        {!editandoInfo ? (
                            <button onClick={() => setEditandoInfo(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all shadow-lg">
                                <Edit2 className="w-4 h-4" /> Editar Perfil
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
    );
}