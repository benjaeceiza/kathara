import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Search,
    Plus,
    CheckCircle2,
    XCircle,
    Ban,
    Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { obtenerTurnosSemanaAdmin } from '../../services/turno.service';
import { getStaff } from '../../services/staff.service';

export const TurnosAdminPage: React.FC = () => {
    const { token } = useAuthStore();

    const [turnosDB, setTurnosDB] = useState<any[]>([]);
    const [staffDB, setStaffDB] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    // 🔥 FILTROS
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroProfesional, setFiltroProfesional] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    
    const hoyStr = new Date().toLocaleDateString('en-CA');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyStr);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                const [turnos, staffData] = await Promise.all([
                    obtenerTurnosSemanaAdmin(token),
                    getStaff(token)
                ]);
                setTurnosDB(turnos);
                setStaffDB(staffData.filter((p: any) => p.activo));
            } catch (error) {
                console.error("Error al cargar la agenda:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [token]);

    const generarFechasDisponibles = () => {
        const fechasSet = new Set<string>();
        
        const hoy = new Date();
        fechasSet.add(hoy.toLocaleDateString('en-CA'));

        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        fechasSet.add(manana.toLocaleDateString('en-CA'));

        turnosDB.forEach(turno => {
            if (turno.fechaHoraInicio) {
                const fechaTurno = new Date(turno.fechaHoraInicio).toLocaleDateString('en-CA');
                fechasSet.add(fechaTurno);
            }
        });

        return Array.from(fechasSet).sort();
    };

    const fechasDisponibles = generarFechasDisponibles();

    const formatearNombreFecha = (fechaStr: string) => {
        const hoy = new Date().toLocaleDateString('en-CA');
        const mananaDate = new Date();
        mananaDate.setDate(mananaDate.getDate() + 1);
        const manana = mananaDate.toLocaleDateString('en-CA');

        if (fechaStr === hoy) return 'Hoy';
        if (fechaStr === manana) return 'Mañana';
        
        const [anio, mes, dia] = fechaStr.split('-');
        const dateObj = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
        const nombreDia = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dateObj.getDay()];
        return `${nombreDia} ${dia}`;
    };

    const formatearHora = (isoString: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const turnosFiltrados = turnosDB.filter(turno => {
        const fechaTurno = new Date(turno.fechaHoraInicio).toLocaleDateString('en-CA');
        if (fechaTurno !== fechaSeleccionada) return false;

        const pasaFiltroEstado = filtroEstado === 'todos' || turno.estado === filtroEstado;
        const pasaFiltroProfesional = filtroProfesional === 'todos' || turno.peluqueroId?._id === filtroProfesional;

        const clienteNombre = turno.clienteId ? `${turno.clienteId.nombre} ${turno.clienteId.apellido}`.toLowerCase() : '';
        const pasaBusqueda = busqueda === '' || clienteNombre.includes(busqueda.toLowerCase());

        return pasaFiltroEstado && pasaFiltroProfesional && pasaBusqueda;
    });

    const renderEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'confirmado':
            case 'pendiente':
                return <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Pendiente</span>;
            case 'completado':
                return <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Asistió</span>;
            case 'falto':
                return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Faltó</span>;
            case 'cancelado':
                return <span className="px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Cancelado</span>;
            default:
                return null;
        }
    };

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 mt-4 animate-pulse font-bold tracking-widest uppercase text-sm">Cargando Agenda...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-24 px-2 sm:px-0">

            {/* 1. HEADER Y BOTÓN NUEVO TURNO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Agenda de Turnos.</h1>
                    <p className="text-zinc-400 mt-1 text-sm sm:text-base">Gestioná las reservas y la asistencia de la semana.</p>
                </div>
                <a href="/reservar" className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20">
                    <Plus className="w-5 h-5" /> Nuevo Turno
                </a>
            </div>

            {/* 🔥 2. SELECTOR DE FECHAS (SOLO MOBILE) */}
            <div className="sm:hidden relative">
                <CalendarIcon className="w-5 h-5 text-orange-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select 
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-orange-500 appearance-none shadow-lg"
                >
                    {fechasDisponibles.map(fecha => (
                        <option key={fecha} value={fecha}>{formatearNombreFecha(fecha)}</option>
                    ))}
                </select>
            </div>

            {/* 2. CARRUSEL DE FECHAS (SOLO DESKTOP) */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {fechasDisponibles.map(fecha => (
                    <button 
                        key={fecha}
                        onClick={() => setFechaSeleccionada(fecha)}
                        className={`shrink-0 snap-center px-6 py-2.5 rounded-xl border text-sm font-bold uppercase tracking-widest transition-all ${
                            fechaSeleccionada === fecha 
                            ? 'bg-orange-500 text-black border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                            : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                    >
                        {formatearNombreFecha(fecha)}
                    </button>
                ))}
            </div>

            {/* 3. BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                <div className="relative w-full">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por cliente..."
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    />
                </div>
                <div className="grid grid-cols-2 lg:flex gap-3">
                    <select
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none truncate"
                        value={filtroProfesional}
                        onChange={(e) => setFiltroProfesional(e.target.value)}
                    >
                        <option value="todos">Staff: Todos</option>
                        {staffDB.map(prof => (
                            <option key={prof._id} value={prof._id}>{prof.nombre}</option>
                        ))}
                    </select>

                    <select
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none truncate"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Estado: Todos</option>
                        <option value="confirmado">Pendientes</option>
                        <option value="completado">Asistieron</option>
                        <option value="falto">Faltaron</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                </div>
            </div>

            {/* 4. LISTA DE TURNOS */}
            <div className="sm:bg-zinc-900 sm:border border-white/5 sm:rounded-3xl sm:overflow-hidden flex flex-col">
                {/* Encabezados Desktop (Fijos arriba de la tabla) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-widest shrink-0">
                    <div className="col-span-2">Horario</div>
                    <div className="col-span-3">Cliente</div>
                    <div className="col-span-3">Servicio & Staff</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2 text-right">Acciones</div>
                </div>

                {/* 🔥 CONTENEDOR CON SCROLL MINIMALISTA Y ALTURA FIJA 🔥 */}
                <div className="flex flex-col gap-4 sm:block sm:divide-y sm:divide-white/5 max-h-[550px] overflow-y-auto sm:pr-1
                    [&::-webkit-scrollbar]:w-1.5 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:bg-zinc-800 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 
                    transition-colors"
                >
                    {turnosFiltrados.length === 0 ? (
                        <div className="bg-zinc-900 sm:bg-transparent border border-white/5 sm:border-0 rounded-2xl p-12 text-center">
                            <CalendarIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 font-bold">No hay turnos agendados para este día con los filtros aplicados.</p>
                        </div>
                    ) : (
                        turnosFiltrados.map((turno) => {
                            const clienteNombre = turno.clienteId ? `${turno.clienteId.nombre} ${turno.clienteId.apellido}` : 'Cliente Eliminado';
                            const servicioNombre = turno.servicios?.length > 0 ? turno.servicios.map((s:any) => s.nombre).join(' + ') : 'Servicio Eliminado';
                            const profesionalNombre = turno.peluqueroId?.nombre || 'Staff';
                            const precio = turno.precioTotal || 0;

                            return (
                                <div key={turno._id} className="bg-zinc-900 sm:bg-transparent border border-white/5 sm:border-0 rounded-2xl sm:rounded-none grid grid-cols-1 md:grid-cols-12 gap-y-3 gap-x-4 p-4 sm:p-6 items-center hover:bg-white/[0.02] transition-colors relative">
                                    
                                    <div className="col-span-2 flex items-center justify-between sm:justify-start gap-3 border-b border-white/5 sm:border-0 pb-3 sm:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <span className="text-2xl sm:text-xl font-black text-white">{formatearHora(turno.fechaHoraInicio)}</span>
                                        </div>
                                        <div className="block md:hidden">
                                            {renderEstadoBadge(turno.estado)}
                                        </div>
                                    </div>

                                    <div className="col-span-3 mt-1 sm:mt-0">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block md:hidden mb-0.5">Cliente</p>
                                        <div className="flex items-center justify-between sm:block">
                                            <p className="font-bold text-white text-lg">{clienteNombre}</p>
                                            <p className="text-sm text-emerald-400 sm:text-zinc-400 font-mono font-bold sm:font-normal">${precio.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block md:hidden mb-0.5 mt-2">Detalle</p>
                                        <p className="text-white font-medium text-sm sm:text-base leading-tight">{servicioNombre}</p>
                                        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">con <span className="text-orange-400 font-semibold">{profesionalNombre}</span></p>
                                    </div>

                                    <div className="col-span-2 hidden md:block">
                                        {renderEstadoBadge(turno.estado)}
                                    </div>

                                    <div className="col-span-2 flex items-center gap-2 mt-3 md:mt-0 md:justify-end">
                                        {turno.estado === 'confirmado' || turno.estado === 'pendiente' ? (
                                            <>
                                                <button title="Marcar como Asistió" className="flex-1 sm:flex-none flex justify-center p-3 sm:p-2.5 rounded-xl sm:rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border border-green-500/20 transition-all">
                                                    <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </button>
                                                <button title="Marcar como Faltó" className="flex-1 sm:flex-none flex justify-center p-3 sm:p-2.5 rounded-xl sm:rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all">
                                                    <XCircle className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </button>
                                                <button title="Cancelar Turno" className="flex-1 sm:flex-none flex justify-center p-3 sm:p-2.5 rounded-xl sm:rounded-lg bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 transition-all">
                                                    <Ban className="w-5 h-5 sm:w-4 sm:h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-full text-center sm:text-right py-2">
                                                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Cerrado</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
};