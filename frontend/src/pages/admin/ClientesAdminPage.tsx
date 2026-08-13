import React, { useState, useEffect } from 'react';
import {
    Users, Search, CalendarPlus, AlertTriangle,
    Ban, ShieldAlert, History, DollarSign, X, CheckCircle2, Star, Plus, Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getClientes, crearCliente, actualizarCliente } from '../../services/cliente.service';

export const ClientesAdminPage: React.FC = () => {
    const { token } = useAuthStore();
    const [clientesDB, setClientesDB] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    
    // Panel lateral
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any | null>(null);

    // Modal Crear Cliente
    const [modalCrear, setModalCrear] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', telefono: '', dni: '' });

    const cargarClientes = async () => {
        try {
            setCargando(true);
            const data = await getClientes(token!);
            setClientesDB(data);
        } catch (error) {
            console.error("Error al cargar clientes", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, [token]);

    const handleCrearCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await crearCliente(formData, token!);
            await cargarClientes();
            setModalCrear(false);
            setFormData({ nombre: '', apellido: '', email: '', telefono: '', dni: '' });
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    // Funciones CRM (Actualizan al cliente al vuelo)
    const toggleEstadoCliente = async (id: string, activo: boolean) => {
        try {
            await actualizarCliente(id, { activo }, token!);
            setClienteSeleccionado((prev: any) => ({ ...prev, activo }));
            cargarClientes();
        } catch (error: any) { alert(error.message); }
    };

    const toggleVIP = async (id: string, exentoSena: boolean) => {
        try {
            await actualizarCliente(id, { exentoSena }, token!);
            setClienteSeleccionado((prev: any) => ({ ...prev, exentoSena }));
            cargarClientes();
        } catch (error: any) { alert(error.message); }
    };

    // Buscador por nombre, apellido o DNI
    const clientesFiltrados = clientesDB.filter(c => {
        const termino = busqueda.toLowerCase();
        const nombreCompleto = `${c.nombre} ${c.apellido}`.toLowerCase();
        const dni = c.dni ? c.dni.toLowerCase() : '';
        return nombreCompleto.includes(termino) || dni.includes(termino);
    });

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn relative pb-24">

            {/* 1. HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-orange-500" /> CRM Clientes.
                    </h1>
                    <p className="text-zinc-400 mt-1">Historial, fidelidad y control de la base de datos.</p>
                </div>
                <button 
                    onClick={() => setModalCrear(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" /> Nuevo Cliente
                </button>
            </div>

            {/* 2. BARRA DE BÚSQUEDA */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                <div className="relative">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre, apellido o DNI..."
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
                    {clientesFiltrados.map((cliente) => {
                        const faltas = cliente.faltas || 0;
                        const gastado = cliente.totalGastado || 0;
                        const completados = cliente.turnosCompletados || 0;

                        return (
                            <div key={cliente._id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors ${!cliente.activo ? 'opacity-50' : ''}`}>
                                
                                {/* Info Cliente */}
                                <div className="col-span-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-lg text-orange-400 shrink-0">
                                        {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                                            {cliente.nombre} {cliente.apellido}
                                            {cliente.exentoSena && <Star className="w-3 h-3 text-green-500 fill-green-500"  />}
                                        </h4>
                                        <p className="text-zinc-500 text-sm">{cliente.telefono || cliente.email}</p>
                                    </div>
                                </div>

                                {/* Rendimiento */}
                                <div className="col-span-3 flex flex-col items-start md:items-center justify-center mt-2 md:mt-0">
                                    <p className="text-sm font-bold text-white flex items-center gap-1"><History className="w-4 h-4 text-orange-500" /> {completados} turnos</p>
                                    <p className="text-xs text-zinc-500 font-mono mt-1">${gastado.toLocaleString()} gastados</p>
                                </div>

                                {/* Riesgo / Faltas */}
                                <div className="col-span-3 flex items-center justify-start md:justify-center mt-2 md:mt-0">
                                    {!cliente.activo ? (
                                        <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <Ban className="w-3 h-3" /> Suspendido
                                        </span>
                                    ) : faltas === 0 ? (
                                        <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Al Día
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> {faltas} Falta{faltas > 1 ? 's' : ''}
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
                        )
                    })}
                </div>
            </div>

            {/* ========================================================= */}
            {/* PANEL LATERAL (SLIDE-OVER) DEL PERFIL DEL CLIENTE         */}
            {/* ========================================================= */}
            {clienteSeleccionado && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setClienteSeleccionado(null)}></div>
                    <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 h-full shadow-2xl flex flex-col animate-slideInRight">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 shrink-0">
                            <h2 className="text-xl font-black text-white">Radiografía del Cliente</h2>
                            <button onClick={() => setClienteSeleccionado(null)} className="p-2 bg-black rounded-lg text-zinc-500 hover:text-white transition-colors border border-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-orange-500 flex items-center justify-center font-black text-3xl text-orange-400 mx-auto shadow-lg shadow-orange-500/20 mb-4">
                                    {clienteSeleccionado.nombre.charAt(0)}{clienteSeleccionado.apellido.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-black text-white">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</h3>
                                <p className="text-zinc-500">{clienteSeleccionado.email}</p>
                                <p className="text-zinc-500 font-mono mt-1">{clienteSeleccionado.telefono || 'Sin teléfono'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                                    <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Gastado</p>
                                    <p className="text-lg font-black text-white mt-1">${(clienteSeleccionado.totalGastado || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                                    <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${(clienteSeleccionado.faltas || 0) > 0 ? 'text-red-500' : 'text-zinc-500'}`} />
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No-Shows</p>
                                    <p className={`text-lg font-black mt-1 ${(clienteSeleccionado.faltas || 0) > 0 ? 'text-red-500' : 'text-white'}`}>{(clienteSeleccionado.faltas || 0)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Acciones CRM</h4>

                                <button onClick={() => toggleVIP(clienteSeleccionado._id, !clienteSeleccionado.exentoSena)} 
                                    className={`w-full flex items-center justify-between p-4 bg-black border rounded-xl transition-all font-bold ${
                                    clienteSeleccionado.exentoSena ? 'border-green-500/50 text-green-500 hover:bg-green-500/10' : 'border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-500'
                                }`}>
                                    <span className="flex items-center gap-2">
                                        <Star className={`w-5 h-5 ${clienteSeleccionado.exentoSena ? 'fill-green-500' : ''}`} />
                                        {clienteSeleccionado.exentoSena ? 'Quitar VIP (Volver a pedir seña)' : 'Hacer VIP (Eximir de Seña)'}
                                    </span>
                                </button>

                                <button onClick={() => toggleEstadoCliente(clienteSeleccionado._id, !clienteSeleccionado.activo)}
                                    className={`w-full flex items-center justify-between p-4 bg-black border rounded-xl transition-all font-bold ${
                                    !clienteSeleccionado.activo ? 'border-orange-500/50 text-orange-500 hover:bg-orange-500/10' : 'border-red-500/30 hover:border-red-500 text-red-500'
                                }`}>
                                    <span className="flex items-center gap-2">
                                        <Ban className="w-5 h-5" /> 
                                        {!clienteSeleccionado.activo ? 'Desbloquear Cuenta' : 'Suspender Cuenta'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL CREAR CLIENTE MANUAL                                */}
            {/* ========================================================= */}
            {modalCrear && (
                <div className="fixed inset-0 z-[100] flex justify-center sm:items-center items-end p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-zinc-950 sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slideUp sm:animate-scaleIn max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-black text-white">Nuevo Cliente</h2>
                            <button onClick={() => setModalCrear(false)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCrearCliente} className="overflow-y-auto p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Nombre</label>
                                    <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500" placeholder="Juan" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Apellido</label>
                                    <input required type="text" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500" placeholder="Pérez" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">DNI (Opcional)</label>
                                <input type="text" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500" placeholder="Sin puntos" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500" placeholder="correo@ejemplo.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Teléfono</label>
                                <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500" placeholder="+54..." />
                            </div>
                            <div className="pt-4 border-t border-white/5 flex gap-3">
                                <button type="button" onClick={() => setModalCrear(false)} className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" disabled={guardando} className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest rounded-xl transition-all flex justify-center gap-2">
                                    {guardando ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};