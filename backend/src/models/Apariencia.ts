import { Schema, model, Document } from 'mongoose';

export interface IApariencia extends Document {
    fondoHero: string;
    fondoGeneral: string;
}

const aparienciaSchema = new Schema<IApariencia>({
    // La imagen grande de la portada
    fondoHero: { type: String, default: '' },
    // El fondo de la web (puede ser un color hexadecimal, un patrón o una imagen)
    fondoGeneral: { type: String, default: '' } 
});

export default model<IApariencia>('Apariencia', aparienciaSchema);