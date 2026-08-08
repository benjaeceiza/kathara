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
exports.eliminarAvatar = exports.subirAvatar = exports.cambiarPassword = exports.actualizarPerfil = exports.obtenerMiPerfil = void 0;
const usuarioService = __importStar(require("../services/usuarioService"));
// 1. OBTENER PERFIL
const obtenerMiPerfil = async (req, res) => {
    try {
        // 🔥 Le agregamos el "!" para avisarle a TS que el usuario existe sí o sí
        const usuario = await usuarioService.obtenerPerfilUsuario(req.usuario.id);
        res.json(usuario);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message || 'Error al obtener el perfil' });
    }
};
exports.obtenerMiPerfil = obtenerMiPerfil;
// 2. ACTUALIZAR DATOS PERSONALES
const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        const usuarioActualizado = await usuarioService.actualizarDatosUsuario(req.usuario.id, // 🔥 Acá también
        { nombre, apellido, telefono });
        res.json({
            mensaje: 'Perfil actualizado con éxito',
            usuario: usuarioActualizado
        });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el perfil', error });
    }
};
exports.actualizarPerfil = actualizarPerfil;
// 3. CAMBIAR CONTRASEÑA
const cambiarPassword = async (req, res) => {
    try {
        const { actual, nueva } = req.body;
        await usuarioService.cambiarPasswordUsuario(req.usuario.id, actual, nueva); // 🔥 Acá también
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        res.status(400).json({ mensaje: error.message || 'Error al cambiar la contraseña' });
    }
};
exports.cambiarPassword = cambiarPassword;
// 4. SUBIR AVATAR
const subirAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
        }
        const usuarioActualizado = await usuarioService.actualizarAvatarUsuario(req.usuario.id, req.file.buffer);
        res.json({
            mensaje: 'Foto de perfil actualizada con éxito',
            usuario: usuarioActualizado
        });
    }
    catch (error) {
        res.status(500).json({ mensaje: error.message || 'Error al subir la imagen' });
    }
};
exports.subirAvatar = subirAvatar;
// 5. ELIMINAR AVATAR
const eliminarAvatar = async (req, res) => {
    try {
        const usuarioActualizado = await usuarioService.eliminarAvatarUsuario(req.usuario.id);
        res.json({
            mensaje: 'Foto de perfil eliminada con éxito',
            usuario: usuarioActualizado
        });
    }
    catch (error) {
        res.status(500).json({ mensaje: error.message || 'Error al eliminar la imagen' });
    }
};
exports.eliminarAvatar = eliminarAvatar;
//# sourceMappingURL=usuarioController.js.map