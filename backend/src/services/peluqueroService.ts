import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';

export interface PeluqueroData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password?: string;
  rol: string;           // 🔥 Ahora lo pedimos dinámico (admin o peluquero)
  recibeTurnos: boolean; // 🔥 Dinámico
  activo: boolean;       // 🔥 Dinámico
}

// ==========================================
// 🧑‍💼 FUNCIONES PARA EL PANEL ADMIN (Nuevas)
// ==========================================

// Trae TODO el equipo (admins y peluqueros) para la grilla del dashboard
export const obtenerTodoElStaff = async () => {
  return await Usuario.find({ rol: { $in: ['admin', 'peluquero'] } }).select('-password');
};

// Modificamos un poco la tuya para que reciba el rol, activo y recibeTurnos del frontend
export const crearNuevoPeluquero = async (datos: PeluqueroData) => {
  const existe = await Usuario.findOne({ email: datos.email });
  if (existe) throw new Error('Ya existe un usuario o peluquero registrado con ese email');

  const passwordPlano = datos.password || 'Kathara2026';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordPlano, salt);

  const nuevoPeluquero = new Usuario({
    ...datos, // Acá ya vienen nombre, apellido, email, rol, recibeTurnos y activo
    password: passwordHash
  });

  const peluqueroGuardado = await nuevoPeluquero.save();

  const peluqueroLimpio = peluqueroGuardado.toObject();
  const { password, ...resto } = peluqueroLimpio;

  return resto;
};

export const actualizarPeluquero = async (id: string, datos: Partial<PeluqueroData>) => {
  const datosActualizar = { ...datos };

  if (datosActualizar.password) {
    const salt = await bcrypt.genSalt(10);
    datosActualizar.password = await bcrypt.hash(datosActualizar.password, salt);
  }

  const actualizado = await Usuario.findByIdAndUpdate(id, datosActualizar, { returnDocument: 'after' }).select('-password');
  if (!actualizado) throw new Error('Miembro del staff no encontrado');
  
  return actualizado;
};

export const eliminarPeluquero = async (id: string) => {
  const eliminado = await Usuario.findByIdAndDelete(id);
  if (!eliminado) throw new Error('Miembro del staff no encontrado');
  return eliminado;
};

// ==========================================
// ✂️ TUS FUNCIONES ORIGINALES (Para el Wizard y Catálogo)
// ==========================================

export const obtenerPeluquerosActivos = async () => {
  return await Usuario.find({ 
    recibeTurnos: true,
    activo: true 
  }).select('-password');
};

export const obtenerPeluqueroPorId = async (id: string) => {
  const peluquero = await Usuario.findOne({ 
    _id: id, 
    recibeTurnos: true 
  }).select('-password');
  
  if (!peluquero) throw new Error('Profesional no encontrado o no disponible');
  return peluquero;
};