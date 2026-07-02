import { Router } from 'express';
import { crear, obtenerTodos, obtenerPorId } from '../controllers/peluqueroController';

const router = Router();

router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.post('/', crear);

export default router;