import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';

interface PeluqueroData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidades?: string[];
  password?: string; // Opcional: por si el admin le quiere asignar una clave específica
}

export const crearNuevoPeluquero = async (datos: PeluqueroData) => {
  // 1. Verificamos que el email no esté en uso por NINGÚN usuario (cliente o staff)
  const existe = await Usuario.findOne({ email: datos.email });
  if (existe) throw new Error('Ya existe un usuario o peluquero registrado con ese email');

  // 2. Le asignamos la clave que mandó el admin, o una genérica por defecto
  const passwordPlano = datos.password || 'Kathara2026';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordPlano, salt);

  // 3. Creamos el documento forzando el rol
  const nuevoPeluquero = new Usuario({
    ...datos,
    password: passwordHash,
    rol: 'peluquero',
    recibeTurnos: true
  });

  const peluqueroGuardado = await nuevoPeluquero.save();

  // 4. Limpiamos la contraseña antes de devolver el objeto al frontend
  const peluqueroLimpio = peluqueroGuardado.toObject();
  delete peluqueroLimpio.password;

  return peluqueroLimpio;
};


export const obtenerPeluquerosActivos = async () => {
  // 🔥 BUSCAMOS POR EL NUEVO BOOLEANO EN LUGAR DEL ROL
  return await Usuario.find({ 
    recibeTurnos: true, // Si recibe turnos, va al catálogo
    activo: true 
  }).select('-password');
};

export const obtenerPeluqueroPorId = async (id: string) => {
  // 🔥 LO MISMO ACÁ
  const peluquero = await Usuario.findOne({ 
    _id: id, 
    recibeTurnos: true 
  }).select('-password');
  
  if (!peluquero) throw new Error('Profesional no encontrado o no disponible');
  
  return peluquero;
};