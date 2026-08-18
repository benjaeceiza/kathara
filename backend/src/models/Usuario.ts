import mongoose, { Schema, Document } from 'mongoose';

// 1. El sub-esquema para los días de trabajo (INTERFAZ)
export interface IHorario {
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  activo: boolean;
  horaInicio: string;
  horaFin: string;
  // 🔥 NUEVOS CAMPOS: Soporte para Turno Cortado
  turnoCortado?: boolean;
  horaInicio2?: string;
  horaFin2?: string;
  tipoTurno?: string; // Lo guardamos para que el frontend recuerde qué botón apretó
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

  portafolio?: mongoose.Types.ObjectId;
  serviciosQueRealiza?: mongoose.Types.ObjectId[]; 
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
  horaFin: { type: String, default: '20:00' },
  
  // 🔥 NUEVOS CAMPOS EN LA DB
  turnoCortado: { type: Boolean, default: false },
  horaInicio2: { type: String, default: '16:00' },
  horaFin2: { type: String, default: '21:00' },
  tipoTurno: { type: String, default: 'doble' }
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
  
  // 🔥 AHORA SÍ usa el sub-esquema correctamente en vez de repetirlo inline
  horarios: [HorarioSchema],
  
  tituloProfesional: { type: String, default: 'Estilista' },
  turnosCompletados: { type: Number, default: 0 },
  faltas: { type: Number, default: 0 },
  exentoSena: { type: Boolean, default: false },

  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },

  portafolio: { type: Schema.Types.ObjectId, ref: 'Portafolio' },
  serviciosQueRealiza: [{ type: Schema.Types.ObjectId, ref: 'Servicio' }]
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);