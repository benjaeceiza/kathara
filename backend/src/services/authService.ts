import Usuario, { IUsuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface RegistroData {
  nombre: string;
  apellido: string;
  telefono: String;
  email: string;
  password?: string;
}

interface LoginData {
  email: string;
  password?: string;
}

// 1. Registro con contraseña encriptada (Hash) y Avatar automático
export const registrarNuevoUsuario = async (datos: RegistroData) => {
  const usuarioExistente = await Usuario.findOne({ email: datos.email });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  if (datos.password) {
    const salt = await bcrypt.genSalt(10);
    datos.password = await bcrypt.hash(datos.password, salt);
  }

  // 🔥 CREAMOS EL AVATAR DINÁMICO
  // Limpiamos los espacios en blanco por si meten un espacio extra y armamos la URL
  const nombreLimpio = datos.nombre.trim();
  const apellidoLimpio = datos.apellido.trim();
  const avatarUrl = `https://ui-avatars.com/api/?name=${nombreLimpio}+${apellidoLimpio}&background=27272a&color=f97316`;

  // Se lo mandamos al modelo junto con todos los datos que venían del body
  const nuevoUsuario = new Usuario({
    ...datos,
    avatar: avatarUrl
  });
  
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

    // NOTA: Acá Google ya nos da el `picture` (la foto de su cuenta de Google), 
    // pero si querés podés pisarlo con el ui-avatars también si lo preferís. 
    // Yo te lo dejé con el de Google porque suele ser su foto real.
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

  // 4. Generamos TU propio Token JWT
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