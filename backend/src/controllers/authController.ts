import { type Request, type Response } from 'express';
import * as authService from '../services/authService';

export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const nuevoUsuario = await authService.registrarNuevoUsuario(req.body);
    res.status(201).json({ mensaje: '¡Usuario creado con éxito!', usuario: nuevoUsuario });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message || 'Hubo un error en el servidor' });
  }
};

// Nueva función de Login
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const resultado = await authService.loginUsuario(req.body);
    res.status(200).json({
      mensaje: '¡Login exitoso!',
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error: any) {
    res.status(401).json({ mensaje: error.message || 'Error en el login' });
  }
};