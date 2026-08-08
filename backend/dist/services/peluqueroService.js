"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerPeluqueroPorId = exports.obtenerPeluquerosActivos = exports.crearNuevoPeluquero = void 0;
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crearNuevoPeluquero = async (datos) => {
    // 1. Verificamos que el email no esté en uso por NINGÚN usuario (cliente o staff)
    const existe = await Usuario_1.default.findOne({ email: datos.email });
    if (existe)
        throw new Error('Ya existe un usuario o peluquero registrado con ese email');
    // 2. Le asignamos la clave que mandó el admin, o una genérica por defecto
    const passwordPlano = datos.password || 'Kathara2026';
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash(passwordPlano, salt);
    // 3. Creamos el documento forzando el rol
    const nuevoPeluquero = new Usuario_1.default({
        ...datos,
        password: passwordHash,
        rol: 'peluquero',
        recibeTurnos: true
    });
    const peluqueroGuardado = await nuevoPeluquero.save();
    // 4. Limpiamos la contraseña antes de devolver el objeto al frontend
    const peluqueroLimpio = peluqueroGuardado.toObject();
    delete peluqueroLimpio.password;
    return peluqueroLimpio;
};
exports.crearNuevoPeluquero = crearNuevoPeluquero;
const obtenerPeluquerosActivos = async () => {
    // 🔥 BUSCAMOS POR EL NUEVO BOOLEANO EN LUGAR DEL ROL
    return await Usuario_1.default.find({
        recibeTurnos: true, // Si recibe turnos, va al catálogo
        activo: true
    }).select('-password');
};
exports.obtenerPeluquerosActivos = obtenerPeluquerosActivos;
const obtenerPeluqueroPorId = async (id) => {
    // 🔥 LO MISMO ACÁ
    const peluquero = await Usuario_1.default.findOne({
        _id: id,
        recibeTurnos: true
    }).select('-password');
    if (!peluquero)
        throw new Error('Profesional no encontrado o no disponible');
    return peluquero;
};
exports.obtenerPeluqueroPorId = obtenerPeluqueroPorId;
//# sourceMappingURL=peluqueroService.js.map