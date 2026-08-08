"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peluqueroController_1 = require("../controllers/peluqueroController");
const router = (0, express_1.Router)();
router.get('/', peluqueroController_1.obtenerTodos);
router.get('/:id', peluqueroController_1.obtenerPorId);
router.post('/', peluqueroController_1.crear);
exports.default = router;
//# sourceMappingURL=peluquerosRoutes.js.map