"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protegerRuta = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protegerRuta = (req, res, next) => {
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
        const decodificado = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 5. ¡Pasa el control! Le pegamos los datos del usuario a la petición y dejamos que siga
        req.usuario = decodificado;
        next(); // <-- Esto le dice a Express: "Todo legal, pasalo al controlador"
    }
    catch (error) {
        res.status(401).json({ mensaje: '🛑 Token inválido o expirado. Volvé a iniciar sesión.' });
    }
};
exports.protegerRuta = protegerRuta;
//# sourceMappingURL=authMiddleware.js.map