import { Router } from 'express';
import {
    crearTurno,
    listarAgenda,
    obtenerMisTurnos,
    cancelarTurno,
    obtenerTurnosOcupados,
    obtenerTurnosHoyAdmin,
    obtenerTurnosSemanaAdmin
} from '../controllers/turnoController';
import { protegerRuta } from '../middlewares/authMiddleware';

const router = Router();

// Rutas protegidas (Solo usuarios logueados)
router.post('/reservar', protegerRuta, crearTurno);
router.get('/mis-turnos', protegerRuta, obtenerMisTurnos); 
router.put('/:id/cancelar', protegerRuta, cancelarTurno);
router.get('/hoy', protegerRuta, obtenerTurnosHoyAdmin);
router.get('/semana', protegerRuta, obtenerTurnosSemanaAdmin);

// Rutas públicas
router.get('/agenda/:peluqueroId', listarAgenda);
router.get('/ocupados', obtenerTurnosOcupados);

export default router;