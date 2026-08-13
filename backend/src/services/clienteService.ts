import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';

export interface ClienteData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dni?: string;
  activo?: boolean;
  exentoSena?: boolean;
}

// 🔥 OBTENER SOLO CLIENTES
export const obtenerClientesService = async () => {
  return await Usuario.find({ rol: 'cliente' }).select('-password');
};

// 🔥 CREAR CLIENTE (Desde el panel admin)
export const crearClienteService = async (datos: ClienteData) => {
  const existe = await Usuario.findOne({ email: datos.email });
  if (existe) throw new Error('Ya existe un usuario registrado con ese email');

  // Si tiene DNI usamos eso de clave temporal, sino una por defecto
  const passwordPlano = datos.dni || 'Cliente2026';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordPlano, salt);

  const nuevoCliente = new Usuario({
    ...datos,
    rol: 'cliente',
    activo: true,
    password: passwordHash
  });

  const guardado = await nuevoCliente.save();
  
  // Limpiamos la password antes de mandarla al frontend
  const limpio = guardado.toObject();
  delete limpio.password;
  
  return limpio;
};

// 🔥 ACTUALIZAR CLIENTE (VIP, Bloqueo, etc.)
export const actualizarClienteService = async (id: string, datos: Partial<ClienteData>) => {
  const actualizado = await Usuario.findByIdAndUpdate(
    id, 
    datos, 
    { returnDocument: 'after' }
  ).select('-password');
  
  if (!actualizado) throw new Error('Cliente no encontrado');
  
  return actualizado;
};