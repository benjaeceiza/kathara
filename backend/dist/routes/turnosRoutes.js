"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turnoController_1 = require("../controllers/turnoController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// 2. Lo ponés en el medio de la ruta que querés bloquear
// Ahora NADIE puede llamar a POST /api/turnos/reservar si no manda el token
router.post('/reservar', authMiddleware_1.protegerRuta, turnoController_1.crearTurno);
router.get('/agenda/:peluqueroId', turnoController_1.listarAgenda); // A la agenda la dejamos pública para que cualquiera vea los horarios libres
exports.default = router;
//# sourceMappingURL=turnosRoutes.js.map