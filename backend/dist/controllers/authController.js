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
exports.loginGoogle = exports.loginUsuario = exports.registrarUsuario = void 0;
const authService = __importStar(require("../services/authService"));
const registrarUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await authService.registrarNuevoUsuario(req.body);
        res.status(201).json({ mensaje: '¡Usuario creado con éxito!', usuario: nuevoUsuario });
    }
    catch (error) {
        res.status(400).json({ mensaje: error.message || 'Hubo un error en el servidor' });
    }
};
exports.registrarUsuario = registrarUsuario;
// Nueva función de Login
const loginUsuario = async (req, res) => {
    try {
        const resultado = await authService.loginUsuario(req.body);
        res.status(200).json({
            mensaje: '¡Login exitoso!',
            usuario: resultado.usuario,
            token: resultado.token
        });
    }
    catch (error) {
        res.status(401).json({ mensaje: error.message || 'Error en el login' });
    }
};
exports.loginUsuario = loginUsuario;
const loginGoogle = async (req, res) => {
    try {
        // Extraemos el token que el frontend (React) nos va a mandar en el body
        const { token_google } = req.body;
        if (!token_google) {
            res.status(400).json({ mensaje: 'No se recibió el token de Google' });
            return;
        }
        const resultado = await authService.loginConGoogle(token_google);
        res.status(200).json({
            mensaje: '¡Login con Google exitoso!',
            usuario: resultado.usuario,
            token: resultado.token
        });
    }
    catch (error) {
        res.status(401).json({ mensaje: error.message || 'Error al autenticar con Google' });
    }
};
exports.loginGoogle = loginGoogle;
//# sourceMappingURL=authController.js.map