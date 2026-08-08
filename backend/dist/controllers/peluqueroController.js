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
exports.obtenerPorId = exports.obtenerTodos = exports.crear = void 0;
const peluqueroService = __importStar(require("../services/peluqueroService"));
const crear = async (req, res) => {
    try {
        const peluquero = await peluqueroService.crearNuevoPeluquero(req.body);
        res.status(201).json({ mensaje: 'Peluquero agregado exitosamente', peluquero });
    }
    catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};
exports.crear = crear;
const obtenerTodos = async (_req, res) => {
    try {
        const peluqueros = await peluqueroService.obtenerPeluquerosActivos();
        res.status(200).json(peluqueros);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al listar peluqueros' });
    }
};
exports.obtenerTodos = obtenerTodos;
const obtenerPorId = async (req, res) => {
    try {
        const peluquero = await peluqueroService.obtenerPeluqueroPorId(req.params.id);
        res.status(200).json(peluquero);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
};
exports.obtenerPorId = obtenerPorId;
//# sourceMappingURL=peluqueroController.js.map