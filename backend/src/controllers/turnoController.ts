import { type Request, type Response } from 'express';
import * as turnoService from '../services/turnoService';

export const crearTurno = async (req: Request, res: Response) => {
  try {
    // Extraemos el ID del cliente logueado desde el Token JWT
    const clienteId = (req as any).usuario.id; 

    // Unimos los datos del body con el ID del cliente
    const datosReserva = {
      ...req.body,
      clienteId
    };

    const turno = await turnoService.reservarTurno(datosReserva);

    res.status(201).json({
      mensaje: '¡Turno reservado con éxito! Te esperamos en el local.',
      turno
    });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message || 'Error al reservar el turno' });
  }
};

export const listarAgenda = async (req: Request, res: Response) => {
  try {
    const { peluqueroId } = req.params;
    const { fecha } = req.query; 

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