import Peluquero, { IPeluquero } from '../models/Peluquero';

interface PeluqueroData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidades?: string[];
}

export const crearNuevoPeluquero = async (datos: PeluqueroData) => {
  const existe = await Peluquero.findOne({ email: datos.email });
  if (existe) throw new Error('Ya existe un peluquero registrado con ese email');

  const nuevoPeluquero = new Peluquero(datos);
  return await nuevoPeluquero.save();
};

export const obtenerPeluquerosActivos = async () => {
  return await Peluquero.find({ activo: true });
};

export const obtenerPeluqueroPorId = async (id: string) => {
  const peluquero = await Peluquero.findById(id);
  if (!peluquero) throw new Error('Peluquero no encontrado');
  return peluquero;
};