import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const obtenerMiPerfil: (req: AuthRequest, res: Response) => Promise<void>;
export declare const actualizarPerfil: (req: AuthRequest, res: Response) => Promise<void>;
export declare const cambiarPassword: (req: AuthRequest, res: Response) => Promise<void>;
export declare const subirAvatar: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const eliminarAvatar: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=usuarioController.d.ts.map