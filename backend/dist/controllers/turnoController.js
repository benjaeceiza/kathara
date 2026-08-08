"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAgenda = exports.crearTurno = void 0;
const turnoService = __importStar(require("../services/turnoService"));
const crearTurno = async (req, res) => {
    try {
        // Extraemos el ID del cliente logueado desde el Token JWT
        const clienteId = req.usuario.id;
        // Unimos los datos del body con el ID del cliente
        const datosReserva = {
            ...req.body,
            clienteId
        };
        const turno = await turnoService.reservarTurno(datosReserva);
        res.status(201).json({
            mensaje: '¡Turno reservado con éxito! Te esperamos en el local.',
            turno
        });
    }
    catch (error) {
        res.status(400).json({ mensaje: error.message || 'Error al reservar el turno' });
    }
};
exports.crearTurno = crearTurno;
const listarAgenda = async (req, res) => {
    try {
        const { peluqueroId } = req.params;
        const { fecha } = req.query;
        if (!fecha) {
            res.status(400).json({ mensaje: 'Falta especificar la fecha' });
            return;
        }
        const agenda = await turnoService.obtenerAgendaPeluquero(peluqueroId, fecha);
        res.status(200).json(agenda);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la agenda' });
    }
};
exports.listarAgenda = listarAgenda;
//# sourceMappingURL=turnoController.js.map