import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extendemos la interfaz de Request para poder guardarle los datos del usuario logueado
export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    rol: string;
  };
}

export const protegerRuta = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 2. Buscamos el token en el encabezado (Header) de la petición
    const authHeader = req.headers.authorization;

    // El formato estándar es: "Bearer eyJhbGciOi..."
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ mensaje: '🛑 Acceso denegado. No tenés la pulserita VIP (Token faltante).' });
      return;
    }

    // 3. Cortamos la palabra "Bearer " y nos quedamos solo con el código del token
    const token = authHeader.split(' ')[1];

    // 4. Verificamos si el token es real y no está vencido usando tu clave secreta
    const decodificado = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: string; rol: string };

    // 5. ¡Pasa el control! Le pegamos los datos del usuario a la petición y dejamos que siga
    req.usuario = decodificado;
    next(); // <-- Esto le dice a Express: "Todo legal, pasalo al controlador"

  } catch (error) {
    res.status(401).json({ mensaje: '🛑 Token inválido o expirado. Volvé a iniciar sesión.' });
  }
};