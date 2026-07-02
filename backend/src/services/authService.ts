import Usuario, { IUsuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface RegistroData {
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
}

interface LoginData {
  email: string;
  password?: string;
}

// 1. Registro con contraseña encriptada (Hash)
export const registrarNuevoUsuario = async (datos: RegistroData) => {
  const usuarioExistente = await Usuario.findOne({ email: datos.email });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  // Encriptamos la clave si es que mandó una (por si en el futuro usa Google Auth)
  if (datos.password) {
    const salt = await bcrypt.genSalt(10);
    datos.password = await bcrypt.hash(datos.password, salt);
  }

  const nuevoUsuario = new Usuario(datos);
  await nuevoUsuario.save();

  // Borramos el password antes de devolver el objeto para no mostrarlo
  const usuarioLimpio = nuevoUsuario.toObject();
  delete usuarioLimpio.password;

  return usuarioLimpio;
};

// 2. Lógica de Login
export const loginUsuario = async (datos: LoginData) => {
  // Verificamos si existe el usuario
  const usuario = await Usuario.findOne({ email: datos.email });
  if (!usuario || !usuario.password) {
    throw new Error('Credenciales inválidas');
  }

  // Comparamos la contraseña que escribió con el hash guardado en MongoDB
  const esPasswordValido = await bcrypt.compare(datos.password || '', usuario.password);
  if (!esPasswordValido) {
    throw new Error('Credenciales inválidas');
  }

  // Creamos el Token JWT (la pulserita VIP que dura 7 días)
  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  const usuarioLimpio = usuario.toObject();
  delete usuarioLimpio.password;

  return {
    usuario: usuarioLimpio,
    token
  };
};