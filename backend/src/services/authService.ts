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

  if (datos.password) {
    const salt = await bcrypt.genSalt(10);
    datos.password = await bcrypt.hash(datos.password, salt);
  }

  const nuevoUsuario = new Usuario(datos);
  await nuevoUsuario.save();

  const usuarioLimpio = nuevoUsuario.toObject();
  delete usuarioLimpio.password;

  return usuarioLimpio;
};

// 2. Lógica de Login
export const loginUsuario = async (datos: LoginData) => {
  const usuario = await Usuario.findOne({ email: datos.email });
  if (!usuario || !usuario.password) {
    throw new Error('Credenciales inválidas');
  }

  const esPasswordValido = await bcrypt.compare(datos.password || '', usuario.password);
  if (!esPasswordValido) {
    throw new Error('Credenciales inválidas');
  }

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

// 🔥 3. Login con Google usando Access Token
export const loginConGoogle = async (accessToken: string) => {
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
  let usuario = await Usuario.findOne({ email });

  // 3. Si no existe, lo creamos automáticamente (Registro express)
  if (!usuario) {
    const salt = await bcrypt.genSalt(10);
    const passwordGenerado = await bcrypt.hash('@@@google_auth_placeholder_pwd@@@', salt);

    usuario = new Usuario({
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