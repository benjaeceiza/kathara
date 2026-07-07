
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const ReviewsSection: React.FC = () => {
    const reseñas = [
        {
            id: 1,
            nombre: "Agustín 'Tincho' Peralta",
            fecha: "Hace 2 días",
            texto: "La mejor barbería de la ciudad por escándalo. Mateo me entendió el corte al segundo y el ritual de barba con toalla caliente es un viaje de ida. No los cambio más.",
            corte: "Skin Fade + Perfilado de Barba",
            estrellas: 5
        },
        {
            id: 2,
            nombre: "Ramiro Domínguez",
            fecha: "Hace 1 semana",
            texto: "Excelente atención y puntualidad. Reservé por la web, llegué y me senté directo sin esperar ni 5 minutos. Te reciben con un café o una cerveza bien fría. 10/10.",
            corte: "Taper Fade & Texturizado",
            estrellas: 5
        },
        {
            id: 3,
            nombre: "Facundo Gómez",
            fecha: "Hace 2 semanas",
            texto: "El lugar tiene una estética increíble y la música está buenísima. Lucas es un artesano con la tijera. Vale cada peso invertido en la imagen de uno.",
            corte: "Corte Clásico a Tijera",
            estrellas: 5
        }
    ];

    return (
        <section className="py-10 border-t border-white/5">
            {/* Encabezado */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-widest mb-3">
                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span>Google Reviews ★ 4.9 / 5.0</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                    Lo que dicen en la calle.
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                    Más de 500 clientes confían su imagen en nuestras manos mes a mes. Esto es lo que opinan de la experiencia VIP.
                </p>
            </div>

            {/* Grilla de Reseñas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reseñas.map((r) => (
                    <div
                        key={r.id}
                        className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] relative flex flex-col justify-between hover:bg-zinc-900/60 transition-all duration-300"
                    >
                        {/* Ícono de comillas de fondo */}
                        <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 pointer-events-none -scale-x-100" />

                        <div>
                            {/* Estrellitas */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(r.estrellas)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                                ))}
                            </div>

                            {/* Texto del testimonio */}
                            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                                "{r.texto}"
                            </p>
                        </div>

                        {/* Autor y corte realizado */}
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                                    <span>{r.nombre}</span>
                                    <span title="Cliente Verificado" className="inline-flex">
                                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-500 mt-0.5">{r.fecha}</p>
                            </div>

                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                                {r.corte.split('+')[0]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewsSection;