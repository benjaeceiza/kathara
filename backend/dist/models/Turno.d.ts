import mongoose, { Document, Types } from 'mongoose';
export interface ITurno extends Document {
    clienteId: Types.ObjectId;
    peluqueroId: Types.ObjectId;
    servicios: Types.ObjectId[];
    fechaHoraInicio: Date;
    fechaHoraFin: Date;
    precioTotal: number;
    montoSeña: number;
    señaPagada: boolean;
    estado: 'pendiente' | 'confirmado' | 'finalizado' | 'cancelado' | 'no_asistio';
    registroTrabajo?: {
        notas?: string;
        imagenUrl?: string;
        fechaRegistro?: Date;
    };
}
declare const _default: mongoose.Model<ITurno, {}, {}, {}, mongoose.Document<unknown, {}, ITurno, {}, mongoose.DefaultSchemaOptions> & ITurno & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITurno>;
export default _default;
//# sourceMappingURL=Turno.d.ts.map