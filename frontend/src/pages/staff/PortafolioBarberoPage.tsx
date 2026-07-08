
import { useParams, Link, Navigate } from 'react-router-dom';
import { Scissors, Zap, Calendar, CheckCircle2, Clock } from 'lucide-react';
import imgGonza from "../../assets/gonza.png";

const PortafolioBarberoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Mock de datos (Después los traemos desde MongoDB)
    const barbero = {
        id: "ST-1",
        nombre: "Gonza Silvani",
        apodo: "Negro",
        rol: "Director & Master Barber",
        avatar: imgGonza,
        portada: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1600&auto=format&fit=crop",
        bio: "Fundador de Kathara. Transformo el corte de pelo en una experiencia de autor. Especialista en la precisión del acero sobre la piel.",
        especialidades: ["Skin Fade", "Navaja", "Tijera Avanzada", "Barba Ritual"],
        horarios: "Martes a Sábados: 10:00 - 20:00",
        instagram: "gonza.kathara",
        whatsapp: "5492657123456",
        trabajos: [
            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517832606708-83152ba9843c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
        ]
    };

    if (!barbero) return <Navigate to="/servicios" replace />;

    return (
        <div className="min-h-screen bg-[#09090B] text-white animate-fadeIn">

            {/* PORTADA */}
            <div className="relative h-72 w-full overflow-hidden">
                <img src={barbero.portada} alt="Portada" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent"></div>
            </div>

            <main className="max-w-5xl mx-auto px-6 -mt-24 relative z-10 pb-20">

                {/* AVATAR + NOMBRE */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
                    <div className="w-36 h-36 rounded-3xl border-4 border-[#09090B] bg-zinc-800 shadow-2xl overflow-hidden">
                        <img src={barbero.avatar} alt={barbero.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center sm:text-left pb-2">
                        <h1 className="text-3xl font-black">{barbero.nombre}</h1>
                        <p className="text-orange-500 font-bold uppercase tracking-widest text-xs">{barbero.rol}</p>
                    </div>
                </div>

                {/* INFO GRID (Bio, Esp, Horarios, Botones) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                    <div className="md:col-span-2 space-y-6">
                        <p className="text-zinc-400 leading-relaxed text-sm">{barbero.bio}</p>

                        <div className="space-y-4">
                            <h4 className="font-black text-white text-sm">Especialidades</h4>
                            <div className="flex flex-wrap gap-2">
                                {barbero.especialidades.map(e => (
                                    <span key={e} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs font-bold text-zinc-300">{e}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold uppercase">Horarios</span>
                            </div>
                            <p className="text-sm font-medium">{barbero.horarios}</p>
                        </div>

                        {/* BOTONES SOCIALES PERSONALIZADOS */}
                        <div className="flex gap-3">
                            <a href={`https://wa.me/${barbero.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center py-3 bg-green-600 hover:bg-green-500 rounded-xl transition-all">
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.955c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.005 0C5.37 0 .002 5.368.002 12.006c0 2.093.548 4.136 1.594 5.932L.007 23.997l6.236-1.638a11.82 11.82 0 0 0 5.765 1.467h.004c6.635 0 12.003-5.368 12.003-12.005 0-3.211-1.248-6.238-3.518-8.508" /></svg>
                            </a>
                            <a href={`https://instagram.com/${barbero.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl transition-all">
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* BENTO COLLAGE DE FOTOS (Estilo editorial) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {barbero.trabajos.map((foto, i) => (
                        <div key={i} className={`group overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                            <img src={foto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                    ))}
                </div>

                {/* BANNER FINAL */}
                <div className="mt-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-black">
                    <h2 className="text-2xl font-black">¿Listo para un corte de autor?</h2>
                    <Link to={`/reservar?peluquero=${encodeURIComponent(barbero.nombre)}`} className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-900 transition-all">
                        Reservar Turno
                    </Link>
                </div>

            </main>
        </div>
    );
};

export default PortafolioBarberoPage;