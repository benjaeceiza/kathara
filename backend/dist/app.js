"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviciosRoutes_1 = __importDefault(require("./routes/serviciosRoutes"));
const peluquerosRoutes_1 = __importDefault(require("./routes/peluquerosRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const turnosRoutes_1 = __importDefault(require("./routes/turnosRoutes"));
const portafolioRoutes_1 = __importDefault(require("./routes/portafolioRoutes"));
// Configuramos las variables de entorno
dotenv_1.default.config();
// Conectamos a la base de datos
(0, db_1.conectarDB)();
// Inicializamos la app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middlewares básicos
app.use((0, cors_1.default)()); // Permite peticiones desde el frontend
app.use(express_1.default.json()); // Permite leer los JSON que mandemos en el body
app.use('/api/auth', authRoutes_1.default);
app.use('/api/servicios', serviciosRoutes_1.default);
app.use('/api/peluqueros', peluquerosRoutes_1.default);
app.use('/api/usuarios', usuarioRoutes_1.default);
app.use('/api/turnos', turnosRoutes_1.default);
app.use('/api/portafolio', portafolioRoutes_1.default);
// Arrancar el motor
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
});
//# sourceMappingURL=app.js.map