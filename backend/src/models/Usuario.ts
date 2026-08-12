import mongoose, { Schema, Document } from 'mongoose';

// 1. El sub-esquema para los días de trabajo
export interface IHorario {
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  activo: boolean;
  horaInicio: string;
  horaFin: string;
}

// 2. La interfaz unificada
export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: 'cliente' | 'peluquero' | 'admin';
  avatar?: string;
  telefono?: string;
  recibeTurnos?: boolean;

  especialidades?: string[];
  horarios?: IHorario[];
  tituloProfesional?: string;

  turnosCompletados: number;
  faltas: number;
  exentoSena: boolean;

  activo: boolean;
  fechaCreacion: Date;

  // 🔥 NUEVO: Referencias
  portafolio?: mongoose.Types.ObjectId;
  serviciosQueRealiza?: mongoose.Types.ObjectId[]; // Agregamos los servicios acá
}

// 3. El Schema de Mongoose para el Horario
const HorarioSchema = new Schema({
  dia: {
    type: String,
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    required: true
  },
  activo: { type: Boolean, default: true },
  horaInicio: { type: String, default: '09:00' },
  horaFin: { type: String, default: '20:00' }
}, { _id: false });

// 4. El Super-Schema Principal
const UsuarioSchema: Schema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  rol: { type: String, enum: ['cliente', 'peluquero', 'admin'], default: 'cliente' },
  avatar: { type: String },
  telefono: { type: String },
  recibeTurnos: { type: Boolean, default: false },
  especialidades: [{ type: String }],
  horarios: [{
    dia: String,
    activo: Boolean,
    horaInicio: String,
    horaFin: String
  }],
  tituloProfesional: { type: String, default: 'Estilista' },
  turnosCompletados: { type: Number, default: 0 },
  faltas: { type: Number, default: 0 },
  exentoSena: { type: Boolean, default: false },

  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },

  portafolio: { type: Schema.Types.ObjectId, ref: 'Portafolio' },
  // 🔥 Guardamos los IDs de los servicios vinculados a la colección "Servicio"
  serviciosQueRealiza: [{ type: Schema.Types.ObjectId, ref: 'Servicio' }]
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);