import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Scissors, Clock, BadgeCheck, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { obtenerPortafolioPublico } from '../../services/portafolioService';

const PortafolioBarberoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const [portafolio, setPortafolio] = useState<any>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    // 🔥 ESTADOS PARA EL SLIDER PÚBLICO
    const [paginaGaleria, setPaginaGaleria] = useState(0);
    const FOTOS_POR_PAGINA = 5;

    useEffect(() => {
        if (id) {
            cargarDatosPublicos(id);
        }
    }, [id]);

    const cargarDatosPublicos = async (peluqueroId: string) => {
        try {
            setCargando(true);
            const data = await obtenerPortafolioPublico(peluqueroId);
            setPortafolio(data);
        } catch (err) {
            console.error("Error cargando portafolio público:", err);
            setError(true);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !portafolio) {
        return <Navigate to="/servicios" replace />;
    }

    // Datos del barbero poblados desde el backend
    const barbero = portafolio.peluquero || {};
    const nombreCompleto = `${barbero.nombre || 'Profesional'} ${barbero.apellido || ''}`;
    
    const avatar = barbero.avatar || portafolio.avatar || '';
    const portada = portafolio.fotoPortada || '';
    const biografia = portafolio.biografiaProfesional || 'Sin biografía profesional cargada aún.';
    const tituloProfesional = barbero.tituloProfesional || portafolio.rol || 'Estilista Profesional';
    
    const especialidades = portafolio.especialidades && portafolio.especialidades.length > 0 
        ? portafolio.especialidades 
        : (barbero.especialidades || ['Corte de Autor']);

    const horarios = portafolio.horarios || 'Martes a Sábados: 10:00 - 20:00';
    const whatsapp = portafolio.redesProfesionales?.whatsapp || barbero.telefono || '';
    const instagram = portafolio.redesProfesionales?.instagram || '';
    const galeria = portafolio.galeria || [];

    // LÓGICA DEL SLIDER
    const totalPaginas = Math.ceil(galeria.length / FOTOS_POR_PAGINA);
    const fotosMostradas = galeria.slice(paginaGaleria * FOTOS_POR_PAGINA, (paginaGaleria + 1) * FOTOS_POR_PAGINA);

    return (
        <div className="min-h-screen bg-[#09090B] text-white animate-fadeIn">

            {/* PORTADA CON DEGRADADO PREMIUM */}
            <div className="relative h-[22rem] w-full overflow-hidden bg-zinc-950">
                {portada ? (
                    <img src={portada} alt="Portada" className="w-full h-full object-cover opacity-50" />
                ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-sm">Sin Portada</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent"></div>
            </div>

            <main className="max-w-5xl mx-auto px-6 -mt-32 relative z-10 pb-24">

                {/* AVATAR + NOMBRE VERIFICADO */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-10">
                    <div className="w-40 h-40 rounded-3xl border-4 border-[#09090B] bg-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden shrink-0 flex items-center justify-center">
                        {avatar ? (
                            <img src={avatar} alt={nombreCompleto} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-black text-orange-500">
                                {barbero.nombre ? barbero.nombre.charAt(0) : 'K'}
                            </span>
                        )}
                    </div>
                    <div className="text-center sm:text-left pb-3">
                        <h1 className="text-4xl font-black flex items-center justify-center sm:justify-start gap-3">
                            {nombreCompleto}
                            <BadgeCheck className="w-7 h-7 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"  />
                        </h1>
                        <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mt-1">{tituloProfesional}</p>
                    </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                    <div className="md:col-span-2 space-y-8">
                        {/* Biografía con formato editorial */}
                        <div className="pl-5 border-l-2 border-orange-500/50">
                            <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-line font-medium">
                                {biografia}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-black text-white text-sm flex items-center gap-2 uppercase tracking-widest">
                                <Scissors className="w-4 h-4 text-orange-500" /> Especialidades Técnicas
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {especialidades.map((e: string, idx: number) => (
                                    <span key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 backdrop-blur-sm">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 space-y-3 shadow-xl">
                            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">Horario de Atención</span>
                            </div>
                            <p className="text-sm font-medium text-zinc-200">{horarios}</p>
                        </div>

                        {/* BOTONES SOCIALES ESTILIZADOS */}
                        <div className="flex gap-3">
                            {whatsapp && (
                                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-4 bg-zinc-900 hover:bg-green-600 border border-white/5 hover:border-transparent rounded-2xl transition-all group" title="Contactar por WhatsApp">
                                    <svg className="w-5 h-5 fill-zinc-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.955c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.005 0C5.37 0 .002 5.368.002 12.006c0 2.093.548 4.136 1.594 5.932L.007 23.997l6.236-1.638a11.82 11.82 0 0 0 5.765 1.467h.004c6.635 0 12.003-5.368 12.003-12.005 0-3.211-1.248-6.238-3.518-8.508" /></svg>
                                </a>
                            )}
                            {instagram && (
                                <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-4 bg-zinc-900 hover:bg-gradient-to-tr hover:from-pink-600 hover:to-orange-500 border border-white/5 hover:border-transparent rounded-2xl transition-all group" title="Ver Instagram">
                                    <svg className="w-5 h-5 fill-zinc-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* BENTO COLLAGE DE FOTOS + SLIDER */}
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-white mb-6">Galería de Trabajos</h3>
                    {galeria.length > 0 ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                                {fotosMostradas.map((foto: any, i: number) => {
                                    // La primera imagen toma un espacio 2x2 para el look Bento
                                    const isMainImage = i === 0;
                                    return (
                                        <div key={foto.public_id || i} className={`group overflow-hidden rounded-3xl border border-white/5 bg-zinc-950 shadow-lg ${isMainImage ? 'col-span-2 row-span-2' : ''}`}>
                                            <img src={foto.url} alt="Trabajo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CONTROLES DEL SLIDER (Si hay más de 5 fotos) */}
                            {totalPaginas > 1 && (
                                <div className="flex items-center justify-center gap-6 pt-4">
                                    <button onClick={() => setPaginaGaleria(p => Math.max(p - 1, 0))} disabled={paginaGaleria === 0} className="p-3 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all shadow-lg">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPaginas }).map((_, i) => (
                                            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${paginaGaleria === i ? 'bg-orange-500 w-8 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-zinc-800 w-2'}`} />
                                        ))}
                                    </div>

                                    <button onClick={() => setPaginaGaleria(p => Math.min(p + 1, totalPaginas - 1))} disabled={paginaGaleria === totalPaginas - 1} className="p-3 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all shadow-lg">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-16 text-center bg-zinc-900/30 rounded-[2rem] border border-white/5 border-dashed">
                            <Scissors className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium">Este profesional aún no cargó fotos en su galería.</p>
                        </div>
                    )}
                </div>

                {/* BANNER FINAL PREMIUM (GLASSMORPHISM) */}
                <div className="mt-24 relative overflow-hidden bg-zinc-900 border border-white/5 rounded-[2rem] p-10 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
                    {/* Brillo de fondo */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/20 blur-[100px] pointer-events-none rounded-full"></div>
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                            <Calendar className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">¿Listo para un cambio?</h2>
                            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">Asegurá tu lugar y experimentá un servicio de primer nivel diseñado exclusivamente para vos.</p>
                        </div>
                    </div>

                    <Link 
                        to={`/reservar?peluquero=${id}`} 
                        className="relative z-10 group px-8 py-4 bg-orange-500 text-black rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)] flex items-center gap-3 whitespace-nowrap"
                    >
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Agendar Turno
                    </Link>
                </div>

            </main>
        </div>
    );
};

export default PortafolioBarberoPage;