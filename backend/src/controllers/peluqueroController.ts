import { type Request, type Response } from 'express';
import * as peluqueroService from '../services/peluqueroService';

export const crear = async (req: Request, res: Response) => {
  try {
    const peluquero = await peluqueroService.crearNuevoPeluquero(req.body);
    res.status(201).json({ mensaje: 'Peluquero agregado exitosamente', peluquero });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const obtenerTodos = async (_req: Request, res: Response) => {
  try {
    const peluqueros = await peluqueroService.obtenerPeluquerosActivos();
    res.status(200).json(peluqueros);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al listar peluqueros' });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const peluquero = await peluqueroService.obtenerPeluqueroPorId(req.params.id as string);
    res.status(200).json(peluquero);
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
};