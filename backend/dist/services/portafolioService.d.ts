export declare const obtenerPortafolio: (peluqueroId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const crearPortafolio: (peluqueroId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const actualizarDatosPortafolio: (peluqueroId: string, datos: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const actualizarAvatarUsuario: (peluqueroId: string, fileBuffer: Buffer) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const reordenarGaleriaPortafolio: (peluqueroId: string, nuevaGaleria: any[]) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const actualizarPortada: (peluqueroId: string, fileBuffer: Buffer) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const agregarFotoGaleria: (peluqueroId: string, fileBuffer: Buffer) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const eliminarFotoGaleria: (peluqueroId: string, public_id: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Portafolio").IPortafolio, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Portafolio").IPortafolio & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
//# sourceMappingURL=portafolioService.d.ts.map