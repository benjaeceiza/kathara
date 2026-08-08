import mongoose, { Document } from 'mongoose';
export interface IHorario {
    dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
    activo: boolean;
    horaInicio: string;
    horaFin: string;
}
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
}
declare const _default: mongoose.Model<IUsuario, {}, {}, {}, mongoose.Document<unknown, {}, IUsuario, {}, mongoose.DefaultSchemaOptions> & IUsuario & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUsuario>;
export default _default;
//# sourceMappingURL=Usuario.d.ts.map