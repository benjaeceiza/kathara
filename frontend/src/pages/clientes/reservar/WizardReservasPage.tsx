import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    Scissors, User, Calendar as CalendarIcon, Clock,
    ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';

export const WizardReservasPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // ESTADO DE AUTENTICACIÓN 
    const isAuthenticated = useAuthStore(state => state.estaLogueado);

    const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

    // ESTADOS DEL WIZARD
    const [pasoActual, setPasoActual] = useState(() => {
        const guardado = sessionStorage.getItem('kathara_reserva_pendiente');
        // Si había una reserva guardada y ya tenía hora elegida, lo mandamos directo al paso 4
        if (guardado) {
            const parsed = JSON.parse(guardado);
            if (parsed.hora) return 4;
        }
        return 1; // Sino arranca en el 1
    });

    const [reserva, setReserva] = useState(() => {
        // Busca en la memoria del navegador si quedó una reserva a medias
        const guardado = sessionStorage.getItem('kathara_reserva_pendiente');
        return guardado ? JSON.parse(guardado) : {
            servicio: null, profesional: null, fecha: '', hora: ''
        };
    });

    // MOCK DE DATOS (Luego lo traés de tu backend)
    const serviciosDB = [
        { id: 1, nombre: "Skin Fade + Perfilado", precio: 12000, duracion: "50 min" },
        { id: 2, nombre: "Corte Clásico & Texturizado", precio: 10000, duracion: "40 min" },
        { id: 3, nombre: "Ritual de Barba Tradicional", precio: 8500, duracion: "35 min" }
    ];

    const staffDB = [
        { id: "ST-1", nombre: "Mateo Silva", apodo: "Navaja", rol: "Master Barber", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
        { id: "ST-2", nombre: "Lucas Benítez", apodo: "Fade", rol: "Urban Specialist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
        { id: "ST-3", nombre: "Gonzalo Paz", apodo: "Razor", rol: "Colorista VIP", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ];

    const horariosDisponibles = ["10:00", "10:45", "11:30", "15:00", "15:45", "17:30", "18:15", "19:00"];

    // AUTO-SELECCIÓN SI VIENEN DESDE LA URL (ej: /reservar?peluquero=Mateo%20Silva)
    useEffect(() => {
        const srvUrl = searchParams.get('servicio');
        const pelUrl = searchParams.get('peluquero');

        let nuevoEstado = { ...reserva };
        let saltarPaso = pasoActual;

        if (srvUrl) {
            const srvEncontrado = serviciosDB.find(s => s.nombre === srvUrl);
            if (srvEncontrado) nuevoEstado.servicio = srvEncontrado;
        }
        if (pelUrl) {
            const pelEncontrado = staffDB.find(p => p.nombre === pelUrl);
            if (pelEncontrado) nuevoEstado.profesional = pelEncontrado;
        }

        setReserva(nuevoEstado);

        // Si ya eligió profesional desde la URL, lo mandamos al paso de la agenda (Paso 3)
        if (pelUrl) setPasoActual(3);
        // Si solo eligió servicio, lo mandamos al paso del staff (Paso 2)
        else if (srvUrl) setPasoActual(2);
    }, []);

    useEffect(() => {
        // Si el usuario ya completó hasta elegir la hora, guardamos la info
        if (reserva.hora) {
            sessionStorage.setItem('kathara_reserva_pendiente', JSON.stringify(reserva));
        }
    }, [reserva]);

    // FUNCIONES DE NAVEGACIÓN
    const avanzar = () => setPasoActual(p => Math.min(p + 1, 4));
    const retroceder = () => setPasoActual(p => Math.max(p - 1, 1));

    const seleccionarServicio = (srv: any) => { setReserva({ ...reserva, servicio: srv }); avanzar(); };
    const seleccionarStaff = (prof: any) => { setReserva({ ...reserva, profesional: prof }); avanzar(); };
    const seleccionarHorario = (fecha: string, hora: string) => { setReserva({ ...reserva, fecha, hora }); avanzar(); };

    // =========================================================================
    // RENDERIZADO DE LOS PASOS
    // =========================================================================

    const renderPaso1 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><Scissors className="w-5 h-5 text-orange-500" /> 1. Elegí tu Servicio</h2>
            <div className="grid gap-4">
                {serviciosDB.map(srv => (
                    <div key={srv.id} onClick={() => seleccionarServicio(srv)} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] flex justify-between items-center ${reserva.servicio?.id === srv.id ? 'bg-orange-500/10 border-orange-500' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}>
                        <div>
                            <h3 className="font-bold text-white text-lg">{srv.nombre}</h3>
                            <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5" /> {srv.duracion}</p>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-xl text-white block">${srv.precio}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPaso2 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> 2. Elegí al Profesional</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div onClick={() => seleccionarStaff({ id: "CUALQUIERA", nombre: "Cualquier Profesional", rol: "El primero disponible" })} className="p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-orange-500/50 cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-600"><Zap className="w-6 h-6 text-zinc-400" /></div>
                    <div>
                        <h3 className="font-bold text-white">Sin Preferencia</h3>
                        <p className="text-xs text-zinc-500">Horario más rápido</p>
                    </div>
                </div>
                {staffDB.map(prof => (
                    <div key={prof.id} onClick={() => seleccionarStaff(prof)} className={`p-6 rounded-2xl border cursor-pointer text-center transition-all hover:scale-105 ${reserva.profesional?.id === prof.id ? 'bg-orange-500/10 border-orange-500' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}>
                        <img src={prof.avatar} alt={prof.nombre} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-zinc-800 mb-4" />
                        <h3 className="font-bold text-white">{prof.nombre}</h3>
                        <p className="text-xs text-orange-400 uppercase tracking-widest mt-1 font-bold">{prof.apodo}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPaso3 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-orange-500" /> 3. Elegí Fecha y Hora</h2>

            {/* Mock de Fechas (Slider horizontal) */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {["Hoy", "Mañana", "Jue 14", "Vie 15", "Sab 16"].map((dia, i) => (
                    <div key={i} onClick={() => setReserva({ ...reserva, fecha: dia, hora: '' })} className={`shrink-0 px-6 py-4 rounded-xl border cursor-pointer text-center transition-all ${reserva.fecha === dia ? 'bg-orange-500 border-orange-400 text-black' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'}`}>
                        <span className="block text-xs font-bold uppercase tracking-widest">{dia}</span>
                    </div>
                ))}
            </div>

            {/* Grilla de Horarios */}
            {reserva.fecha && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-fadeIn">
                    {horariosDisponibles.map(hora => (
                        <div key={hora} onClick={() => seleccionarHorario(reserva.fecha, hora)} className={`py-3 rounded-lg border text-center cursor-pointer font-black text-sm transition-all ${reserva.hora === hora ? 'bg-orange-500 text-black border-orange-400 shadow-lg shadow-orange-500/20' : 'bg-zinc-900 border-white/5 text-zinc-300 hover:border-orange-500/50'}`}>
                            {hora}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderPaso4 = () => {
        const precio = reserva.servicio?.precio || 0;
        const sena = precio * 0.3;

        return (
            <div className="space-y-8 animate-fadeIn relative">
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-500" /> 4. Confirmación y Pago</h2>

                {/* Resumen Card (Siempre visible para no perder el contexto) */}
                <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Servicio</p>
                            <p className="font-bold text-white text-lg">{reserva.servicio?.nombre}</p>
                        </div>
                        <p className="font-black text-orange-400">${precio}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profesional</p>
                            <p className="font-medium text-zinc-300">{reserva.profesional?.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cuándo</p>
                            <p className="font-medium text-zinc-300">{reserva.fecha} a las {reserva.hora} hs</p>
                        </div>
                    </div>
                </div>

                {/* SI NO ESTÁ LOGUEADO, MOSTRAMOS UN BOTÓN QUE ABRE EL MODAL */}
                {!isAuthenticated ? (
                    <button
                        onClick={() => setMostrarModalLogin(true)}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 animate-pulse"
                    >
                        Confirmar Reserva
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-200">Aboná una seña del 30% (${sena}) para asegurar el turno. El resto en el local.</p>
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-[#009EE3] to-[#0074A6] hover:opacity-90 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                            Pagar Seña (${sena})
                        </button>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 🔥 EL MODAL VIP DE LOGIN (Flota por encima del resumen)                    */}
                {/* ========================================================================= */}
                {mostrarModalLogin && !isAuthenticated && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                        <div className="w-full max-w-md bg-zinc-950 border border-orange-500/30 rounded-3xl p-8 shadow-2xl shadow-orange-500/10 text-center space-y-6 relative">

                            {/* Botón Cerrar (X) */}
                            <button
                                onClick={() => setMostrarModalLogin(false)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>

                            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto border border-orange-500/20">
                                <User className="w-8 h-8 text-orange-500" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white">¡Ya casi es tuyo!</h3>
                                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                                    Para guardar la reserva de <strong className="text-white">{reserva.fecha} a las {reserva.hora} hs</strong> a tu nombre, necesitamos que inicies sesión.
                                </p>
                            </div>

                            <div className="space-y-3 pt-4">
                                {/* 
                  DATAZO: Le pasamos ?returnTo=/reservar en la URL para que, 
                  cuando se loguee, el sistema sepa que tiene que devolverlo acá automáticamente. 
                */}
                                <button
                                    onClick={() => navigate('/login?returnTo=/reservar')}
                                    className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => navigate('/login?mode=register&returnTo=/reservar')}
                                    className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all"
                                >
                                    Crear Cuenta Nueva
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="min-h-screen pt-8 pb-24 max-w-3xl mx-auto px-4">

            {/* HEADER WIZARD */}
            <div className="mb-10">
                <Link to="/servicios" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Cancelar
                </Link>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Reservar Turno.</h1>

                {/* PROGRESS BAR */}
                <div className="flex gap-2 mt-6">
                    {[1, 2, 3, 4].map(paso => (
                        <div key={paso} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${paso <= pasoActual ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-zinc-800'}`} />
                    ))}
                </div>
            </div>

            {/* CONTENEDOR DEL PASO */}
            <div className="relative min-h-[400px]">
                {pasoActual === 1 && renderPaso1()}
                {pasoActual === 2 && renderPaso2()}
                {pasoActual === 3 && renderPaso3()}
                {pasoActual === 4 && renderPaso4()}
            </div>

            {/* FOOTER NAVEGACIÓN (Solo visible si hay pasos anteriores o no eligió la card directa) */}
            <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-6">
                <button
                    onClick={retroceder}
                    className={`px-4 py-2 rounded-lg text-zinc-400 font-bold text-sm transition-all ${pasoActual === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-zinc-900 hover:text-white'}`}
                >
                    ← Volver atrás
                </button>
                <span className="text-xs font-mono text-zinc-600">Paso {pasoActual} de 4</span>
            </div>

        </div>
    );
};