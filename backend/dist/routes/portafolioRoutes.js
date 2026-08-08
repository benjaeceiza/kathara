"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const portafolioController_1 = require("../controllers/portafolioController");
const router = (0, express_1.Router)();
// ==========================================
// 🌍 RUTA PÚBLICA (Sin token)
// ==========================================
router.get('/publico/:peluqueroId', portafolioController_1.obtenerPortafolioPublico);
// ==========================================
// 🔒 RUTAS PROTEGIDAS (Requieren token)
// ==========================================
router.use(authMiddleware_1.protegerRuta);
router.get('/', portafolioController_1.obtenerMiPortafolio);
router.post('/', portafolioController_1.crearMiPortafolio);
router.put('/datos', portafolioController_1.actualizarDatos);
router.put('/portada', cloudinary_1.uploadPortada.single('imagen'), portafolioController_1.subirPortada);
router.put('/avatar', cloudinary_1.uploadAvatar.single('imagen'), portafolioController_1.cambiarAvatar);
router.post('/galeria', cloudinary_1.uploadGaleria.single('imagen'), portafolioController_1.subirImagenGaleria);
router.delete('/galeria', portafolioController_1.eliminarImagenGaleria);
router.put('/galeria/reordenar', portafolioController_1.reordenarGaleria);
exports.default = router;
//# sourceMappingURL=portafolioRoutes.js.map