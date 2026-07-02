import mongoose, { Schema, Document } from 'mongoose';

export interface IServicio extends Document {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number; // Clave para calcular el fin del turno
  activo: boolean;
}

const ServicioSchema: Schema = new Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  precio: { type: Number, required: true },
  duracionMinutos: { type: Number, required: true },
  activo: { type: Boolean, default: true }
});

export default mongoose.model<IServicio>('Servicio', ServicioSchema);