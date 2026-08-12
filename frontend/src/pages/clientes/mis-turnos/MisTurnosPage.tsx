import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, User, Scissors, XCircle, Award, MapPin
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { obtenerMisTurnos, cancelarTurno } from '../../../services/turno.service';
import ModalDangerAction from '../../../components/modals/ModalDangerAction';

const MisTurnosPage: React.FC = () => {
  const { token } = useAuthStore();

  const [turnosActivos, setTurnosActivos] = useState<any[]>([]);
  const [historialTurnos, setHistorialTurnos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [modalCancelar, setModalCancelar] = useState({ isOpen: false, turnoId: '' });
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setCargando(true);
      const data = await obtenerMisTurnos(token);

      const todosLosTurnos = data.turnos || [];
      const activos = todosLosTurnos.filter((t: any) => t.estado === 'confirmado' || t.estado === 'pendiente');
      const historial = todosLosTurnos.filter((t: any) => t.estado === 'completado' || t.estado === 'cancelado');

      setTurnosActivos(activos);
      setHistorialTurnos(historial);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCancelar = (turnoId: string) => {
    setModalCancelar({ isOpen: true, turnoId });
  };

  const confirmarCancelacion = async () => {
    try {
      setCancelando(true);
      await cancelarTurno(modalCancelar.turnoId, token);
      cargarTurnos();
      setModalCancelar({ isOpen: false, turnoId: '' });
    } catch (error: any) {
      alert(`Hubo un error al cancelar: ${error.message}`);
    } finally {
      setCancelando(false);
    }
  };

  const formatearFecha = (isoString: string) => {
    if (!isoString) return '';
    const fecha = new Date(isoString);
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return fecha.toLocaleDateString('es-AR', opciones).replace(',', '');
  };

  const formatearHora = (isoString: string) => {
    if (!isoString) return '';
    const fecha = new Date(isoString);
    return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 max-w-5xl mx-auto animate-fadeIn px-4 sm:px-0">

      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Mis Turnos.
            <Link
              to="/perfil"
              title="Ver tu tarjeta VIP de fidelidad"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-orange-500/30 hover:border-orange-500 text-[10px] font-bold text-white shadow-lg transition-all cursor-pointer group"
            >
              <span>☘️ Progreso: <span className="text-orange-400">7/10</span></span>
              <Award className="w-3 h-3 text-amber-400" />
            </Link>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Gestioná tus próximas citas o repetí tu estilo favorito.</p>
        </div>
      </div>

      {/* TURNOS ACTIVOS */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          Próximas Reservas
        </h2>

        {turnosActivos.length > 0 ? (
          <div className="space-y-4">
            {turnosActivos.map((turno) => {
              const precio = turno.precioTotal || 0;
              const sena = turno.montoSeña || 0;
              const servicioNombre = turno.servicios?.length > 0 && turno.servicios[0].nombre
                ? turno.servicios.map((s: any) => s.nombre).join(' + ') : 'Servicio';
              const peluqueroObj = turno.peluqueroId;
              const peluqueroNombre = peluqueroObj && peluqueroObj.nombre ? `${peluqueroObj.nombre} ${peluqueroObj.apellido}` : 'Staff';

              return (
                <div key={turno._id} className="bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all">

                  {/* Info Izquierda */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-white text-base sm:text-lg leading-tight">{servicioNombre}</h3>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
                          Confirmado
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
                            <User className="w-3.5 h-3.5 text-zinc-500" /> {peluqueroNombre}
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" /> {formatearFecha(turno.fechaHoraInicio)} a las {formatearHora(turno.fechaHoraInicio)}hs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones Derecha - 🔥 Mejorado para mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 pt-4 sm:pt-0 border-t lg:border-t-0 border-white/5 shrink-0">
                    <div className="flex justify-between sm:block sm:text-right w-full sm:w-auto">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold hidden sm:block">Total</p>
                      <p className="font-black text-white text-lg sm:text-xl leading-none">
                        <span className="text-zinc-500 text-sm font-normal sm:hidden mr-2">Total:</span> 
                        ${precio}
                      </p>
                      {sena > 0 && <p className="text-[10px] text-emerald-400 mt-1">Seña pagada: ${sena}</p>}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="p-3 sm:p-2.5 rounded-xl sm:rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center justify-center shrink-0" title="Cómo llegar">
                        <MapPin className="w-4 h-4 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => abrirModalCancelar(turno._id)}
                        className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold uppercase sm:capitalize tracking-widest sm:tracking-normal transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500 text-sm">No tenés reservas próximas.</p>
          </div>
        )}
      </section>

      {/* HISTORIAL */}
      <section className="space-y-4 pt-6">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Historial de Cortes</h2>

        {historialTurnos.length > 0 ? (
          <div className="space-y-3">
            {historialTurnos.map((t) => {
              const precio = t.precioTotal || 0;
              const servicioNombre = t.servicios?.length > 0 && t.servicios[0].nombre ? t.servicios.map((s: any) => s.nombre).join(' + ') : 'Servicio';
              const peluqueroObj = t.peluqueroId;
              const peluqueroNombre = peluqueroObj && peluqueroObj.nombre ? `${peluqueroObj.nombre} ${peluqueroObj.apellido}` : 'Staff';

              return (
                <div key={t._id} className="bg-zinc-950 border border-white/5 hover:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">

                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.estado === 'completado' ? 'bg-zinc-800 text-zinc-400' : 'bg-red-500/5 text-red-500/50'
                      }`}>
                      {t.estado === 'cancelado' ? <XCircle className="w-5 h-5" /> : <Scissors className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        {servicioNombre}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-bold ${t.estado === 'completado' ? 'bg-zinc-800 text-zinc-500' : 'bg-red-500/10 text-red-400'}`}>
                            {t.estado}
                        </span>
                        <span className="text-zinc-600 text-[10px]">•</span>
                        <p className="text-[11px] text-zinc-500">
                            {peluqueroNombre} • {formatearFecha(t.fechaHoraInicio)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 🔥 Mejorado para mobile: Botón de repetir ancho completo y precio visible */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 shrink-0">
                    <span className="font-bold text-white text-sm sm:text-base">${precio}</span>
                    {t.estado === 'completado' && (
                      <Link
                        to={`/reservar?servicio=${servicioNombre}&peluquero=${peluqueroNombre}`}
                        className="px-4 py-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg bg-zinc-800 hover:bg-orange-500 hover:text-black text-zinc-300 text-xs font-bold uppercase sm:capitalize tracking-wider sm:tracking-normal transition-colors flex items-center justify-center gap-2"
                      >
                        Repetir <span className="hidden sm:inline">Corte</span>
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-600 text-sm">Sin cortes anteriores.</p>
          </div>
        )}
      </section>

      <ModalDangerAction
        isOpen={modalCancelar.isOpen}
        onClose={() => setModalCancelar({ isOpen: false, turnoId: '' })}
        onConfirm={confirmarCancelacion}
        isLoading={cancelando}
        title="¿Cancelar Reserva?"
        message="Esta acción no se puede deshacer. Vas a perder tu lugar y el horario quedará libre para otro cliente."
        confirmText="Cancelar Turno"
      />
    </div>
  );
};

export default MisTurnosPage;