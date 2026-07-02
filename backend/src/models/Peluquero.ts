import mongoose, { Schema, Document } from 'mongoose';

export interface IPeluquero extends Document {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  especialidades: string[]; // Ej: ["Degradé", "Barba", "Color"]
  activo: boolean;
  fechaCreacion: Date;
}

const PeluqueroSchema: Schema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  telefono: { type: String },
  fotoPerfil: { type: String },
  especialidades: [{ type: String }],
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.model<IPeluquero>('Peluquero', PeluqueroSchema);