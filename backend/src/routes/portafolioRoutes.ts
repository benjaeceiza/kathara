import { Router } from 'express';
import { protegerRuta } from '../middlewares/authMiddleware';
import { uploadPortada, uploadAvatar, uploadGaleria } from '../config/cloudinary'; 
import {
    crearMiPortafolio,
    obtenerMiPortafolio,
    obtenerPortafolioPublico,
    actualizarDatos,
    subirPortada,
    subirImagenGaleria,
    eliminarImagenGaleria,
    cambiarAvatar,
    reordenarGaleria
} from '../controllers/portafolioController';

const router = Router();

// ==========================================
// 🌍 RUTA PÚBLICA (Sin token)
// ==========================================
router.get('/publico/:peluqueroId', obtenerPortafolioPublico);

// ==========================================
// 🔒 RUTAS PROTEGIDAS (Requieren token)
// ==========================================
router.use(protegerRuta); 

router.get('/', obtenerMiPortafolio);
router.post('/', crearMiPortafolio);
router.put('/datos', actualizarDatos);
router.put('/portada', uploadPortada.single('imagen'), subirPortada);
router.put('/avatar', uploadAvatar.single('imagen'), cambiarAvatar); 
router.post('/galeria', uploadGaleria.single('imagen'), subirImagenGaleria);
router.delete('/galeria', eliminarImagenGaleria);
router.put('/galeria/reordenar', reordenarGaleria);

export default router;