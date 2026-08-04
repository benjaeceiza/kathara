import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// 1. OBTENER PERFIL
export const obtenerPerfilUsuario = async (id: string) => {
  const usuario = await Usuario.findById(id).select('-password');
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  return usuario;
};

// 2. ACTUALIZAR DATOS PERSONALES
export const actualizarDatosUsuario = async (id: string, datos: { nombre: string, apellido: string, telefono: string }) => {
  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    id,
    { nombre: datos.nombre, apellido: datos.apellido, telefono: datos.telefono },
    { returnDocument: 'after' }
  ).select('-password');
  
  return usuarioActualizado;
};

// 3. CAMBIAR CONTRASEÑA
export const cambiarPasswordUsuario = async (id: string, actual: string, nueva: string) => {
  const usuario = await Usuario.findById(id);
  
  if (!usuario || !usuario.password) {
    throw new Error('Operación no válida para este tipo de cuenta (Ej: Google Login)');
  }

  const esValido = await bcrypt.compare(actual, usuario.password);
  if (!esValido) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(nueva, salt);
  await usuario.save();
  
  return true;
};

// 4. ACTUALIZAR AVATAR
const subirACloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'kathara/perfil', 
        transformation: [{ width: 400, height: 400, crop: 'fill' }] 
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    // Convertimos el buffer en stream y lo enviamos a Cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Servicio principal que conecta Cloudinary y la Base de Datos
export const actualizarAvatarUsuario = async (userId: string, fileBuffer: Buffer) => {
  // 1. Subimos la imagen a Cloudinary
  const resultadoCloudinary: any = await subirACloudinary(fileBuffer);
  const avatarUrl = resultadoCloudinary.secure_url;

  // 2. Actualizamos el usuario en MongoDB
  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { returnDocument: 'after' }
  ).select('-password');
  
  if (!usuarioActualizado) {
    throw new Error('Usuario no encontrado');
  }
  
  return usuarioActualizado;
};


// 5. ELIMINAR AVATAR
export const eliminarAvatarUsuario = async (userId: string) => {
const usuarioActualizado = await Usuario.findByIdAndUpdate(
    userId,
    { avatar: '' },
    { returnDocument: 'after' }
  ).select('-password');
  
  if (!usuarioActualizado) {
    throw new Error('Usuario no encontrado');
  }
  
  return usuarioActualizado;
};

