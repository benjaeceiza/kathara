import Servicio, { IServicio } from '../models/Servicio';

interface ServicioData {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
}

// Crear un servicio nuevo
export const crearNuevoServicio = async (datos: ServicioData) => {
  const nuevoServicio = new Servicio(datos);
  return await nuevoServicio.save();
};

// Obtener solo los servicios activos (para los clientes)
export const obtenerServiciosActivos = async () => {
  return await Servicio.find({ activo: true });
};

// Actualizar precio o duración
export const modificarServicio = async (id: string, datos: Partial<ServicioData>) => {
  const servicioActualizado = await Servicio.findByIdAndUpdate(id, datos, { new: true });
  if (!servicioActualizado) throw new Error('Servicio no encontrado');
  return servicioActualizado;
};

// Borrado lógico (lo pasamos a activo: false para no romper turnos viejos)
export const bajaLogicaServicio = async (id: string) => {
  const servicioEliminado = await Servicio.findByIdAndUpdate(id, { activo: false }, { new: true });
  if (!servicioEliminado) throw new Error('Servicio no encontrado');
  return servicioEliminado;
};