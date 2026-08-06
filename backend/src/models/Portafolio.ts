import mongoose, { Schema, Document } from 'mongoose';

export interface IImagenGaleria {
  url: string;
  public_id: string;
}

export interface IPortafolio extends Document {
  peluquero: mongoose.Types.ObjectId; 
  fotoPortada: string;
  biografiaProfesional: string;
  redesProfesionales: {
    instagram: string;
    tiktok: string;
    whatsapp: string; // 🔥 AGREGAMOS WHATSAPP
  };
  especialidades: string[]; // 🔥 AGREGAMOS ESPECIALIDADES
  serviciosQueRealiza: string[]; // 🔥 AGREGAMOS SERVICIOS (IDs de los servicios)
  galeria: IImagenGaleria[];
  estilo: {
    colorPrincipal: string; 
    modoOscuro: boolean; 
    disenoGaleria: 'grilla' | 'carrusel' | 'mosaico'; 
  };
}

const PortafolioSchema: Schema = new Schema({
  peluquero: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fotoPortada: { type: String, default: '' },
  biografiaProfesional: { type: String, default: '' },
  redesProfesionales: {
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    whatsapp: { type: String, default: '' } // 🔥 AGREGAMOS WHATSAPP
  },
  especialidades: [{ type: String }], // 🔥 AGREGAMOS ESPECIALIDADES
  serviciosQueRealiza: [{ type: String }], // 🔥 AGREGAMOS SERVICIOS
  galeria: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }],
  estilo: {
    colorPrincipal: { type: String, default: '#F97316' }, 
    modoOscuro: { type: Boolean, default: true },
    disenoGaleria: { type: String, enum: ['grilla', 'carrusel', 'mosaico'], default: 'grilla' }
  }
}, { timestamps: true });

export default mongoose.model<IPortafolio>('Portafolio', PortafolioSchema);