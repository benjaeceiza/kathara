export declare const obtenerPerfilUsuario: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const actualizarDatosUsuario: (id: string, datos: {
    nombre: string;
    apellido: string;
    telefono: string;
}) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const cambiarPasswordUsuario: (id: string, actual: string, nueva: string) => Promise<boolean>;
export declare const actualizarAvatarUsuario: (userId: string, fileBuffer: Buffer) => Promise<import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const eliminarAvatarUsuario: (userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Usuario").IUsuario, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Usuario").IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=usuarioService.d.ts.map