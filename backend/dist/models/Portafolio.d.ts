import mongoose, { Document } from 'mongoose';
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
        whatsapp: string;
    };
    especialidades: string[];
    serviciosQueRealiza: string[];
    galeria: IImagenGaleria[];
    estilo: {
        colorPrincipal: string;
        modoOscuro: boolean;
        disenoGaleria: 'grilla' | 'carrusel' | 'mosaico';
    };
}
declare const _default: mongoose.Model<IPortafolio, {}, {}, {}, mongoose.Document<unknown, {}, IPortafolio, {}, mongoose.DefaultSchemaOptions> & IPortafolio & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPortafolio>;
export default _default;
//# sourceMappingURL=Portafolio.d.ts.map