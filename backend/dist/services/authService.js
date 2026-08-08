"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginConGoogle = exports.loginUsuario = exports.registrarNuevoUsuario = void 0;
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 1. Registro con contraseña encriptada (Hash)
const registrarNuevoUsuario = async (datos) => {
    const usuarioExistente = await Usuario_1.default.findOne({ email: datos.email });
    if (usuarioExistente) {
        throw new Error('El email ya está registrado');
    }
    if (datos.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        datos.password = await bcryptjs_1.default.hash(datos.password, salt);
    }
    const nuevoUsuario = new Usuario_1.default(datos);
    await nuevoUsuario.save();
    const usuarioLimpio = nuevoUsuario.toObject();
    delete usuarioLimpio.password;
    return usuarioLimpio;
};
exports.registrarNuevoUsuario = registrarNuevoUsuario;
// 2. Lógica de Login
const loginUsuario = async (datos) => {
    const usuario = await Usuario_1.default.findOne({ email: datos.email });
    if (!usuario || !usuario.password) {
        throw new Error('Credenciales inválidas');
    }
    const esPasswordValido = await bcryptjs_1.default.compare(datos.password || '', usuario.password);
    if (!esPasswordValido) {
        throw new Error('Credenciales inválidas');
    }
    const token = jsonwebtoken_1.default.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const usuarioLimpio = usuario.toObject();
    delete usuarioLimpio.password;
    return {
        usuario: usuarioLimpio,
        token
    };
};
exports.loginUsuario = loginUsuario;
// 🔥 3. Login con Google usando Access Token
const loginConGoogle = async (accessToken) => {
    // 1. Buscamos el perfil del usuario directo en la API de Google
    const respuesta = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!respuesta.ok) {
        throw new Error('El token de Google no es válido o expiró');
    }
    const payload = await respuesta.json();
    const { email, given_name, family_name, picture } = payload;
    // 2. Buscamos si el usuario ya existe
    let usuario = await Usuario_1.default.findOne({ email });
    // 3. Si no existe, lo creamos automáticamente (Registro express)
    if (!usuario) {
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordGenerado = await bcryptjs_1.default.hash('@@@google_auth_placeholder_pwd@@@', salt);
        usuario = new Usuario_1.default({
            nombre: given_name,
            apellido: family_name || '',
            email: email,
            password: passwordGenerado,
            rol: 'cliente',
            avatar: picture
        });
        await usuario.save();
    }
    // 4. Generamos TU propio Token JWT (reutilizando tu lógica)
    const token = jsonwebtoken_1.default.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const usuarioLimpio = usuario.toObject();
    delete usuarioLimpio.password;
    return {
        usuario: usuarioLimpio,
        token
    };
};
exports.loginConGoogle = loginConGoogle;
//# sourceMappingURL=authService.js.map