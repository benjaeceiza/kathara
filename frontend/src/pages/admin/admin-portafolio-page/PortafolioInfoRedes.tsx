import React, { useState } from 'react';
import { AlignLeft, AtSign, Phone, Scissors, Clock, Star, ChevronDown } from 'lucide-react';

export default function PortafolioInfoRedes({ formData, setFormData, editandoInfo }: any) {
    const [mostrarHorarios, setMostrarHorarios] = useState(false);
    
    // 🔥 LÓGICA DE TURNO CORTADO 🔥
    const handleTipoJornadaChange = (index: number, esCortado: boolean) => {
        const nuevosHorarios = [...formData.horarios];
        const h = nuevosHorarios[index];
        h.turnoCortado = esCortado;
        
        // Si elige cortado, le precargamos horas típicas de acá (siesta de por medio)
        if (esCortado) {
            h.horaInicio = '09:00';
            h.horaFin = '13:00';
            h.horaInicio2 = '16:00';
            h.horaFin2 = '21:00';
        } else {
            h.horaInicio = '09:00';
            h.horaFin = '21:00';
        }
        setFormData({ ...formData, horarios: nuevosHorarios });
    };

    const handleHorarioChange = (index: number, campo: string, valor: any) => {
        const nuevosHorarios = [...formData.horarios];
        nuevosHorarios[index] = { ...nuevosHorarios[index], [campo]: valor };
        setFormData({ ...formData, horarios: nuevosHorarios });
    };

    const handleHorarioActivoChange = (index: number, valor: boolean) => {
        const nuevosHorarios = [...formData.horarios];
        nuevosHorarios[index] = { ...nuevosHorarios[index], activo: valor };
        setFormData({ ...formData, horarios: nuevosHorarios });
    };

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6 relative z-10">
                <AlignLeft className="w-5 h-5 text-orange-500" /> Info & Redes
            </h3>

            <div className="space-y-6 relative z-10">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" /> Título Profesional
                    </label>
                    <input
                        type="text" disabled={!editandoInfo} value={formData.tituloProfesional} onChange={(e) => setFormData({ ...formData, tituloProfesional: e.target.value })}
                        placeholder="Ej: Estilista, Barbero, Colorista"
                        className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tu Biografía</label>
                    <textarea
                        disabled={!editandoInfo} value={formData.biografiaProfesional} onChange={(e) => setFormData({ ...formData, biografiaProfesional: e.target.value })} rows={4}
                        placeholder="Contale a los clientes quién sos..."
                        className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all resize-none ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                    />
                </div>

                {/* HORARIOS DE ATENCIÓN (CORTADO / CORRIDO) */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" /> Horarios de Atención
                    </label>
                    
                    <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setMostrarHorarios(!mostrarHorarios)}
                            className="w-full flex items-center justify-between p-4 text-sm font-bold text-white hover:bg-white/5 transition-colors"
                        >
                            <span className="text-zinc-300 flex items-center gap-2">
                                Configurar Turnos
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mostrarHorarios ? 'rotate-180 text-orange-500' : 'text-zinc-500'}`} />
                        </button>

                        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${mostrarHorarios ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="p-2 border-t border-white/5 bg-zinc-950/50">
                                    <div className="flex flex-col gap-2">
                                        {Array.isArray(formData.horarios) && formData.horarios.map((horario: any, index: number) => (
                                            <div key={horario.dia} className={`flex flex-col py-3 px-3 rounded-xl border transition-all ${horario.activo ? 'bg-zinc-800/80 border-orange-500/30 shadow-md' : 'bg-transparent border-transparent opacity-50'} ${!editandoInfo ? 'pointer-events-none' : ''}`}>
                                                
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer scale-[0.8] origin-left">
                                                        <input 
                                                            type="checkbox" className="sr-only peer" 
                                                            checked={horario.activo} 
                                                            onChange={(e) => handleHorarioActivoChange(index, e.target.checked)} 
                                                            disabled={!editandoInfo} 
                                                        />
                                                        <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                                                    </label>
                                                    <span className={`text-xs font-bold ${horario.activo ? 'text-white' : 'text-zinc-500'}`}>
                                                        {horario.dia}
                                                    </span>
                                                </div>

                                                {horario.activo && (
                                                    <div className="flex flex-col gap-3 mt-3 p-3 bg-black/30 rounded-xl border border-white/5">
                                                        
                                                        {/* Selector Tipo de Jornada */}
                                                        <div className="flex bg-black p-1 rounded-lg">
                                                            <button 
                                                                type="button" disabled={!editandoInfo}
                                                                onClick={() => handleTipoJornadaChange(index, false)}
                                                                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${!horario.turnoCortado ? 'bg-orange-500 text-black shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                De Corrido
                                                            </button>
                                                            <button 
                                                                type="button" disabled={!editandoInfo}
                                                                onClick={() => handleTipoJornadaChange(index, true)}
                                                                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${horario.turnoCortado ? 'bg-orange-500 text-black shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                Turno Cortado
                                                            </button>
                                                        </div>

                                                        {/* Inputs según selección */}
                                                        {!horario.turnoCortado ? (
                                                            <div className="flex items-center justify-between bg-zinc-950/80 border border-white/5 rounded-lg px-3 py-2">
                                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Horario</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <input type="time" disabled={!editandoInfo} value={horario.horaInicio || '09:00'} onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                    <span className="text-zinc-600 text-[10px] font-bold">a</span>
                                                                    <input type="time" disabled={!editandoInfo} value={horario.horaFin || '21:00'} onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between bg-zinc-950/80 border border-white/5 rounded-lg px-3 py-2">
                                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">1er Turno</span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <input type="time" disabled={!editandoInfo} value={horario.horaInicio || '09:00'} onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                        <span className="text-zinc-600 text-[10px] font-bold">a</span>
                                                                        <input type="time" disabled={!editandoInfo} value={horario.horaFin || '13:00'} onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between bg-zinc-950/80 border border-white/5 rounded-lg px-3 py-2">
                                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">2do Turno</span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <input type="time" disabled={!editandoInfo} value={horario.horaInicio2 || '16:00'} onChange={(e) => handleHorarioChange(index, 'horaInicio2', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                        <span className="text-zinc-600 text-[10px] font-bold">a</span>
                                                                        <input type="time" disabled={!editandoInfo} value={horario.horaFin2 || '21:00'} onChange={(e) => handleHorarioChange(index, 'horaFin2', e.target.value)} className="bg-zinc-900 border border-transparent focus:border-orange-500 rounded-md px-1.5 py-1 text-[11px] font-medium text-white focus:outline-none transition-colors" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2 mt-4">
                        <Scissors className="w-4 h-4" /> Skills (Técnicas)
                    </label>
                    <input
                        type="text" disabled={!editandoInfo} value={formData.especialidades} onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                        placeholder="Ej: Fade, Navaja, Colorimetría..."
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
        </div>
    );
}