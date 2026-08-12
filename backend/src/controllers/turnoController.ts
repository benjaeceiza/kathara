import { type Request, type Response } from 'express';
import * as turnoService from '../services/turnoService';
import { obtenerMisTurnosService, cancelarTurnoService, obtenerTurnosOcupadosService, obtenerTurnosHoyAdminService, obtenerTurnosSemanaAdminService } from '../services/turnoService';

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



// 🔥 GET /api/turnos/mis-turnos
export const obtenerMisTurnos = async (req: any, res: any) => {
  try {
    // Sacamos el ID del usuario que viene inyectado por el middleware protegerRuta
    const clienteId = req.usuario.id || req.usuario._id;

    const turnos = await obtenerMisTurnosService(clienteId);

    res.json({ turnos });
  } catch (error) {
    console.error("Error al obtener mis turnos:", error);
    res.status(500).json({ error: 'Error al obtener tus turnos.' });
  }
};

// 🔥 PUT /api/turnos/:id/cancelar
export const cancelarTurno = async (req: any, res: any) => {
    try {
        const { id } = req.params; // Sacamos el ID del turno de la URL
        
        // Sacamos el ID del cliente logueado (que viene del token)
        const clienteId = req.usuario.id || req.usuario._id;

        const turnoCancelado = await cancelarTurnoService(id, clienteId);

        if (!turnoCancelado) {
            return res.status(404).json({ error: 'Turno no encontrado o no tenés permiso para cancelarlo.' });
        }

        res.json({ mensaje: 'Turno cancelado con éxito.', turno: turnoCancelado });
    } catch (error) {
        console.error("Error al cancelar el turno:", error);
        res.status(500).json({ error: 'Error interno al cancelar el turno.' });
    }
};


export const obtenerTurnosOcupados = async (req: any, res: any) => {
    try {
        const { peluqueroId, fecha } = req.query;
        
        if (!peluqueroId || !fecha) {
            return res.status(400).json({ error: 'Faltan parámetros' });
        }

        const rangosOcupados = await obtenerTurnosOcupadosService(peluqueroId, fecha);
        
        res.json({ ocupados: rangosOcupados });
    } catch (error) {
        console.error("Error al obtener turnos ocupados:", error);
        res.status(500).json({ error: 'Error al buscar disponibilidad.' });
    }
};


export const obtenerTurnosHoyAdmin = async (req: any, res: any) => {
    try {
        const turnos = await obtenerTurnosHoyAdminService();
        res.json({ turnos });
    } catch (error) {
        console.error("Error al obtener turnos de hoy:", error);
        res.status(500).json({ error: 'Error al cargar el dashboard.' });
    }
};


// 🔥 GET /api/turnos/semana
export const obtenerTurnosSemanaAdmin = async (req: any, res: any) => {
    try {
        const turnos = await obtenerTurnosSemanaAdminService();
        res.json({ turnos });
    } catch (error) {
        console.error("Error al obtener turnos de la semana:", error);
        res.status(500).json({ error: 'Error al cargar la agenda.' });
    }
};