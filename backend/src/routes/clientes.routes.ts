import { Router } from 'express';
import { protegerRuta } from '../middlewares/authMiddleware';
import { 
    obtenerClientes, 
    crearCliente, 
    actualizarCliente 
} from '../controllers/clienteController';

const router = Router();

// Todas las rutas protegidas para que solo el Admin acceda a este CRM
router.get('/', protegerRuta, obtenerClientes);
router.post('/', protegerRuta, crearCliente);
router.put('/:id', protegerRuta, actualizarCliente);

export default router;