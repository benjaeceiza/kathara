import { Router } from 'express';
import { registrarUsuario, loginUsuario, loginGoogle } from '../controllers/authController';

const router = Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario); 
router.post('/google', loginGoogle);

export default router;