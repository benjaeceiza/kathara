"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bajaLogicaServicio = exports.modificarServicio = exports.obtenerServiciosActivos = exports.crearNuevoServicio = void 0;
const Servicio_1 = __importDefault(require("../models/Servicio"));
// Crear un servicio nuevo
const crearNuevoServicio = async (datos) => {
    const nuevoServicio = new Servicio_1.default(datos);
    return await nuevoServicio.save();
};
exports.crearNuevoServicio = crearNuevoServicio;
// Obtener solo los servicios activos (para los clientes)
const obtenerServiciosActivos = async () => {
    return await Servicio_1.default.find({ activo: true });
};
exports.obtenerServiciosActivos = obtenerServiciosActivos;
// Actualizar precio o duración
const modificarServicio = async (id, datos) => {
    const servicioActualizado = await Servicio_1.default.findByIdAndUpdate(id, datos, { new: true });
    if (!servicioActualizado)
        throw new Error('Servicio no encontrado');
    return servicioActualizado;
};
exports.modificarServicio = modificarServicio;
// Borrado lógico (lo pasamos a activo: false para no romper turnos viejos)
const bajaLogicaServicio = async (id) => {
    const servicioEliminado = await Servicio_1.default.findByIdAndUpdate(id, { activo: false }, { new: true });
    if (!servicioEliminado)
        throw new Error('Servicio no encontrado');
    return servicioEliminado;
};
exports.bajaLogicaServicio = bajaLogicaServicio;
//# sourceMappingURL=servicioService.js.map