import { IUsuario } from '../models/Usuario';
interface RegistroData {
    nombre: string;
    apellido: string;
    telefono: String;
    email: string;
    password?: string;
}
interface LoginData {
    email: string;
    password?: string;
}
export declare const registrarNuevoUsuario: (datos: RegistroData) => Promise<IUsuario & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const loginUsuario: (datos: LoginData) => Promise<{
    usuario: IUsuario & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export declare const loginConGoogle: (accessToken: string) => Promise<{
    usuario: IUsuario & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export {};
//# sourceMappingURL=authService.d.ts.map