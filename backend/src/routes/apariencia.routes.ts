import { Router } from 'express';
import { protegerRuta } from '../middlewares/authMiddleware';
import { obtenerApariencia, actualizarApariencia, subirImagenFondo } from '../controllers/aparienciaController';
import { uploadPortada } from '../config/cloudinary'; 

const router = Router();

router.get('/', obtenerApariencia); 
router.put('/', protegerRuta, actualizarApariencia);

// 🔥 NUEVA RUTA PARA SUBIR LA IMAGEN
// Usamos .single('imagen') porque desde el frontend le vamos a mandar el campo con ese nombre
router.post('/upload', protegerRuta, uploadPortada.single('imagen'), subirImagenFondo);

export default router;