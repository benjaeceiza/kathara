import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Calendar as CalendarIcon, Scissors, 
  Clock, Plus, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { obtenerTurnosHoyAdmin } from '../../services/turno.service';
import { getStaff } from '../../services/staff.service'; 

export const DashboardAdmin: React.FC = () => {
  const { token, usuario } = useAuthStore();
  
  const [turnosHoy, setTurnosHoy] = useState<any[]>([]);
  const [staffDB, setStaffDB] = useState<any[]>([]); 
  const [filtroPeluquero, setFiltroPeluquero] = useState('todos'); 
  const [cargando, setCargando] = useState(true);

  const [metricas, setMetricas] = useState({
    totalTurnos: 0,
    ingresosHoy: 0,
    nuevosClientes: 0, 
    servicioEstrella: "Calculando..."
  });

  const [rankingStaff, setRankingStaff] = useState<any[]>([]);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setCargando(true);
        const [turnos, staffData] = await Promise.all([
            obtenerTurnosHoyAdmin(token),
            getStaff(token)
        ]);
        
        setTurnosHoy(turnos);
        calcularMetricas(turnos);
        setStaffDB(staffData.filter((p: any) => p.activo)); 

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, [token]);

  const calcularMetricas = (turnos: any[]) => {
    const turnosValidos = turnos.filter(t => t.estado !== 'cancelado' && t.estado !== 'falto');
    const ingresos = turnosValidos.reduce((acc, t) => acc + (t.precioTotal || 0), 0);

    const conteoServicios: Record<string, number> = {};
    turnosValidos.forEach(t => {
      t.servicios?.forEach((s: any) => {
        conteoServicios[s.nombre] = (conteoServicios[s.nombre] || 0) + 1;
      });
    });
    
    let estrella = "Sin datos";
    let maxCount = 0;
    for (const [nombre, count] of Object.entries(conteoServicios)) {
      if (count > maxCount) {
        maxCount = count;
        estrella = nombre;
      }
    }

    const conteoStaff: Record<string, { turnos: number, totalHoy: number }> = {};
    turnos.forEach(t => {
      const nombreBarbero = t.peluqueroId?.nombre || 'Sin Asignar';
      if (!conteoStaff[nombreBarbero]) {
        conteoStaff[nombreBarbero] = { turnos: 0, totalHoy: turnos.length }; 
      }
      if(t.estado !== 'cancelado') {
        conteoStaff[nombreBarbero].turnos += 1;
      }
    });

    const rankingArray = Object.keys(conteoStaff).map(nombre => ({
      nombre,
      turnos: conteoStaff[nombre].turnos,
      totalHoy: conteoStaff[nombre].totalHoy
    })).sort((a, b) => b.turnos - a.turnos); 

    setMetricas({
      totalTurnos: turnosValidos.length,
      ingresosHoy: ingresos,
      nuevosClientes: 3, 
      servicioEstrella: estrella
    });

    setRankingStaff(rankingArray);
  };

  const formatearHora = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const turnosFiltrados = turnosHoy.filter(turno => {
    if (filtroPeluquero === 'todos') return true;
    return turno.peluqueroId?._id === filtroPeluquero;
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-8 pb-24 px-4 sm:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Panel de Control.</h1>
          <p className="text-zinc-400 mt-1">Hola {usuario?.nombre || 'Admin'}, este es el resumen de tu local hoy.</p>
        </div>

        {/* 1. MÉTRICAS RÁPIDAS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>
            <CalendarIcon className="w-6 h-6 text-orange-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Turnos de Hoy</p>
            <h2 className="text-3xl font-black text-white mt-1">{metricas.totalTurnos}</h2>
          </div>
          
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
            <DollarSign className="w-6 h-6 text-green-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Ingresos Est.</p>
            <h2 className="text-3xl font-black text-white mt-1">${metricas.ingresosHoy.toLocaleString()}</h2>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl group hover:border-blue-500/30 transition-colors">
            <Users className="w-6 h-6 text-blue-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Nuevos Clientes</p>
            <h2 className="text-3xl font-black text-white mt-1">+{metricas.nuevosClientes} <span className="text-sm font-normal text-zinc-500">hoy</span></h2>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl group hover:border-purple-500/30 transition-colors">
            <Scissors className="w-6 h-6 text-purple-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Top Servicio</p>
            <h2 className="text-xl font-black text-white mt-2 truncate" title={metricas.servicioEstrella}>{metricas.servicioEstrella}</h2>
          </div>
        </div>

        {/* GRILLA PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. LA AGENDA CALIENTE */}
          <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" /> Agenda Caliente
              </h3>
              
              <div className="flex items-center gap-3">
                <select
                  value={filtroPeluquero}
                  onChange={(e) => setFiltroPeluquero(e.target.value)}
                  className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer appearance-none"
                >
                  <option value="todos">Todos los Profesionales</option>
                  {staffDB.map(prof => (
                    <option key={prof._id} value={prof._id}>{prof.nombre} {prof.apellido}</option>
                  ))}
                </select>
                
                <a href="/admin/turnos" className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors whitespace-nowrap">
                  Ver todo
                </a>
              </div>
            </div>

            {/* 🔥 CONTENEDOR CON SCROLL MINIMALISTA Y ALTURA FIJA 🔥 */}
            <div className="space-y-3 flex-1 max-h-[450px] overflow-y-auto pr-2 
              [&::-webkit-scrollbar]:w-1.5 
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-zinc-800 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 
              transition-colors"
            >
              {turnosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-2xl">
                  <CalendarIcon className="w-8 h-8 text-zinc-600 mb-2" />
                  <p className="text-zinc-400 font-bold">No hay turnos para {filtroPeluquero !== 'todos' ? 'este profesional' : 'hoy'}</p>
                </div>
              ) : (
                turnosFiltrados.map(turno => {
                  const clienteNombre = turno.clienteId ? `${turno.clienteId.nombre} ${turno.clienteId.apellido}` : 'Cliente Eliminado';
                  const servicioNombre = turno.servicios?.length > 0 ? turno.servicios.map((s:any) => s.nombre).join(' + ') : 'Servicio';
                  const profesionalNombre = turno.peluqueroId?.nombre || 'Staff';

                  return (
                    <div key={turno._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center shrink-0">
                          <span className="text-sm font-black text-orange-500">{formatearHora(turno.fechaHoraInicio)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            {clienteNombre}
                            {turno.estado === 'cancelado' && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md uppercase tracking-wider">Cancelado</span>}
                          </h4>
                          <p className="text-zinc-400 text-sm">{servicioNombre} • Con <span className="text-orange-400 font-semibold">{profesionalNombre}</span></p>
                        </div>
                      </div>
                      
                      {turno.estado === 'confirmado' || turno.estado === 'pendiente' ? (
                        <div className="flex gap-2 shrink-0">
                          <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all border border-green-500/20" title="Marcar como Asistió">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20" title="Marcar como Faltó">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{turno.estado}</span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6 flex flex-col">
            
            {/* 3. BOTONES SALVAVIDAS */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="/reservar" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-500 text-black hover:bg-orange-400 transition-all font-bold text-sm text-center">
                  <Plus className="w-6 h-6" /> Turno Manual
                </a>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-black border border-white/10 text-white hover:bg-zinc-800 transition-all font-bold text-sm text-center">
                  <AlertCircle className="w-6 h-6 text-red-500" /> Bloquear Horario
                </button>
              </div>
            </div>

            {/* 4. RENDIMIENTO DEL STAFF */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex-1">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Staff del Día</h3>
              <div className="space-y-5">
                {rankingStaff.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center">Sin turnos para evaluar</p>
                ) : (
                  rankingStaff.map((barbero, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-white">{barbero.nombre}</span>
                        <span className="text-xs text-zinc-400 font-mono">{barbero.turnos} / {barbero.totalHoy} turnos locales</span>
                      </div>
                      <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${barbero.totalHoy > 0 ? (barbero.turnos / barbero.totalHoy) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};