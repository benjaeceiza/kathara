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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reordenarGaleria = exports.cambiarAvatar = exports.eliminarImagenGaleria = exports.subirImagenGaleria = exports.subirPortada = exports.actualizarDatos = exports.obtenerMiPortafolio = exports.obtenerPortafolioPublico = exports.crearMiPortafolio = void 0;
const portafolioService = __importStar(require("../services/portafolioService"));
const mongoose_1 = __importDefault(require("mongoose"));
const crearMiPortafolio = async (req, res) => {
    try {
        // 🔥 Hacemos la misma validación blindada acá
        const usuarioAuth = req.usuario || req.user;
        if (!usuarioAuth) {
            return res.status(401).json({ error: 'No autorizado para crear portafolio.' });
        }
        const userId = usuarioAuth.id || usuarioAuth._id;
        const existe = await portafolioService.obtenerPortafolio(userId);
        if (existe) {
            return res.status(400).json({ error: 'Ya tenés un portafolio creado' });
        }
        const portafolio = await portafolioService.crearPortafolio(userId);
        res.status(201).json({ mensaje: 'Portafolio creado y vinculado con éxito', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.crearMiPortafolio = crearMiPortafolio;
const obtenerPortafolioPublico = async (req, res) => {
    try {
        // 1. Le decimos a TypeScript explícitamente que esto es un string
        const { peluqueroId } = req.params;
        // 2. Validamos que el ID tenga el formato correcto de MongoDB antes de buscar
        if (!mongoose_1.default.Types.ObjectId.isValid(peluqueroId)) {
            return res.status(400).json({ error: 'El ID del peluquero no es válido' });
        }
        // 3. Ahora sí, hacemos la búsqueda seguros
        const portafolio = await portafolioService.obtenerPortafolio(peluqueroId);
        if (!portafolio) {
            return res.status(404).json({ error: 'Este peluquero aún no tiene portafolio' });
        }
        res.json({ portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obtenerPortafolioPublico = obtenerPortafolioPublico;
const obtenerMiPortafolio = async (req, res) => {
    try {
        const usuarioAuth = req.usuario || req.user;
        if (!usuarioAuth) {
            return res.status(401).json({ error: 'No autorizado. Token no válido o ausente.' });
        }
        const userId = usuarioAuth.id || usuarioAuth._id;
        const portafolio = await portafolioService.obtenerPortafolio(userId);
        res.json({ portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obtenerMiPortafolio = obtenerMiPortafolio;
const actualizarDatos = async (req, res) => {
    try {
        const userId = req.usuario.id;
        const portafolio = await portafolioService.actualizarDatosPortafolio(userId, req.body);
        res.json({ mensaje: 'Datos actualizados', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.actualizarDatos = actualizarDatos;
const subirPortada = async (req, res) => {
    try {
        if (!req.file)
            throw new Error('No se envió ninguna imagen');
        const portafolio = await portafolioService.actualizarPortada(req.usuario.id, req.file.buffer);
        res.json({ mensaje: 'Portada actualizada', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.subirPortada = subirPortada;
const subirImagenGaleria = async (req, res) => {
    try {
        if (!req.file)
            throw new Error('No se envió ninguna imagen');
        const portafolio = await portafolioService.agregarFotoGaleria(req.usuario.id, req.file.buffer);
        res.json({ mensaje: 'Imagen agregada a la galería', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.subirImagenGaleria = subirImagenGaleria;
const eliminarImagenGaleria = async (req, res) => {
    try {
        const { public_id } = req.body; // Pasamos el ID de la foto por el body
        const portafolio = await portafolioService.eliminarFotoGaleria(req.usuario.id, public_id);
        res.json({ mensaje: 'Imagen eliminada correctamente', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.eliminarImagenGaleria = eliminarImagenGaleria;
const cambiarAvatar = async (req, res) => {
    try {
        if (!req.file)
            throw new Error('No se envió ninguna imagen de perfil');
        const usuarioAuth = req.usuario || req.user;
        const userId = usuarioAuth.id || usuarioAuth._id;
        const portafolio = await portafolioService.actualizarAvatarUsuario(userId, req.file.buffer);
        res.json({ mensaje: 'Avatar actualizado con éxito', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.cambiarAvatar = cambiarAvatar;
const reordenarGaleria = async (req, res) => {
    try {
        const { nuevaGaleria } = req.body;
        const usuarioAuth = req.usuario || req.user;
        const userId = usuarioAuth.id || usuarioAuth._id;
        const portafolio = await portafolioService.reordenarGaleriaPortafolio(userId, nuevaGaleria);
        res.json({ mensaje: 'Galería reordenada', portafolio });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.reordenarGaleria = reordenarGaleria;
//# sourceMappingURL=portafolioController.js.map