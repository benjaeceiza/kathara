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
exports.eliminar = exports.actualizar = exports.obtenerTodos = exports.crear = void 0;
const servicioService = __importStar(require("../services/servicioService"));
const crear = async (req, res) => {
    try {
        const servicio = await servicioService.crearNuevoServicio(req.body);
        res.status(201).json({ mensaje: 'Servicio creado con éxito', servicio });
    }
    catch (error) {
        res.status(400).json({ mensaje: error.message || 'Error al crear servicio' });
    }
};
exports.crear = crear;
const obtenerTodos = async (_req, res) => {
    try {
        const servicios = await servicioService.obtenerServiciosActivos();
        res.status(200).json(servicios);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener servicios' });
    }
};
exports.obtenerTodos = obtenerTodos;
const actualizar = async (req, res) => {
    try {
        const servicio = await servicioService.modificarServicio(req.params.id, req.body);
        res.status(200).json({ mensaje: 'Servicio actualizado', servicio });
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
};
exports.actualizar = actualizar;
const eliminar = async (req, res) => {
    try {
        await servicioService.bajaLogicaServicio(req.params.id);
        res.status(200).json({ mensaje: 'Servicio dado de baja correctamente' });
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
};
exports.eliminar = eliminar;
//# sourceMappingURL=servicioController.js.map