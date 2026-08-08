"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const cloudinary_1 = require("../config/cloudinary");
// 🔥 Importá tu middleware que verifica el token JWT
// (Ajustá la ruta de importación según cómo lo tengas en tu proyecto)
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// 🔒 PROTECCIÓN GLOBAL PARA ESTE ARCHIVO
// Al poner esto acá arriba, obligamos a que todas las rutas de abajo 
// requieran que el usuario esté logueado con un token válido.
router.use(authMiddleware_1.protegerRuta);
// GET /api/usuarios/mi-perfil
// Trae los datos y estadísticas del usuario logueado
router.get('/mi-perfil', usuarioController_1.obtenerMiPerfil);
// PUT /api/usuarios/mi-perfil
// Actualiza nombre, apellido y teléfono
router.put('/mi-perfil', usuarioController_1.actualizarPerfil);
// PUT /api/usuarios/cambiar-password
// Verifica la clave actual y la cambia por la nueva
router.put('/cambiar-password', usuarioController_1.cambiarPassword);
// Rutas para el avatar
router.post('/avatar', cloudinary_1.uploadAvatar.single('imagen'), usuarioController_1.subirAvatar);
router.delete('/avatar', usuarioController_1.eliminarAvatar);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map