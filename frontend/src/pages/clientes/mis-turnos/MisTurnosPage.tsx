import { Link } from 'react-router-dom';

import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  History,
  Sparkles,
  MapPin,
  Award // 
} from 'lucide-react';

import  { useState } from 'react';

 const MisTurnosPage: React.FC = () => {
  // Estado provisorio para simular turnos (Después lo traemos con fetch desde MongoDB)
  const [turnoActivo, setTurnoActivo] = useState<any>({
    id: "TRN-9921",
    fecha: "Jueves 9 de Julio, 2026",
    hora: "18:30 hs",
    servicio: "Skin Fade + Perfilado de Barba",
    peluquero: "Mateo 'Navaja' Silva",
    precioTotal: 12000,
    montoSeña: 2400,
    estado: "confirmado" // confirmado, pendiente_seña
  });

  const historialTurnos = [
    {
      id: "TRN-8810",
      fecha: "15 de Junio, 2026",
      hora: "17:00 hs",
      servicio: "Skin Fade + Perfilado de Barba",
      peluquero: "Mateo 'Navaja' Silva",
      precio: 11000,
      estado: "completado"
    },
    {
      id: "TRN-7402",
      fecha: "20 de Mayo, 2026",
      hora: "19:00 hs",
      servicio: "Corte Clásico a Tijera",
      peluquero: "Lucas 'Fade' Benítez",
      precio: 9500,
      estado: "completado"
    },
    {
      id: "TRN-6100",
      fecha: "10 de Abril, 2026",
      hora: "16:30 hs",
      servicio: "Taper Fade & Texturizado",
      peluquero: "Gonzalo 'Razor' Paz",
      precio: 9500,
      estado: "cancelado"
    }
  ];

  const handleCancelarTurno = () => {
    if (window.confirm("¿Estás seguro de que querés cancelar tu turno en Kathara?")) {
      setTurnoActivo(null);
      alert("❌ Turno cancelado correctamente.");
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      
      {/* Cabecera de la Página con Pastilla de Fidelidad */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            <History className="w-3.5 h-3.5" />
            <span>Panel de Agenda VIP</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Mis Turnos.
            </h1>

            {/* 🔥 EL COSO DEL CORTE / PASTILLA DE FIDELIDAD */}
            <Link 
              to="/perfil"
              title="Ver tu tarjeta VIP de fidelidad"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-orange-500/40 hover:border-orange-400 text-xs font-extrabold text-white shadow-lg shadow-orange-500/10 hover:scale-105 transition-all cursor-pointer group"
            >
              <span className="text-sm">☘️</span>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                Progreso VIP: <strong className="text-orange-400 font-mono">7/10</strong>
              </span>
              <Award className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>

          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Gestioná tus próximas citas en el salón o repetí tu estilo favorito desde el historial.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 1: TURNO ACTIVO / PRÓXIMO                         */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Tu Próxima Reserva en Kathara</span>
        </h2>

        {turnoActivo ? (
          <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-orange-500/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-orange-950/20 overflow-hidden group">
            
            {/* Resplandor de fondo neón */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              {/* Datos principales del turno */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmado</span>
                  </span>
                  <span className="text-xs text-zinc-500 font-mono font-bold">#{turnoActivo.id}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{turnoActivo.servicio}</h3>
                  <p className="text-orange-400 font-bold text-sm sm:text-base mt-1 flex items-center gap-2">
                    <User className="w-4 h-4 shrink-0" />
                    <span>Con {turnoActivo.peluquero}</span>
                  </p>
                </div>

                {/* Fecha y Hora en pastillas */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-white/5 text-white text-sm font-bold">
                    <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{turnoActivo.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-white/5 text-white text-sm font-bold">
                    <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{turnoActivo.hora}</span>
                  </div>
                </div>
              </div>

              {/* Caja de Pagos y Acciones */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 shrink-0">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 uppercase font-semibold">Total a pagar en local:</p>
                  <p className="text-2xl font-black text-white">${turnoActivo.precioTotal}</p>
                  <p className="text-[11px] text-emerald-400 font-medium">✅ Seña pagada (${turnoActivo.montoSeña})</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Cómo llegar</span>
                  </button>
                  
                  <button 
                    onClick={handleCancelarTurno}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Estado vacío si no tiene turnos activos */
          <div className="bg-zinc-900/40 border border-dashed border-white/10 rounded-[2rem] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-base">No tenés ningún turno pendiente en este momento.</p>
              <p className="text-zinc-500 text-xs mt-1">Asegurá tu horario para esta semana en menos de 1 minuto.</p>
            </div>
            <a 
              href="/reservar" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <span>Reservar un turno ahora</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </section>


      {/* ========================================================= */}
      {/* SECCIÓN 2: HISTORIAL DE CORTES                            */}
      {/* ========================================================= */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white">Historial de Cortes</h2>
            <p className="text-zinc-400 text-xs mt-0.5">Todos los servicios que te realizaste en Kathara.</p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{historialTurnos.length} cortes</span>
        </div>

        <div className="space-y-3">
          {historialTurnos.map((t) => (
            <div 
              key={t.id}
              className="bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              {/* Información del corte pasado */}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  t.estado === 'completado' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <Scissors className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-white text-sm sm:text-base">{t.servicio}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      t.estado === 'completado' ? 'bg-zinc-800 text-zinc-300' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {t.estado}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-zinc-300 font-medium">✂️ {t.peluquero}</span>
                    <span>📅 {t.fecha} - {t.hora}</span>
                  </p>
                </div>
              </div>

              {/* Precio y Botón de Re-agendar */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                <span className="font-black text-white text-sm">${t.precio}</span>
                
                {t.estado === 'completado' && (
                  <a 
                    href={`/reservar?servicio=${t.servicio}`}
                    title="Repetir este corte" 
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-black text-zinc-300 text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Repetir corte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};


export default MisTurnosPage;