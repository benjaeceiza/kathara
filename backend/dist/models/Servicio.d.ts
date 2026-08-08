import mongoose, { Document } from 'mongoose';
export interface IServicio extends Document {
    nombre: string;
    descripcion?: string;
    precio: number;
    duracionMinutos: number;
    activo: boolean;
}
declare const _default: mongoose.Model<IServicio, {}, {}, {}, mongoose.Document<unknown, {}, IServicio, {}, mongoose.DefaultSchemaOptions> & IServicio & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IServicio>;
export default _default;
//# sourceMappingURL=Servicio.d.ts.map