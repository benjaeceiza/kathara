import { Router } from 'express';
import { crearTurno, listarAgenda } from '../controllers/turnoController';
import { protegerRuta } from '../middlewares/authMiddleware'; 

const router = Router();

// 2. Lo ponés en el medio de la ruta que querés bloquear
// Ahora NADIE puede llamar a POST /api/turnos/reservar si no manda el token
router.post('/reservar', protegerRuta, crearTurno);

router.get('/agenda/:peluqueroId', listarAgenda); // A la agenda la dejamos pública para que cualquiera vea los horarios libres

export default router;