import React from 'react';
import { AlignLeft, AtSign, Phone, Scissors, Clock, Star } from 'lucide-react';

export default function PortafolioInfoRedes({ formData, setFormData, editandoInfo }: any) {
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

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" /> Horarios de Atención
                    </label>
                    <input
                        type="text" disabled={!editandoInfo} value={formData.horarios} onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                        placeholder="Ej: Martes a Sábados: 10:00 - 20:00"
                        className={`w-full border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all ${editandoInfo ? 'bg-black border-white/10 focus:border-orange-500' : 'bg-black/50 border-white/5 text-zinc-400 cursor-not-allowed'}`}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
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