
import { CheckCircle2, Calendar as CalendarIcon, Clock, Scissors, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModalReservaExitosaProps {
    isOpen: boolean;
    reserva: {
        servicio: string;
        profesional: string;
        fecha: string;
        hora: string;
    } | null;
}
const ModalReservaExitosa: React.FC<ModalReservaExitosaProps> = ({ isOpen, reserva }) => {
    const navigate = useNavigate();

    if (!isOpen || !reserva) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md bg-zinc-950 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 text-center space-y-6 relative overflow-hidden">

                {/* Fondo decorativo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                {/* Ícono animado */}
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 relative z-10 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tight">¡Turno Confirmado!</h3>
                    <p className="text-zinc-400 text-sm mt-2">
                        Tu lugar ya está reservado. Te esperamos en el local para dejarte impecable.
                    </p>
                </div>

                {/* Tarjetita resumen adentro del modal */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 text-left space-y-3 relative z-10">
                    <div className="flex items-center gap-3 text-zinc-300">
                        <Scissors className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-bold">{reserva.servicio}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <User className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium">Con {reserva.profesional}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400 pt-2 border-t border-white/5 mt-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm font-black">{reserva.fecha}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span className="text-sm font-black">{reserva.hora} hs</span>
                    </div>
                </div>

                {/* Botón de acción */}
                <button
                    onClick={() => navigate('/mis-turnos')}
                    className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group relative z-10 cursor-pointer"
                >
                    <span>Ver mis turnos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ModalReservaExitosa;