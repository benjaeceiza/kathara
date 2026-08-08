import { ITurno } from '../models/Turno';
interface ReservaData {
    clienteId: string;
    peluqueroId: string;
    servicios: string[];
    fechaHoraInicio: string;
}
export declare const reservarTurno: (datos: ReservaData) => Promise<import("mongoose").Document<unknown, {}, ITurno, {}, import("mongoose").DefaultSchemaOptions> & ITurno & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const obtenerAgendaPeluquero: (peluqueroId: string, fechaStr: string) => Promise<(import("mongoose").Document<unknown, {}, ITurno, {}, import("mongoose").DefaultSchemaOptions> & ITurno & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export {};
//# sourceMappingURL=turnoService.d.ts.map