
import { 
  DollarSign, Users, Calendar as CalendarIcon, Scissors, 
  Clock, Plus, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
  // MOCK DATA (Luego esto vendrá de tu backend)
  const metricas = {
    turnosHoy: 24,
    ingresosHoy: 250000,
    nuevosClientes: 12,
    servicioEstrella: "Skin Fade"
  };

  const agendaCaliente = [
    { id: 1, cliente: "Lucas", servicio: "Corte Clásico", hora: "14:30", profesional: "Gonza", estado: "pendiente" },
    { id: 2, cliente: "Matías", servicio: "Skin Fade + Barba", hora: "15:00", profesional: "Benjamín", estado: "en_curso" },
    { id: 3, cliente: "Ezequiel", servicio: "Colorimetría", hora: "15:45", profesional: "Valen", estado: "pendiente" },
  ];

  const rankingStaff = [
    { nombre: "Benjamín", turnos: 10, totalHoy: 12 },
    { nombre: "Gonza", turnos: 8, totalHoy: 10 },
    { nombre: "Valen", turnos: 6, totalHoy: 6 },
  ];

  return (
    <div className="min-h-screen bg-black pt-8 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Panel de Control.</h1>
          <p className="text-zinc-400 mt-1">Hola Benjamín, este es el resumen de tu local hoy.</p>
        </div>

        {/* 1. MÉTRICAS RÁPIDAS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
            <CalendarIcon className="w-6 h-6 text-orange-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Turnos de Hoy</p>
            <h2 className="text-3xl font-black text-white mt-1">{metricas.turnosHoy}</h2>
          </div>
          
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
            <DollarSign className="w-6 h-6 text-green-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Ingresos Est.</p>
            <h2 className="text-3xl font-black text-white mt-1">${metricas.ingresosHoy.toLocaleString()}</h2>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
            <Users className="w-6 h-6 text-blue-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Nuevos Clientes</p>
            <h2 className="text-3xl font-black text-white mt-1">{metricas.nuevosClientes} <span className="text-sm font-normal text-zinc-500">este mes</span></h2>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
            <Scissors className="w-6 h-6 text-purple-500 mb-4" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Top Servicio</p>
            <h2 className="text-xl font-black text-white mt-2">{metricas.servicioEstrella}</h2>
          </div>
        </div>

        {/* GRILLA PRINCIPAL (Agenda + Ranking/Acciones) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. LA AGENDA CALIENTE (Ocupa 2 columnas en pantallas grandes) */}
          <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" /> Agenda Caliente
              </h3>
              <button className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors">
                Ver todo
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {agendaCaliente.map(turno => (
                <div key={turno.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-black text-orange-500">{turno.hora}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{turno.cliente}</h4>
                      <p className="text-zinc-400 text-sm">{turno.servicio} • Con <span className="text-orange-400 font-semibold">{turno.profesional}</span></p>
                    </div>
                  </div>
                  
                  {/* Botones de Acción Rápida */}
                  <div className="flex gap-2 shrink-0">
                    <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all border border-green-500/20" title="Marcar como Asistió">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20" title="Marcar como Faltó">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6 flex flex-col">
            
            {/* 3. BOTONES SALVAVIDAS */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-500 text-black hover:bg-orange-400 transition-all font-bold text-sm">
                  <Plus className="w-6 h-6" /> Turno Manual
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-black border border-white/10 text-white hover:bg-zinc-800 transition-all font-bold text-sm text-center">
                  <AlertCircle className="w-6 h-6 text-red-500" /> Bloquear Horario
                </button>
              </div>
            </div>

            {/* 4. RENDIMIENTO DEL STAFF */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex-1">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Staff del Día</h3>
              <div className="space-y-5">
                {rankingStaff.map((barbero, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-white">{barbero.nombre}</span>
                      <span className="text-xs text-zinc-400 font-mono">{barbero.turnos} / {barbero.totalHoy} turnos</span>
                    </div>
                    {/* Barra de progreso */}
                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${(barbero.turnos / barbero.totalHoy) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};