import { Request, Response } from 'express';
export declare const crearMiPortafolio: (req: Request | any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const obtenerPortafolioPublico: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const obtenerMiPortafolio: (req: Request | any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const actualizarDatos: (req: Request | any, res: Response) => Promise<void>;
export declare const subirPortada: (req: Request | any, res: Response) => Promise<void>;
export declare const subirImagenGaleria: (req: Request | any, res: Response) => Promise<void>;
export declare const eliminarImagenGaleria: (req: Request | any, res: Response) => Promise<void>;
export declare const cambiarAvatar: (req: Request | any, res: Response) => Promise<void>;
export declare const reordenarGaleria: (req: Request | any, res: Response) => Promise<void>;
//# sourceMappingURL=portafolioController.d.ts.map