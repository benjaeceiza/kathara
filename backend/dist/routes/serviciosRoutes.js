"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicioController_1 = require("../controllers/servicioController");
const router = (0, express_1.Router)();
router.get('/', servicioController_1.obtenerTodos);
router.post('/', servicioController_1.crear);
router.put('/:id', servicioController_1.actualizar);
router.delete('/:id', servicioController_1.eliminar);
exports.default = router;
//# sourceMappingURL=serviciosRoutes.js.map