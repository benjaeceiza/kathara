import React from 'react';
import { CheckCircle2, Scissors } from 'lucide-react';

export default function PortafolioServicios({ serviciosDisponibles, formData, handleToggleServicio, editandoInfo }: any) {
    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
            <div className="mb-8">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" /> Especialidad & Servicios
                </h3>
                <p className="text-sm text-zinc-400 mt-1">Seleccioná exactamente qué trabajos realizás para filtrarte en las reservas.</p>
            </div>
            {serviciosDisponibles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {serviciosDisponibles.map((servicio: any) => {
                        const seleccionado = formData.serviciosSeleccionados.includes(servicio._id);
                        return (
                            <div
                                key={servicio._id} onClick={() => handleToggleServicio(servicio._id)}
                                className={`relative overflow-hidden group flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 ${seleccionado ? 'bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'bg-zinc-950 border-white/5 hover:border-white/10 hover:bg-zinc-800'} ${!editandoInfo ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${seleccionado ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/40' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                    <Scissors className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-bold text-center leading-tight transition-colors ${seleccionado ? 'text-orange-400' : 'text-zinc-400 group-hover:text-white'}`}>{servicio.nombre}</span>
                                {seleccionado && <div className="absolute top-3 right-3 text-orange-500"><CheckCircle2 className="w-5 h-5 fill-black" /></div>}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-zinc-500 text-sm mt-4 italic">No hay servicios cargados en el sistema todavía.</p>
            )}
        </div>
    );
}