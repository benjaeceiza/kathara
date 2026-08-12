import { Router } from 'express';
import { protegerRuta } from '../middlewares/authMiddleware';
import { 
    obtenerTodoElStaff, 
    crearPeluquero, 
    actualizarPeluquero, 
    eliminarPeluquero,
    obtenerPeluquerosActivos
} from '../controllers/peluqueroController';

const router = Router();

router.get('/activos', obtenerPeluquerosActivos);

// 🔥 RUTAS DEL ABM DE STAFF (Protegidas para que solo entre el admin)
// Ruta base: /api/peluqueros
router.get('/', protegerRuta, obtenerTodoElStaff);
router.post('/', protegerRuta, crearPeluquero);
router.put('/:id', protegerRuta, actualizarPeluquero);
router.delete('/:id', protegerRuta, eliminarPeluquero);

export default router;