import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Scissors, User, Calendar as CalendarIcon, Clock,
    ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, CalendarX2
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { confirmarReserva, obtenerTurnosOcupados } from '../../../services/turno.service';
import { getServicios } from '../../../services/servicios.service';
import { getStaff } from '../../../services/staff.service';
import ModalReservaExitosa from '../../../components/modals/ModalReservaExitosa';
import { WizardSkeleton } from '../../../components/skeletons/WizardSkeleton';

export const WizardReservasPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isAuthenticated = useAuthStore(state => state.estaLogueado);
    const [cargando, setCargando] = useState(false);
    const [mostrarModalExito, setMostrarModalExito] = useState(false);
    const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

    const [pasoActual, setPasoActual] = useState(() => {
        const guardado = sessionStorage.getItem('kathara_reserva_pendiente');
        if (guardado) {
            const parsed = JSON.parse(guardado);
            if (parsed.hora) return 4;
        }
        return 1;
    });

    const [reserva, setReserva] = useState(() => {
        const guardado = sessionStorage.getItem('kathara_reserva_pendiente');
        return guardado ? JSON.parse(guardado) : {
            servicio: null, profesional: null, fecha: '', hora: ''
        };
    });

    const [serviciosDB, setServiciosDB] = useState<any[]>([]);
    const [staffDB, setStaffDB] = useState<any[]>([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    const [turnosOcupados, setTurnosOcupados] = useState<any[]>([]);
    const [buscandoTurnos, setBuscandoTurnos] = useState(false);

    useEffect(() => {
        const fetchDatosIniciales = async () => {
            try {
                await new Promise(r => setTimeout(r, 800)); 
                const [serviciosData, staffData] = await Promise.all([
                    getServicios(),
                    getStaff()
                ]);
                setServiciosDB(serviciosData);
                setStaffDB(staffData.filter((p: any) => p.activo));
            } catch (error) {
                console.error("Error cargando la base de datos", error);
            } finally {
                setCargandoDatos(false);
            }
        };
        fetchDatosIniciales();
    }, []);

    useEffect(() => {
        const srvUrl = searchParams.get('servicio');
        const srvIdUrl = searchParams.get('id');
        const pelUrl = searchParams.get('peluquero');

        let nuevoEstado = { ...reserva };

        if (srvIdUrl && serviciosDB.length > 0) {
            const srvEncontrado = serviciosDB.find(s => s._id === srvIdUrl || s.id === srvIdUrl);
            if (srvEncontrado) nuevoEstado.servicio = srvEncontrado;
        } else if (srvUrl && serviciosDB.length > 0) {
            const srvEncontrado = serviciosDB.find(s => s.nombre === srvUrl);
            if (srvEncontrado) nuevoEstado.servicio = srvEncontrado;
        }

        if (pelUrl && staffDB.length > 0) {
            const pelEncontrado = staffDB.find(p => p.nombre === pelUrl);
            if (pelEncontrado) nuevoEstado.profesional = pelEncontrado;
        }

        setReserva(nuevoEstado);

        if (pelUrl) {
            setPasoActual(3);
        } else if (srvIdUrl || srvUrl) {
            setPasoActual(2);
        }
    }, [serviciosDB, staffDB]);

    useEffect(() => {
        if (pasoActual === 3 && reserva.fecha && reserva.profesional) {
            const buscarOcupados = async () => {
                setBuscandoTurnos(true);
                try {
                    const rangosOcupados = await obtenerTurnosOcupados(reserva.profesional._id, reserva.fecha);
                    setTurnosOcupados(rangosOcupados || []);
                } catch (error) {
                    console.error("Error trayendo turnos", error);
                    setTurnosOcupados([]);
                } finally {
                    setBuscandoTurnos(false);
                }
            };
            buscarOcupados();
        }
    }, [reserva.fecha, reserva.profesional, pasoActual]);

    useEffect(() => {
        if (reserva.hora) {
            sessionStorage.setItem('kathara_reserva_pendiente', JSON.stringify(reserva));
        }
    }, [reserva]);

    const avanzar = () => setPasoActual(p => Math.min(p + 1, 4));
    const retroceder = () => setPasoActual(p => Math.max(p - 1, 1));

    const seleccionarServicio = (srv: any) => { setReserva({ ...reserva, servicio: srv }); avanzar(); };
    const seleccionarStaff = (prof: any) => { setReserva({ ...reserva, profesional: prof }); avanzar(); };
    const seleccionarHorario = (fecha: string, hora: string) => { setReserva({ ...reserva, fecha, hora }); avanzar(); };

    if (cargandoDatos) return <WizardSkeleton />;

    // =========================================================================
    // PASO 1: SERVICIOS
    // =========================================================================
    const renderPaso1 = () => (
        <div className="space-y-6 animate-fadeIn pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 transition-colors">
                <Scissors className="w-5 h-5 text-zinc-900 dark:text-white" /> 1. Elegí tu Servicio
            </h2>
            <div className="grid gap-3">
                {serviciosDB.map(srv => {
                    const activo = reserva.servicio?._id === srv._id;
                    return (
                        <div
                            key={srv._id}
                            onClick={() => seleccionarServicio(srv)}
                            className={`group p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                                activo 
                                ? 'bg-zinc-900 dark:bg-white border-transparent text-white dark:text-zinc-900 shadow-xl scale-[1.01]' 
                                : 'bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/50 dark:border-white/10 hover:bg-white/90 dark:hover:bg-zinc-900/70 hover:scale-[1.01]'
                            }`}
                        >
                            <div>
                                <h3 className={`font-bold text-base sm:text-lg transition-colors ${activo ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>
                                    {srv.nombre}
                                </h3>
                                <p className={`text-sm flex items-center gap-1.5 mt-1 transition-colors ${activo ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                    <Clock className="w-3.5 h-3.5" /> {srv.duracionMinutos} min
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`font-black text-xl sm:text-2xl block transition-colors ${activo ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>
                                    ${srv.precio}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // =========================================================================
    // PASO 2: STAFF (FORMATO ROW / FILA)
    // =========================================================================
    const renderPaso2 = () => {
        const staffFiltrado = staffDB.filter(prof => {
            if (!reserva.servicio) return true;
            if (!prof.serviciosQueRealiza || prof.serviciosQueRealiza.length === 0) return false;
            return prof.serviciosQueRealiza.some((srv: any) =>
                srv === reserva.servicio._id || srv._id === reserva.servicio._id
            );
        });

        return (
            <div className="space-y-6 animate-fadeIn pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 transition-colors">
                    <User className="w-5 h-5 text-zinc-900 dark:text-white" /> 2. Elegí al Profesional
                </h2>

                {staffFiltrado.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white/60 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/10 backdrop-blur-md rounded-3xl animate-fadeIn">
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Scissors className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Sin profesionales disponibles</h3>
                        <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
                            Ninguno de nuestros estilistas realiza el servicio seleccionado.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div onClick={() => seleccionarStaff({ ...staffFiltrado[0], nombre: "Sin Preferencia", sinPreferencia: true })} 
                             className="group p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 hover:border-zinc-900 dark:hover:border-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center gap-4">
                            <div className="w-14 h-14 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-900 dark:group-hover:border-white transition-colors">
                                <Sparkles className="w-6 h-6 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-zinc-900 dark:text-white transition-colors">Sin Preferencia</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">El primero disponible</p>
                            </div>
                        </div>

                        {staffFiltrado.map(prof => {
                            const activo = reserva.profesional?._id === prof._id;
                            return (
                                <div key={prof._id} onClick={() => seleccionarStaff(prof)} 
                                     className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 overflow-hidden
                                     ${activo ? 'bg-zinc-900 dark:bg-white border-transparent shadow-xl' : 'bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/50 dark:border-white/10 hover:border-zinc-900 dark:hover:border-white'}`}>
                                    
                                    <div className={`w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 transition-colors ${activo ? 'border-zinc-700 dark:border-zinc-200' : 'border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-900 dark:group-hover:border-white'}`}>
                                        <img
                                            src={prof.avatar || `https://ui-avatars.com/api/?name=${prof.nombre}+${prof.apellido}&background=000&color=fff`}
                                            alt={prof.nombre}
                                            className={`w-full h-full object-cover transition-transform duration-500 ${activo ? '' : 'group-hover:grayscale-0 group-hover:scale-110'}`}
                                        />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className={`font-bold transition-colors ${activo ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>
                                            {prof.nombre} {prof.apellido}
                                        </h3>
                                        <p className={`text-[10px] uppercase tracking-widest mt-0.5 font-bold transition-colors ${activo ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                            {prof.tituloProfesional || 'Estilista'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // =========================================================================
    // PASO 3: FECHAS Y HORARIOS (AHORA CON SOPORTE PARA TURNO CORTADO)
    // =========================================================================
    const renderPaso3 = () => {
        const nombreDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const diasDisponibles: any[] = [];
        const horariosProfesional = reserva.profesional?.horarios || [];

        let fechaTemp = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(fechaTemp);
            d.setDate(d.getDate() + i);
            const nombreDia = nombreDias[d.getDay()];
            const configDia = horariosProfesional.find((h: any) => h.dia === nombreDia);

            if (configDia && configDia.activo) {
                const fechaString = d.toISOString().split('T')[0];
                diasDisponibles.push({ fechaString, display: `${nombreDia.substring(0, 3)} ${d.getDate()}`, configDia });
            }
        }

        let turnosDelDia: { hora: string, ocupado: boolean }[] = [];
        const diaSeleccionado = diasDisponibles.find(d => d.fechaString === reserva.fecha);

        if (diaSeleccionado && diaSeleccionado.configDia && !buscandoTurnos) {
            const duracionServicio = parseInt(reserva.servicio?.duracionMinutos, 10) || 30;

            // 🔥 ARMAMOS LOS RANGOS A EVALUAR (Soporte Turno Cortado)
            const rangosHorarios = [
                { inicio: diaSeleccionado.configDia.horaInicio, fin: diaSeleccionado.configDia.horaFin }
            ];

            // Si está partido, le inyectamos la tarde también
            if (diaSeleccionado.configDia.turnoCortado && diaSeleccionado.configDia.horaInicio2 && diaSeleccionado.configDia.horaFin2) {
                rangosHorarios.push({
                    inicio: diaSeleccionado.configDia.horaInicio2,
                    fin: diaSeleccionado.configDia.horaFin2
                });
            }

            // Procesamos todos los rangos que tenga el día
            rangosHorarios.forEach(rango => {
                if (!rango.inicio || !rango.fin) return;

                const [hIni, mIni] = rango.inicio.split(':').map(Number);
                const [hFin, mFin] = rango.fin.split(':').map(Number);

                let horaActual = new Date();
                horaActual.setHours(hIni, mIni, 0, 0);

                const horaLimite = new Date();
                horaLimite.setHours(hFin, mFin, 0, 0);

                while (horaActual.getTime() + (duracionServicio * 60000) <= horaLimite.getTime()) {
                    const horaString = horaActual.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
                    const horaFinSlot = new Date(horaActual.getTime() + (duracionServicio * 60000));

                    const estaOcupado = turnosOcupados.some((rangoOcupado: any) => {
                        if (typeof rangoOcupado === 'string') return rangoOcupado === horaString;
                        const inicioOcupado = new Date(rangoOcupado.inicio);
                        const finOcupado = new Date(rangoOcupado.fin);
                        return (horaActual < finOcupado) && (horaFinSlot > inicioOcupado);
                    });

                    turnosDelDia.push({ hora: horaString, ocupado: estaOcupado });
                    horaActual.setMinutes(horaActual.getMinutes() + duracionServicio);
                }
            });
        }

        return (
            <div className="space-y-6 animate-fadeIn pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-zinc-900 dark:text-white" /> 3. Elegí Fecha y Hora</h2>

                {diasDisponibles.length === 0 ? (
                    <div className="p-8 text-center bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl">
                        <CalendarX2 className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                        <h4 className="text-zinc-900 dark:text-white font-bold">Profesional sin horarios</h4>
                        <p className="text-zinc-500 text-sm mt-1">Este profesional no tiene horarios configurados todavía.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory">
                            {diasDisponibles.map((diaInfo) => {
                                const activo = reserva.fecha === diaInfo.fechaString;
                                return (
                                <div
                                    key={diaInfo.fechaString}
                                    onClick={() => setReserva({ ...reserva, fecha: diaInfo.fechaString, hora: '' })}
                                    className={`shrink-0 snap-center px-6 py-4 rounded-2xl border cursor-pointer text-center transition-all duration-300 ${
                                        activo 
                                        ? 'bg-zinc-900 dark:bg-white border-transparent text-white dark:text-zinc-900 shadow-lg scale-105' 
                                        : 'bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-zinc-800'
                                    }`}
                                >
                                    <span className="block text-sm font-black uppercase tracking-widest">{diaInfo.display}</span>
                                </div>
                            )})}
                        </div>

                        {reserva.fecha && (
                            <div className="mt-4 animate-fadeIn">
                                {buscandoTurnos ? (
                                    <div className="py-12 flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : turnosDelDia.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {turnosDelDia.map(turno => {
                                            const activo = reserva.hora === turno.hora;
                                            return (
                                            <div
                                                key={turno.hora}
                                                onClick={() => !turno.ocupado && seleccionarHorario(reserva.fecha, turno.hora)}
                                                className={`py-3 rounded-xl border text-center font-bold transition-all duration-200 flex flex-col items-center justify-center
                                                    ${turno.ocupado
                                                        ? 'bg-zinc-100 dark:bg-zinc-950/40 border-transparent text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-60'
                                                        : activo
                                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-lg scale-105 cursor-pointer'
                                                            : 'bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/50 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-white hover:text-zinc-900 dark:hover:text-white cursor-pointer active:scale-95'
                                                    }`}
                                            >
                                                <span className="text-base sm:text-lg">{turno.hora}</span>
                                                {turno.ocupado && <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-black">Reservado</span>}
                                            </div>
                                        )})}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 rounded-3xl border-dashed">
                                        <Clock className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                                        <h4 className="text-zinc-900 dark:text-white font-bold">Sin turnos</h4>
                                        <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">El servicio excede el horario restante o el día está completo.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    // =========================================================================
    // PASO 4: CONFIRMACIÓN Y PAGO
    // =========================================================================
    const renderPaso4 = () => {
        const precio = reserva.servicio?.precio || 0;
        const sena = precio * 0.3;
        const fechaFormateada = reserva.fecha ? reserva.fecha.split('-').reverse().join('/') : '';

        const handleConfirmarReserva = async () => {
            setCargando(true);
            try {
                const [anio, mes, dia] = reserva.fecha.split('-');
                const [hora, minutos] = reserva.hora.split(':');
                const fechaReserva = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia), parseInt(hora), parseInt(minutos), 0, 0);

                const payload = {
                    peluqueroId: reserva.profesional._id,
                    servicios: [reserva.servicio._id],
                    fechaHoraInicio: fechaReserva.toISOString()
                };

                await confirmarReserva(payload, useAuthStore.getState().token);
                sessionStorage.removeItem('kathara_reserva_pendiente');
                setMostrarModalExito(true);
            } catch (error: any) {
                alert(`❌ Error: ${error.message}`);
            } finally {
                setCargando(false);
            }
        };

        return (
            <div className="space-y-6 animate-fadeIn pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white" /> 4. Confirmación
                </h2>

                <div className="relative p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f4f4f5] dark:bg-[#09090B] rounded-full border-r border-zinc-200/50 dark:border-white/10"></div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f4f4f5] dark:bg-[#09090B] rounded-full border-l border-zinc-200/50 dark:border-white/10"></div>

                    <div className="flex justify-between items-center pb-6 border-b border-dashed border-zinc-300 dark:border-white/20">
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Servicio Seleccionado</p>
                            <p className="font-black text-zinc-900 dark:text-white text-xl sm:text-2xl">{reserva.servicio?.nombre}</p>
                        </div>
                        <p className="font-black text-2xl sm:text-3xl text-zinc-900 dark:text-white">${precio}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6">
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Profesional
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <img
                                    src={reserva.profesional?.avatar || `https://ui-avatars.com/api/?name=${reserva.profesional?.nombre}+${reserva.profesional?.apellido}&background=000&color=fff`}
                                    alt={reserva.profesional?.nombre}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shadow-sm "
                                />
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm leading-tight">{reserva.profesional?.nombre}</p>
                                    <p className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                        {reserva.profesional?.tituloProfesional || 'Estilista'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" /> Cuándo
                            </p>
                            <p className="font-bold text-zinc-900 dark:text-white text-base sm:text-lg mt-1">{fechaFormateada}</p>
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">{reserva.hora} hs</p>
                        </div>
                    </div>
                </div>

                {!isAuthenticated ? (
                    <button
                        onClick={() => setMostrarModalLogin(true)}
                        disabled={cargando}
                        className="w-full py-4 sm:py-5 bg-zinc-900 dark:bg-white hover:scale-[1.02] disabled:opacity-50 text-white dark:text-zinc-950 font-black uppercase text-xs sm:text-sm tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                        {cargando ? 'Procesando...' : 'Iniciar sesión para Reservar'}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-300/50 dark:border-white/10 flex items-start gap-3 backdrop-blur-sm">
                            <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">Seña del <strong>30% (${sena})</strong> requerida. El saldo se abona en el local.</p>
                        </div>
                        <button
                            onClick={handleConfirmarReserva}
                            disabled={cargando}
                            className="w-full py-4 sm:py-5 bg-zinc-900 dark:bg-white hover:scale-[1.02] disabled:opacity-50 text-white dark:text-zinc-950 font-black uppercase text-xs sm:text-sm tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            {cargando ? 'Procesando...' : `Abonar $${sena} y Confirmar`}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-5.5rem)] lg:h-[calc(100vh-7rem)] max-w-3xl mx-auto w-full px-2 sm:px-4">
            
            <div className="shrink-0 mb-4 sm:mb-6 pt-2">
                <button
                    onClick={() => pasoActual > 1 ? retroceder() : navigate('/servicios')}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-zinc-900/40 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all mb-4 sm:mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Volver
                </button>
                
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight transition-colors">Reserva.</h1>

                <div className="flex gap-2 mt-4 sm:mt-6">
                    {[1, 2, 3, 4].map(paso => (
                        <div key={paso} className="h-1.5 sm:h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                            <div className={`absolute top-0 left-0 h-full w-full bg-zinc-900 dark:bg-white transition-transform duration-700 ease-in-out ${paso <= pasoActual ? 'translate-x-0' : '-translate-x-full'}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide relative pb-4">
                {pasoActual === 1 && renderPaso1()}
                {pasoActual === 2 && renderPaso2()}
                {pasoActual === 3 && renderPaso3()}
                {pasoActual === 4 && renderPaso4()}
            </div>

           <div className="shrink-0 pt-4 pb-2 mt-2 border-t border-zinc-200/50 dark:border-white/10 flex justify-between items-center transition-colors z-10">
                <button
                    onClick={() => {
                        sessionStorage.removeItem('kathara_reserva_pendiente');
                        navigate('/servicios');
                    }}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-white/90 dark:hover:bg-zinc-800 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
                >
                    Cancelar
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white drop-shadow-md">Paso</span>
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs sm:text-sm shadow-xl transition-colors">{pasoActual}</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white drop-shadow-md">de 4</span>
                </div>
            </div>

            <ModalReservaExitosa
                isOpen={mostrarModalExito}
                reserva={reserva.servicio && reserva.profesional ? {
                    servicio: reserva.servicio.nombre,
                    profesional: reserva.profesional.nombre,
                    fecha: reserva.fecha ? reserva.fecha.split('-').reverse().join('/') : '',
                    hora: reserva.hora
                } : null}
            />
        </div>
    );
};