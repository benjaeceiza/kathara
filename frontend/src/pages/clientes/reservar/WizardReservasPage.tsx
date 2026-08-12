import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    Scissors, User, Calendar as CalendarIcon, Clock,
    ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, CalendarX2
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { confirmarReserva, obtenerTurnosOcupados } from '../../../services/turno.service';
import { getServicios } from '../../../services/servicios.service';
import { getStaff } from '../../../services/staff.service';
import ModalReservaExitosa from '../../../components/modals/ModalReservaExitosa';

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
                    // El backend nos devuelve los rangos ocupados { inicio, fin }
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

    // =========================================================================
    // RENDERIZADO DE LOS PASOS
    // =========================================================================

    const renderPaso1 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Scissors className="w-6 h-6 text-orange-500 animate-pulse" /> 1. Elegí tu Servicio
            </h2>

            {cargandoDatos ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-400 mt-4 font-medium animate-pulse">Cargando servicios...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {serviciosDB.map(srv => (
                        <div
                            key={srv._id}
                            onClick={() => seleccionarServicio(srv)}
                            className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.1)] flex justify-between items-center overflow-hidden relative ${reserva.servicio?._id === srv._id ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 border-orange-500' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            <div className="relative z-10">
                                <h3 className={`font-bold text-lg transition-colors ${reserva.servicio?._id === srv._id ? 'text-orange-400' : 'text-white group-hover:text-orange-100'}`}>{srv.nombre}</h3>
                                <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5" /> {srv.duracionMinutos} min</p>
                            </div>
                            <div className="text-right relative z-10">
                                <span className="font-black text-2xl text-white block">${srv.precio}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderPaso2 = () => {
        const staffFiltrado = staffDB.filter(prof => {
            if (!reserva.servicio) return true;
            if (!prof.serviciosQueRealiza || prof.serviciosQueRealiza.length === 0) return false;
            return prof.serviciosQueRealiza.some((srv: any) =>
                srv === reserva.servicio._id || srv._id === reserva.servicio._id
            );
        });

        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-orange-500 animate-pulse" /> 2. Elegí al Profesional
                </h2>

                {cargandoDatos ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : staffFiltrado.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-zinc-900 border border-white/5 rounded-3xl animate-fadeIn">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Scissors className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Sin profesionales disponibles</h3>
                        <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
                            Actualmente ninguno de nuestros estilistas está realizando el servicio de <strong className="text-orange-400">{reserva.servicio?.nombre}</strong>.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {staffFiltrado.length > 0 && (
                            <div onClick={() => seleccionarStaff({ ...staffFiltrado[0], nombre: "Sin Preferencia", sinPreferencia: true })} className="group p-6 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/5 hover:border-orange-500/50 cursor-pointer text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-500 group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-colors">
                                    <Sparkles className="w-7 h-7 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">Sin Preferencia</h3>
                                    <p className="text-xs text-zinc-500 mt-1">El primero disponible</p>
                                </div>
                            </div>
                        )}

                        {staffFiltrado.map(prof => (
                            <div key={prof._id} onClick={() => seleccionarStaff(prof)} className={`group p-6 rounded-3xl border cursor-pointer text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.1)] overflow-hidden ${reserva.profesional?._id === prof._id ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}>
                                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-orange-500 transition-colors">
                                    <img
                                        src={prof.avatar || `https://ui-avatars.com/api/?name=${prof.nombre}+${prof.apellido}&background=27272a&color=f97316`}
                                        alt={prof.nombre}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="font-bold text-white">{prof.nombre} {prof.apellido}</h3>
                                <p className="text-xs text-orange-400 uppercase tracking-widest mt-1 font-bold">
                                    {prof.tituloProfesional || 'Estilista'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderPaso3 = () => {
        const nombreDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const diasDisponibles: any[] = [];
        const horariosProfesional = reserva.profesional?.horarios || []; //[cite: 8]

        let fechaTemp = new Date(); //[cite: 8]
        
        // 🔥 CAMBIO 1: Solo miramos 7 días para adelante (mucho más minimalista)
        for (let i = 0; i < 7; i++) {
            const d = new Date(fechaTemp);
            d.setDate(d.getDate() + i);
            const nombreDia = nombreDias[d.getDay()];
            const configDia = horariosProfesional.find((h: any) => h.dia === nombreDia); //[cite: 8]

            if (configDia && configDia.activo) {
                const fechaString = d.toISOString().split('T')[0]; //[cite: 8]
                diasDisponibles.push({
                    fechaString, //[cite: 8]
                    display: `${nombreDia.substring(0, 3)} ${d.getDate()}`, //[cite: 8]
                    configDia //[cite: 8]
                });
            }
        }

        let turnosDelDia: { hora: string, ocupado: boolean }[] = []; //[cite: 8]
        const diaSeleccionado = diasDisponibles.find(d => d.fechaString === reserva.fecha); //[cite: 8]

        if (diaSeleccionado && diaSeleccionado.configDia && !buscandoTurnos) {
    
           const duracionServicio = parseInt(reserva.servicio?.duracionMinutos, 10) || 30;

            const [hIni, mIni] = diaSeleccionado.configDia.horaInicio.split(':').map(Number); //[cite: 8]
            const [hFin, mFin] = diaSeleccionado.configDia.horaFin.split(':').map(Number); //[cite: 8]

            let horaActual = new Date(); //[cite: 8]
            horaActual.setHours(hIni, mIni, 0, 0); //[cite: 8]

            const horaLimite = new Date(); //[cite: 8]
            horaLimite.setHours(hFin, mFin, 0, 0); //[cite: 8]

            while (horaActual.getTime() + (duracionServicio * 60000) <= horaLimite.getTime()) { //[cite: 8]
                const horaString = horaActual.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }); //[cite: 8]
                const horaFinSlot = new Date(horaActual.getTime() + (duracionServicio * 60000)); //[cite: 8]

                // Chequeo de superposición matemática contra los rangos de la BD
                const estaOcupado = turnosOcupados.some((rangoOcupado: any) => { //[cite: 8]
                    if (typeof rangoOcupado === 'string') return rangoOcupado === horaString; //[cite: 8]
                    const inicioOcupado = new Date(rangoOcupado.inicio); //[cite: 8]
                    const finOcupado = new Date(rangoOcupado.fin); //[cite: 8]
                    return (horaActual < finOcupado) && (horaFinSlot > inicioOcupado); //[cite: 8]
                });

                turnosDelDia.push({
                    hora: horaString, //[cite: 8]
                    ocupado: estaOcupado //[cite: 8]
                });

                // 🔥 CAMBIO 3: Acá da el salto del intervalo EXACTO según lo que dura el servicio
                horaActual.setMinutes(horaActual.getMinutes() + duracionServicio); //[cite: 8]
            }
        }

        return (
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-orange-500 animate-bounce" /> 3. Elegí Fecha y Hora</h2>

                {diasDisponibles.length === 0 ? (
                    <div className="p-8 text-center bg-zinc-900 border border-white/5 rounded-3xl">
                        <CalendarX2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <h4 className="text-white font-bold">Profesional sin horarios</h4>
                        <p className="text-zinc-500 text-sm mt-1">Este profesional no tiene horarios configurados todavía.</p>
                    </div>
                ) : (
                    <>
                        {/* CARRUSEL DE DÍAS (Ahora de 7 nomás) */}
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x snap-mandatory">
                            {diasDisponibles.map((diaInfo) => (
                                <div
                                    key={diaInfo.fechaString} //[cite: 8]
                                    onClick={() => setReserva({ ...reserva, fecha: diaInfo.fechaString, hora: '' })} //[cite: 8]
                                    className={`shrink-0 snap-center px-8 py-5 rounded-2xl border cursor-pointer text-center transition-all duration-300 hover:-translate-y-1 ${reserva.fecha === diaInfo.fechaString ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-transparent text-black shadow-lg shadow-orange-500/30' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'}`} //[cite: 8]
                                >
                                    <span className="block text-sm font-black uppercase tracking-widest">{diaInfo.display}</span>
                                </div>
                            ))}
                        </div>

                        {/* GRILLA DE HORAS */}
                        {reserva.fecha && ( //[cite: 8]
                            <div className="mt-4 animate-fadeIn">
                                {buscandoTurnos ? (
                                    <div className="py-12 flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-zinc-500 text-sm mt-4 font-medium animate-pulse">Buscando disponibilidad...</p>
                                    </div>
                                ) : turnosDelDia.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {turnosDelDia.map(turno => (
                                            <div
                                                key={turno.hora} //[cite: 8]
                                                onClick={() => !turno.ocupado && seleccionarHorario(reserva.fecha, turno.hora)} //[cite: 8]
                                                className={`py-3 rounded-xl border text-center font-bold transition-all duration-200 flex flex-col items-center justify-center
                                                    ${turno.ocupado //[cite: 8]
                                                        ? 'bg-zinc-950/40 border-white/5 text-zinc-600 cursor-not-allowed opacity-50'  //[cite: 8]
                                                        : reserva.hora === turno.hora //[cite: 8]
                                                            ? 'bg-orange-500 text-black border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer active:scale-95' //[cite: 8]
                                                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800 hover:border-orange-500/30 cursor-pointer active:scale-95' //[cite: 8]
                                                    }`} //[cite: 8]
                                            >
                                                <span className="text-lg">{turno.hora}</span>
                                                {turno.ocupado && <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-black">Reservado</span>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-zinc-900/50 border border-white/5 rounded-3xl border-dashed">
                                        <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                                        <h4 className="text-white font-bold">Sin turnos</h4>
                                        <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">Este día ya está completamente reservado o el servicio no entra en el horario restante.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

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
            <div className="space-y-8 animate-fadeIn relative">
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-orange-500" /> 4. Confirmación y Pago</h2>

                <div className="relative p-8 rounded-3xl bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border-r border-white/10"></div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border-l border-white/10"></div>

                    <div className="flex justify-between items-center pb-6 border-b border-dashed border-white/20">
                        <div>
                            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Servicio Seleccionado</p>
                            <p className="font-black text-white text-2xl">{reserva.servicio?.nombre}</p>
                        </div>
                        <p className="font-black text-3xl text-orange-400">${precio}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6">
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Profesional
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src={reserva.profesional?.avatar || `https://ui-avatars.com/api/?name=${reserva.profesional?.nombre}+${reserva.profesional?.apellido}&background=27272a&color=f97316`}
                                    alt={reserva.profesional?.nombre}
                                    className="w-10 h-10 rounded-full object-cover border border-zinc-700 shadow-sm"
                                />
                                <div>
                                    <p className="font-bold text-white text-sm leading-tight">{reserva.profesional?.nombre} {reserva.profesional?.apellido}</p>
                                    <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-0.5">
                                        {reserva.profesional?.tituloProfesional || 'Estilista'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" /> Cuándo
                            </p>
                            <p className="font-bold text-white text-lg mt-1">{fechaFormateada}</p>
                            <p className="text-sm text-zinc-400 font-medium">{reserva.hora} hs</p>
                        </div>
                    </div>
                </div>

                {!isAuthenticated ? (
                    <button
                        onClick={() => setMostrarModalLogin(true)}
                        disabled={cargando}
                        className="w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-black font-black uppercase text-sm tracking-widest rounded-2xl transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2"
                    >
                        {cargando ? 'Procesando...' : 'Iniciar sesión para Reservar'}
                    </button>
                ) : (
                    <div className="space-y-5">
                        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-4 backdrop-blur-sm">
                            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-200 leading-relaxed">Aboná una seña del <strong>30% (${sena})</strong> ahora para asegurar tu lugar. El monto restante lo pagás directamente en el local.</p>
                        </div>
                        <button
                            onClick={handleConfirmarReserva}
                            disabled={cargando}
                            className="w-full py-5 bg-gradient-to-r from-[#009EE3] to-[#0074A6] hover:opacity-90 hover:-translate-y-1 text-white font-black uppercase text-sm tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,158,227,0.3)] flex items-center justify-center gap-2"
                        >
                            {cargando ? 'Procesando...' : `Pagar Seña ($${sena}) y Confirmar`}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-8 pb-24 max-w-3xl mx-auto px-4">
            <div className="mb-12">
                {/* 🔥 BOTÓN VOLVER (Naranjita - Ahora arriba) */}
                <button
                    onClick={() => pasoActual > 1 ? retroceder() : navigate('/servicios')}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-bold uppercase tracking-widest transition-all mb-8 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
                </button>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Reservar Turno.</h1>

                <div className="flex gap-2 mt-8">
                    {[1, 2, 3, 4].map(paso => (
                        <div key={paso} className="h-2 flex-1 rounded-full bg-zinc-800 overflow-hidden relative">
                            <div className={`absolute top-0 left-0 h-full w-full bg-gradient-to-r from-orange-500 to-amber-500 transition-transform duration-700 ease-in-out ${paso <= pasoActual ? 'translate-x-0' : '-translate-x-full'}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative min-h-[400px]">
                {pasoActual === 1 && renderPaso1()}
                {pasoActual === 2 && renderPaso2()}
                {pasoActual === 3 && renderPaso3()}
                {pasoActual === 4 && renderPaso4()}
            </div>

            <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-8">
                {/* 🔥 BOTÓN CANCELAR (Rojito suave - Ahora abajo) */}
                <button
                    onClick={() => {
                        sessionStorage.removeItem('kathara_reserva_pendiente');
                        navigate('/servicios');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-sm transition-all active:scale-95"
                >
                    Cancelar
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Paso</span>
                    <span className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm border border-orange-500/20">{pasoActual}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">de 4</span>
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
        </div >
    );
};