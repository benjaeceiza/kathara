import { useState } from 'react';
import {
    Users, Search, CalendarPlus, AlertTriangle,
    Ban, ShieldAlert, History, DollarSign, X, CheckCircle2, Star
} from 'lucide-react';

export const ClientesAdminPage: React.FC = () => {
    // MOCK DATA: Radiografía de tus clientes
    const [clientesMock, setClientesMock] = useState([
        {
            _id: '1', nombre: "Lucas", apellido: "Martínez", email: "lucas@gmail.com", telefono: "+54 2657 111111",
            faltas: 0, turnosCompletados: 12, totalGastado: 145000, estado: 'activo', ultimoTurno: "2026-07-10"
        },
        {
            _id: '2', nombre: "Matías", apellido: "Fernández", email: "matias@gmail.com", telefono: "+54 2657 222222",
            faltas: 1, turnosCompletados: 3, totalGastado: 32000, estado: 'advertencia', ultimoTurno: "2026-06-25"
        },
        {
            _id: '3', nombre: "Ezequiel", apellido: "García", email: "eze@gmail.com", telefono: "+54 2657 333333",
            faltas: 3, turnosCompletados: 1, totalGastado: 10000, estado: 'suspendido', ultimoTurno: "2026-05-12"
        },
    ]);

    const [busqueda, setBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any | null>(null);

    const clientesFiltrados = clientesMock.filter(c =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn relative">

            {/* 1. HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-orange-500" /> CRM Clientes.
                    </h1>
                    <p className="text-zinc-400 mt-1">Historial, fidelidad y control de reservas (No-shows).</p>
                </div>
            </div>

            {/* 2. BARRA DE BÚSQUEDA */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                <div className="relative">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre o apellido..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                </div>
            </div>

            {/* 3. LISTA DE CLIENTES */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <div className="col-span-4">Cliente</div>
                    <div className="col-span-3 text-center">Rendimiento</div>
                    <div className="col-span-3 text-center">Estado / Riesgo</div>
                    <div className="col-span-2 text-right">Acción</div>
                </div>

                <div className="divide-y divide-white/5">
                    {clientesFiltrados.map((cliente) => (
                        <div key={cliente._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors">

                            {/* Info Cliente */}
                            <div className="col-span-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-lg text-orange-400 shrink-0">
                                    {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg leading-tight">{cliente.nombre} {cliente.apellido}</h4>
                                    <p className="text-zinc-500 text-sm">{cliente.telefono}</p>
                                </div>
                            </div>

                            {/* Rendimiento */}
                            <div className="col-span-3 flex flex-col items-start md:items-center justify-center mt-2 md:mt-0">
                                <p className="text-sm font-bold text-white flex items-center gap-1"><History className="w-4 h-4 text-orange-500" /> {cliente.turnosCompletados} turnos</p>
                                <p className="text-xs text-zinc-500 font-mono mt-1">${cliente.totalGastado.toLocaleString()} gastados</p>
                            </div>

                            {/* Riesgo / Faltas */}
                            <div className="col-span-3 flex items-center justify-start md:justify-center mt-2 md:mt-0">
                                {cliente.faltas === 0 ? (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> VIP
                                    </span>
                                ) : cliente.faltas < 2 ? (
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> {cliente.faltas} Falta
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Ban className="w-3 h-3" /> Bloqueado
                                    </span>
                                )}
                            </div>

                            {/* Acción */}
                            <div className="col-span-2 flex justify-start md:justify-end mt-4 md:mt-0">
                                <button
                                    onClick={() => setClienteSeleccionado(cliente)}
                                    className="px-4 py-2 bg-black border border-white/10 hover:border-orange-500/50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Ver Perfil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========================================================= */}
            {/* 4. PANEL LATERAL (SLIDE-OVER) DEL PERFIL DEL CLIENTE      */}
            {/* ========================================================= */}
            {clienteSeleccionado && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Fondo oscuro desenfocado (Click para cerrar) */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setClienteSeleccionado(null)}
                    ></div>

                    {/* Panel Lateral */}
                    <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 h-full shadow-2xl flex flex-col animate-slideInRight">

                        {/* Header del Panel */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Radiografía del Cliente</h2>
                            <button onClick={() => setClienteSeleccionado(null)} className="p-2 bg-black rounded-lg text-zinc-500 hover:text-white transition-colors border border-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido scrolleable */}
                        <div className="p-6 flex-1 overflow-y-auto space-y-8">

                            {/* Tarjeta Principal */}
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-orange-500 flex items-center justify-center font-black text-3xl text-orange-400 mx-auto shadow-lg shadow-orange-500/20 mb-4">
                                    {clienteSeleccionado.nombre.charAt(0)}{clienteSeleccionado.apellido.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-black text-white">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</h3>
                                <p className="text-zinc-500">{clienteSeleccionado.email}</p>
                                <p className="text-zinc-500 font-mono mt-1">{clienteSeleccionado.telefono}</p>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                                    <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Gastado</p>
                                    <p className="text-lg font-black text-white mt-1">${clienteSeleccionado.totalGastado.toLocaleString()}</p>
                                </div>
                                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                                    <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${clienteSeleccionado.faltas > 0 ? 'text-red-500' : 'text-zinc-500'}`} />
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No-Shows</p>
                                    <p className={`text-lg font-black mt-1 ${clienteSeleccionado.faltas > 0 ? 'text-red-500' : 'text-white'}`}>{clienteSeleccionado.faltas}</p>
                                </div>
                            </div>

                            {/* Acciones Rápidas (El verdadero CRM) */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Acciones de Administrador</h4>

                                <button className="w-full flex items-center justify-between p-4 bg-orange-500 hover:bg-orange-400 text-black rounded-xl transition-all font-bold">
                                    <span className="flex items-center gap-2"><CalendarPlus className="w-5 h-5" /> Agendarle un Turno Manual</span>
                                </button>

                                {/* 🔥 NUEVO BOTÓN: EXIMIR DE SEÑA (VIP) */}
                                <button className={`w-full flex items-center justify-between p-4 bg-black border rounded-xl transition-all font-bold ${clienteSeleccionado.exentoSena
                                        ? 'border-green-500/50 text-green-500 hover:bg-green-500/10'
                                        : 'border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-500'
                                    }`}>
                                    <span className="flex items-center gap-2">
                                        <Star className={`w-5 h-5 ${clienteSeleccionado.exentoSena ? 'fill-green-500' : ''}`} />
                                        {clienteSeleccionado.exentoSena ? 'Cliente VIP (Exento de Seña)' : 'Eximir de Seña (Hacer VIP)'}
                                    </span>
                                </button>

                                {/* Castigo 1: Exigir 100% */}
                                <button className="w-full flex items-center justify-between p-4 bg-black border border-yellow-500/30 hover:border-yellow-500 text-yellow-500 rounded-xl transition-all font-bold">
                                    <span className="flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Exigir Pago Adelantado (100%)</span>
                                </button>

                                {/* Castigo 2: Suspender */}
                                <button className="w-full flex items-center justify-between p-4 bg-black border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl transition-all font-bold">
                                    <span className="flex items-center gap-2"><Ban className="w-5 h-5" /> Suspender Cuenta</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};