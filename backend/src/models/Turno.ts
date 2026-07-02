import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITurno extends Document {
  clienteId: Types.ObjectId;
  peluqueroId: Types.ObjectId;
  servicios: Types.ObjectId[]; // Un array porque el cliente puede pedir "Corte + Barba + Cejas"
  fechaHoraInicio: Date;
  fechaHoraFin: Date;
  precioTotal: number;
  montoSeña: number;
  señaPagada: boolean;
  estado: 'pendiente' | 'confirmado' | 'finalizado' | 'cancelado' | 'no_asistio';
  registroTrabajo?: {
    notas?: string;     // Ej: "Corte con la 1.5 en laterales y tijera arriba"
    imagenUrl?: string; // Foto de Cloudinary de cómo le quedó el corte
    fechaRegistro?: Date;
  };
}

const TurnoSchema: Schema = new Schema({
  clienteId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  peluqueroId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Peluquero', 
    required: true 
  },
  servicios: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Servicio', 
    required: true 
  }],
  fechaHoraInicio: { 
    type: Date, 
    required: true 
  },
  fechaHoraFin: { 
    type: Date, 
    required: true 
  },
  precioTotal: { 
    type: Number, 
    required: true 
  },
  montoSeña: { 
    type: Number, 
    default: 0 
  },
  señaPagada: { 
    type: Boolean, 
    default: false 
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'confirmado', 'finalizado', 'cancelado', 'no_asistio'], 
    default: 'pendiente' 
  },
  registroTrabajo: {
    notas: { type: String },
    imagenUrl: { type: String },
    fechaRegistro: { type: Date }
  }
});

export default mongoose.model<ITurno>('Turno', TurnoSchema);