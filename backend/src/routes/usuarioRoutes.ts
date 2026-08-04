import { Router } from 'express';
import { obtenerMiPerfil, actualizarPerfil, cambiarPassword, subirAvatar, eliminarAvatar } from '../controllers/usuarioController';
import { uploadAvatar } from '../config/cloudinary';
 

// 🔥 Importá tu middleware que verifica el token JWT
// (Ajustá la ruta de importación según cómo lo tengas en tu proyecto)
import { protegerRuta } from '../middlewares/authMiddleware'; 

const router = Router();

// 🔒 PROTECCIÓN GLOBAL PARA ESTE ARCHIVO
// Al poner esto acá arriba, obligamos a que todas las rutas de abajo 
// requieran que el usuario esté logueado con un token válido.
router.use(protegerRuta);

// GET /api/usuarios/mi-perfil
// Trae los datos y estadísticas del usuario logueado
router.get('/mi-perfil', obtenerMiPerfil);

// PUT /api/usuarios/mi-perfil
// Actualiza nombre, apellido y teléfono
router.put('/mi-perfil', actualizarPerfil);

// PUT /api/usuarios/cambiar-password
// Verifica la clave actual y la cambia por la nueva
router.put('/cambiar-password', cambiarPassword);

// Rutas para el avatar
router.post('/avatar', uploadAvatar.single('imagen'), subirAvatar);

router.delete('/avatar', eliminarAvatar);

export default router;