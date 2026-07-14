import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Search,
    Filter,
    Plus,
    CheckCircle2,
    XCircle,
    Ban,
    Clock
} from 'lucide-react';

export const TurnosAdminPage: React.FC = () => {
    // MOCK DATA (Luego lo conectamos a tu backend)
    const turnosMock = [
        { id: 1, hora: "10:00", cliente: "Marcos Pérez", servicio: "Skin Fade + Perfilado", profesional: "Benjamín", estado: "confirmado", precio: 12000 },
        { id: 2, hora: "10:45", cliente: "Tomás Gómez", servicio: "Corte Clásico", profesional: "Gonza", estado: "completado", precio: 10000 },
        { id: 3, hora: "11:30", cliente: "Julián Álvarez", servicio: "Ritual de Barba", profesional: "Valen", estado: "falto", precio: 8500 },
        { id: 4, hora: "15:00", cliente: "Ezequiel Ruiz", servicio: "Skin Fade", profesional: "Benjamín", estado: "confirmado", precio: 10000 },
    ];

    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroProfesional, setFiltroProfesional] = useState('todos');


    const turnosFiltrados = turnosMock.filter(turno => {
        const pasaFiltroEstado = filtroEstado === 'todos' || turno.estado === filtroEstado;
        const pasaFiltroProfesional = filtroProfesional === 'todos' || turno.profesional === filtroProfesional;

        return pasaFiltroEstado && pasaFiltroProfesional;
    });

    // Función para renderizar el "badge" (la etiqueta de color) según el estado
    const renderEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'confirmado':
                return <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold uppercase tracking-widest">Pendiente</span>;
            case 'completado':
                return <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-widest">Asistió</span>;
            case 'falto':
                return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-widest">Faltó</span>;
            case 'cancelado':
                return <span className="px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-xs font-bold uppercase tracking-widest">Cancelado</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* 1. HEADER Y BOTÓN NUEVO TURNO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Agenda de Turnos.</h1>
                    <p className="text-zinc-400 mt-1">Gestioná las reservas y la asistencia del día.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20">
                    <Plus className="w-5 h-5" /> Nuevo Turno Manual
                </button>
            </div>

            {/* 2. BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4">

                {/* Buscador de Cliente */}
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente..."
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                </div>

                {/* Filtros Rápidos */}
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
                    <button className="flex items-center gap-2 px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-sm font-bold hover:border-orange-500/50 transition-colors whitespace-nowrap">
                        <CalendarIcon className="w-4 h-4 text-orange-500" /> Hoy
                    </button>

                    {/* 🔥 NUEVO: FILTRO POR PROFESIONAL */}
                    <select
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none"
                        value={filtroProfesional}
                        onChange={(e) => setFiltroProfesional(e.target.value)}
                    >
                        <option value="todos">Todos los Barberos</option>
                        <option value="Benjamín">Benjamín</option>
                        <option value="Gonza">Gonza</option>
                        <option value="Valen">Valen</option>
                    </select>

                    {/* FILTRO POR ESTADO */}
                    <select
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="confirmado">Pendientes</option>
                        <option value="completado">Asistieron</option>
                        <option value="falto">Faltaron</option>
                    </select>
                </div>
            </div>

            {/* 3. LISTA DE TURNOS (ESTILO TARJETAS APILADAS) */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">

                {/* Encabezados (Solo visible en desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <div className="col-span-2">Horario</div>
                    <div className="col-span-3">Cliente</div>
                    <div className="col-span-3">Servicio & Staff</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2 text-right">Acciones</div>
                </div>

                {/* Filas de Turnos */}
                <div className="divide-y divide-white/5">
                    {turnosMock.map((turno) => (
                        <div key={turno.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors">

                            {/* Horario */}
                            <div className="col-span-2 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                                <span className="text-xl font-black text-white">{turno.hora}</span>
                            </div>

                            {/* Cliente */}
                            <div className="col-span-3">
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest block md:hidden mb-1">Cliente</p>
                                <p className="font-bold text-white text-lg">{turno.cliente}</p>
                                <p className="text-sm text-zinc-400 font-mono">${turno.precio.toLocaleString()}</p>
                            </div>

                            {/* Servicio y Profesional */}
                            <div className="col-span-3">
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest block md:hidden mb-1 mt-3">Detalle</p>
                                <p className="text-white font-medium">{turno.servicio}</p>
                                <p className="text-sm text-zinc-400">con <span className="text-orange-400 font-semibold">{turno.profesional}</span></p>
                            </div>

                            {/* Estado */}
                            <div className="col-span-2">
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest block md:hidden mb-2 mt-3">Estado</p>
                                {renderEstadoBadge(turno.estado)}
                            </div>

                            {/* Botones de Acción */}
                            <div className="col-span-2 flex items-center md:justify-end gap-2 mt-4 md:mt-0">
                                {turno.estado === 'confirmado' ? (
                                    <>
                                        <button title="Marcar como Asistió" className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border border-green-500/20 transition-all">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                        <button title="Marcar como Faltó" className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                        <button title="Cancelar Turno" className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 transition-all">
                                            <Ban className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Sin acciones</span>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};