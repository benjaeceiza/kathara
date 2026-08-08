import { IServicio } from '../models/Servicio';
interface ServicioData {
    nombre: string;
    descripcion?: string;
    precio: number;
    duracionMinutos: number;
}
export declare const crearNuevoServicio: (datos: ServicioData) => Promise<import("mongoose").Document<unknown, {}, IServicio, {}, import("mongoose").DefaultSchemaOptions> & IServicio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const obtenerServiciosActivos: () => Promise<(import("mongoose").Document<unknown, {}, IServicio, {}, import("mongoose").DefaultSchemaOptions> & IServicio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const modificarServicio: (id: string, datos: Partial<ServicioData>) => Promise<import("mongoose").Document<unknown, {}, IServicio, {}, import("mongoose").DefaultSchemaOptions> & IServicio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const bajaLogicaServicio: (id: string) => Promise<import("mongoose").Document<unknown, {}, IServicio, {}, import("mongoose").DefaultSchemaOptions> & IServicio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export {};
//# sourceMappingURL=servicioService.d.ts.map