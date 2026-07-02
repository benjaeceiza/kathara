import mongoose, { Schema, Document } from 'mongoose';

// 1. La Interfaz de TypeScript (Para el autocompletado y seguridad)
export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  email: string;
  password?: string; // Opcional (por si se loguea con Google no va a tener password)
  telefono?: string;
  rol: 'cliente' | 'admin';
  googleId?: string;
  fechaCreacion: Date;
}

// 2. El Esquema de Mongoose 
const UsuarioSchema: Schema = new Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true 
  },
  apellido: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // No pueden haber dos cuentas con el mismo mail
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String 
  },
  telefono: { 
    type: String 
  },
  rol: { 
    type: String, 
    enum: ['cliente', 'admin'], 
    default: 'cliente' 
  },
  googleId: { 
    type: String 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);