import { type Request, type Response } from 'express';
import * as servicioService from '../services/servicioService';

export const crear = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.crearNuevoServicio(req.body);
    res.status(201).json({ mensaje: 'Servicio creado con éxito', servicio });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message || 'Error al crear servicio' });
  }
};

export const obtenerTodos = async (_req: Request, res: Response) => {
  try {
    const servicios = await servicioService.obtenerServiciosActivos();
    res.status(200).json(servicios);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener servicios' });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.modificarServicio(req.params.id as string, req.body);
    res.status(200).json({ mensaje: 'Servicio actualizado', servicio });
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    await servicioService.bajaLogicaServicio(req.params.id as string);
    res.status(200).json({ mensaje: 'Servicio dado de baja correctamente' });
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
};