import Turno, { ITurno } from '../models/Turno';
import Servicio from '../models/Servicio';

interface ReservaData {
  clienteId: string;
  peluqueroId: string;
  servicios: string[]; // Array de IDs de los servicios elegidos
  fechaHoraInicio: string; // Recibimos un string ISO del frontend (ej: "2026-07-03T15:00:00.000Z")
}

// 🔥 OBTENER LOS TURNOS DEL CLIENTE LOGUEADO
export const obtenerMisTurnosService = async (idDelCliente: string) => {
  return await Turno.find({ clienteId: idDelCliente })
    // Le decimos a Mongoose EXPLÍCITAMENTE que peluqueroId está en la tabla 'Usuario'
    .populate({
      path: 'peluqueroId',
      model: 'Usuario', // 🔥 Esto evita el error de "Use mongoose.model"
      select: 'nombre apellido avatar tituloProfesional'
    })
    // Le decimos a Mongoose EXPLÍCITAMENTE que servicios está en la tabla 'Servicio'
    .populate({
      path: 'servicios',
      model: 'Servicio', // 🔥 Esto le dice en qué colección buscar
      select: 'nombre precio duracionMinutos'
    })
    .sort({ fechaHoraInicio: 1 });
};

// 🔥 CANCELAR UN TURNO
export const cancelarTurnoService = async (turnoId: string, idDelCliente: string) => {
  // Buscamos el turno por su ID y validamos que el clienteId coincida
  return await Turno.findOneAndUpdate(
    { _id: turnoId, clienteId: idDelCliente }, // 🔥 Acá usamos clienteId
    { estado: 'cancelado' }, // Lo pasamos a cancelado
   { returnDocument: 'after' }
  );
};

export const reservarTurno = async (datos: ReservaData) => {
  const { clienteId, peluqueroId, servicios, fechaHoraInicio } = datos;

  // 1. Calcular la duración total buscando los servicios en la base de datos
  const serviciosDB = await Servicio.find({ _id: { $in: servicios } });
  if (serviciosDB.length === 0) {
    throw new Error('No se encontraron los servicios seleccionados');
  }

  const duracionTotalMinutos = serviciosDB.reduce((total: number, serv: any) => total + serv.duracionMinutos, 0);
  const precioTotal = serviciosDB.reduce((total: number, serv: any) => total + serv.precio, 0);

  // 2. Calcular la fecha y hora de fin del turno
  const inicio = new Date(fechaHoraInicio);
  const fin = new Date(inicio.getTime() + duracionTotalMinutos * 60000);

  // 3. Validar disponibilidad del peluquero (Control de solapamiento)
  const turnoSolapado = await Turno.findOne({
    peluqueroId,
    estado: { $in: ['pendiente', 'confirmado'] },
    fechaHoraInicio: { $lt: fin },
    fechaHoraFin: { $gt: inicio }
  });

  if (turnoSolapado) {
    throw new Error('El profesional ya tiene un turno reservado en ese horario');
  }

  // 4. Crear el turno (Estado 'confirmado' de una, porque paga en el local)
  const nuevoTurno = new Turno({
    clienteId,
    peluqueroId,
    servicios,
    fechaHoraInicio: inicio,
    fechaHoraFin: fin,
    precioTotal,
    señaPagada: false, // No hay seña por ahora
    estado: 'confirmado'
  });

  return await nuevoTurno.save();
};

export const obtenerTurnosOcupadosService = async (peluqueroId: string, fecha: string) => {
    const inicioDia = new Date(`${fecha}T00:00:00.000-03:00`);
    const finDia = new Date(`${fecha}T23:59:59.999-03:00`);

    // Busca turnos que NO estén cancelados
    const turnosExistentes = await Turno.find({
        peluqueroId: peluqueroId,
        fechaHoraInicio: { $gte: inicioDia, $lte: finDia },
        estado: { $in: ['confirmado', 'pendiente'] } 
    });

    // Devuelve un array de objetos con el inicio y fin exacto de cada turno ocupado
    return turnosExistentes.map(t => ({
        inicio: t.fechaHoraInicio,
        fin: t.fechaHoraFin
    }));
};

// Obtener la agenda de un peluquero específico para un día
export const obtenerAgendaPeluquero = async (peluqueroId: string, fechaStr: string) => {
  const inicioDia = new Date(fechaStr);
  inicioDia.setHours(0, 0, 0, 0);

  const finDia = new Date(fechaStr);
  finDia.setHours(23, 59, 59, 999);

  return await Turno.find({
    peluqueroId,
    fechaHoraInicio: { $gte: inicioDia, $lte: finDia },
    estado: { $ne: 'cancelado' }
  }).populate('clienteId', 'nombre apellido')
    .populate('servicios', 'nombre precio');
};

// 🔥 OBTENER TODOS LOS TURNOS DE HOY (Para el Dashboard Admin)
export const obtenerTurnosHoyAdminService = async () => {
    // 1. Armamos las fechas de forma segura para no mutar el mismo objeto
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    // 2. Buscamos y poblamos EXPLÍCITAMENTE (Esto evita el error 500 de Mongoose)
    return await Turno.find({
        fechaHoraInicio: { $gte: inicioDia, $lte: finDia }
    })
    .populate({
        path: 'clienteId',
        model: 'Usuario', // Le decimos de qué tabla sacar al cliente
        select: 'nombre apellido'
    })
    .populate({
        path: 'peluqueroId',
        model: 'Usuario', // Le decimos de qué tabla sacar al peluquero
        select: 'nombre apellido avatar'
    })
    .populate({
        path: 'servicios',
        model: 'Servicio', // Le decimos de qué tabla sacar los servicios
        select: 'nombre precio'
    })
    .sort({ fechaHoraInicio: 1 }); // Ordenados por hora
};


export const obtenerTurnosSemanaAdminService = async () => {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finSemana = new Date();
    finSemana.setDate(finSemana.getDate() + 7); // Tope de 7 días
    finSemana.setHours(23, 59, 59, 999);

    return await Turno.find({
        fechaHoraInicio: { $gte: inicioDia, $lte: finSemana }
    })
    .populate({ path: 'clienteId', model: 'Usuario', select: 'nombre apellido' })
    .populate({ path: 'peluqueroId', model: 'Usuario', select: 'nombre apellido avatar' })
    .populate({ path: 'servicios', model: 'Servicio', select: 'nombre precio' })
    .sort({ fechaHoraInicio: 1 }); // Orden cronológico
};