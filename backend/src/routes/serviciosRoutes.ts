import { Router } from 'express';
import { crear, obtenerTodos, actualizar, eliminar } from '../controllers/servicioController';

const router = Router();

router.get('/', obtenerTodos);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;