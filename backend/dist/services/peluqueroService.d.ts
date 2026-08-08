interface PeluqueroData {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    especialidades?: string[];
    password?: string;
}
export declare const crearNuevoPeluquero: (datos: PeluqueroData) => Promise<import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const obtenerPeluquerosActivos: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const obtenerPeluqueroPorId: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export {};
//# sourceMappingURL=peluqueroService.d.ts.map