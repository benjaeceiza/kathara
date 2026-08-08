"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarAvatarUsuario = exports.actualizarAvatarUsuario = exports.cambiarPasswordUsuario = exports.actualizarDatosUsuario = exports.obtenerPerfilUsuario = void 0;
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
// 1. OBTENER PERFIL
const obtenerPerfilUsuario = async (id) => {
    const usuario = await Usuario_1.default.findById(id).select('-password');
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    return usuario;
};
exports.obtenerPerfilUsuario = obtenerPerfilUsuario;
// 2. ACTUALIZAR DATOS PERSONALES
const actualizarDatosUsuario = async (id, datos) => {
    const usuarioActualizado = await Usuario_1.default.findByIdAndUpdate(id, { nombre: datos.nombre, apellido: datos.apellido, telefono: datos.telefono }, { returnDocument: 'after' }).select('-password');
    return usuarioActualizado;
};
exports.actualizarDatosUsuario = actualizarDatosUsuario;
// 3. CAMBIAR CONTRASEÑA
const cambiarPasswordUsuario = async (id, actual, nueva) => {
    const usuario = await Usuario_1.default.findById(id);
    if (!usuario || !usuario.password) {
        throw new Error('Operación no válida para este tipo de cuenta (Ej: Google Login)');
    }
    const esValido = await bcryptjs_1.default.compare(actual, usuario.password);
    if (!esValido) {
        throw new Error('La contraseña actual es incorrecta');
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    usuario.password = await bcryptjs_1.default.hash(nueva, salt);
    await usuario.save();
    return true;
};
exports.cambiarPasswordUsuario = cambiarPasswordUsuario;
// 4. ACTUALIZAR AVATAR
const subirACloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'kathara/perfil',
            transformation: [{ width: 400, height: 400, crop: 'fill' }]
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        // Convertimos el buffer en stream y lo enviamos a Cloudinary
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
// Servicio principal que conecta Cloudinary y la Base de Datos
const actualizarAvatarUsuario = async (userId, fileBuffer) => {
    // 1. Subimos la imagen a Cloudinary
    const resultadoCloudinary = await subirACloudinary(fileBuffer);
    const avatarUrl = resultadoCloudinary.secure_url;
    // 2. Actualizamos el usuario en MongoDB
    const usuarioActualizado = await Usuario_1.default.findByIdAndUpdate(userId, { avatar: avatarUrl }, { returnDocument: 'after' }).select('-password');
    if (!usuarioActualizado) {
        throw new Error('Usuario no encontrado');
    }
    return usuarioActualizado;
};
exports.actualizarAvatarUsuario = actualizarAvatarUsuario;
// 5. ELIMINAR AVATAR
const eliminarAvatarUsuario = async (userId) => {
    const usuarioActualizado = await Usuario_1.default.findByIdAndUpdate(userId, { avatar: '' }, { returnDocument: 'after' }).select('-password');
    if (!usuarioActualizado) {
        throw new Error('Usuario no encontrado');
    }
    return usuarioActualizado;
};
exports.eliminarAvatarUsuario = eliminarAvatarUsuario;
//# sourceMappingURL=usuarioService.js.map