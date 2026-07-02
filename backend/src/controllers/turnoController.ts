import { type Request, type Response } from 'express';
import * as turnoService from '../services/turnoService';

export const crearTurno = async (req: Request, res: Response) => {
  try {
    const turno = await turnoService.reservarTurno(req.body);
    res.status(201).json({
      mensaje: '¡Turno reservado con éxito! Pendiente de seña.',
      turno
    });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message || 'Error al reservar el turno' });
  }
};

export const listarAgenda = async (req: Request, res: Response) => {
  try {
    const { peluqueroId } = req.params;
    const { fecha } = req.query; // Esperamos ?fecha=2026-07-03 en la URL

    if (!fecha) {
      res.status(400).json({ mensaje: 'Falta especificar la fecha' });
      return;
    }

    const agenda = await turnoService.obtenerAgendaPeluquero(peluqueroId as string, fecha as string);
    res.status(200).json(agenda);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener la agenda' });
  }
};