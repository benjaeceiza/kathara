"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerAgendaPeluquero = exports.reservarTurno = void 0;
const Turno_1 = __importDefault(require("../models/Turno"));
const Servicio_1 = __importDefault(require("../models/Servicio"));
const reservarTurno = async (datos) => {
    const { clienteId, peluqueroId, servicios, fechaHoraInicio } = datos;
    // 1. Calcular la duración total buscando los servicios en la base de datos
    const serviciosDB = await Servicio_1.default.find({ _id: { $in: servicios } });
    if (serviciosDB.length === 0) {
        throw new Error('No se encontraron los servicios seleccionados');
    }
    const duracionTotalMinutos = serviciosDB.reduce((total, serv) => total + serv.duracionMinutos, 0);
    const precioTotal = serviciosDB.reduce((total, serv) => total + serv.precio, 0);
    // 2. Calcular la fecha y hora de fin del turno
    const inicio = new Date(fechaHoraInicio);
    const fin = new Date(inicio.getTime() + duracionTotalMinutos * 60000);
    // 3. Validar disponibilidad del peluquero (Control de solapamiento)
    const turnoSolapado = await Turno_1.default.findOne({
        peluqueroId,
        estado: { $in: ['pendiente', 'confirmado'] },
        fechaHoraInicio: { $lt: fin },
        fechaHoraFin: { $gt: inicio }
    });
    if (turnoSolapado) {
        throw new Error('El profesional ya tiene un turno reservado en ese horario');
    }
    // 4. Crear el turno (Estado 'confirmado' de una, porque paga en el local)
    const nuevoTurno = new Turno_1.default({
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
exports.reservarTurno = reservarTurno;
// Obtener la agenda de un peluquero específico para un día
const obtenerAgendaPeluquero = async (peluqueroId, fechaStr) => {
    const inicioDia = new Date(fechaStr);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fechaStr);
    finDia.setHours(23, 59, 59, 999);
    return await Turno_1.default.find({
        peluqueroId,
        fechaHoraInicio: { $gte: inicioDia, $lte: finDia },
        estado: { $ne: 'cancelado' }
    }).populate('clienteId', 'nombre apellido')
        .populate('servicios', 'nombre precio');
};
exports.obtenerAgendaPeluquero = obtenerAgendaPeluquero;
//# sourceMappingURL=turnoService.js.map