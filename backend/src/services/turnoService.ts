import Turno, { ITurno } from '../models/Turno';
import Servicio from '../models/Servicio';

interface ReservaData {
  clienteId: string;
  peluqueroId: string;
  servicios: string[]; // Array de IDs de los servicios elegidos
  fechaHoraInicio: string; // Recibimos un string ISO del frontend (ej: "2026-07-03T15:00:00.000Z")
}

export const reservarTurno = async (datos: ReservaData) => {
  const { clienteId, peluqueroId, servicios, fechaHoraInicio } = datos;

  // 1. Calcular la duración total buscando los servicios en la base de datos
  const serviciosDB = await Servicio.find({ _id: { $in: servicios } });
  if (serviciosDB.length === 0) {
    throw new Error('No se encontraron los servicios seleccionados');
  }

  const duracionTotalMinutos = serviciosDB.reduce((total, serv) => total + serv.duracionMinutos, 0);
  const precioTotal = serviciosDB.reduce((total, serv) => total + serv.precio, 0);

  // 2. Calcular la fecha y hora de fin del turno
  const inicio = new Date(fechaHoraInicio);
  const fin = new Date(inicio.getTime() + duracionTotalMinutos * 60000); // 60000 ms = 1 minuto

  // 3. Validar disponibilidad del peluquero (Control de solapamiento)
  const turnoSolapado = await Turno.findOne({
    peluqueroId,
    estado: { $in: ['pendiente', 'confirmado'] }, // Solo molestan los turnos activos
    fechaHoraInicio: { $lt: fin },
    fechaHoraFin: { $gt: inicio }
  });

  if (turnoSolapado) {
    throw new Error('El peluquero ya tiene un turno reservado en ese horario');
  }

  // 4. Calcular seña (ejemplo: 20% del total, ajustable si querés)
  const montoSeña = Math.round(precioTotal * 0.20);

  // 5. Crear el turno
  const nuevoTurno = new Turno({
    clienteId,
    peluqueroId,
    servicios,
    fechaHoraInicio: inicio,
    fechaHoraFin: fin,
    precioTotal,
    montoSeña,
    señaPagada: false,
    estado: 'pendiente'
  });

  return await nuevoTurno.save();
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