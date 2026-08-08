import { type Request, type Response, type NextFunction } from 'express';
export interface AuthRequest extends Request {
    usuario?: {
        id: string;
        rol: string;
    };
    file?: any;
}
export declare const protegerRuta: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map