import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as usuarioService from '../services/usuarioService';

// 1. OBTENER PERFIL
export const obtenerMiPerfil = async (req: AuthRequest, res: Response) => {
  try {
    // 🔥 Le agregamos el "!" para avisarle a TS que el usuario existe sí o sí
    const usuario = await usuarioService.obtenerPerfilUsuario(req.usuario!.id);
    res.json(usuario);
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message || 'Error al obtener el perfil' });
  }
};

// 2. ACTUALIZAR DATOS PERSONALES
export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    
    const usuarioActualizado = await usuarioService.actualizarDatosUsuario(
      req.usuario!.id, // 🔥 Acá también
      { nombre, apellido, telefono }
    );

    res.json({
      mensaje: 'Perfil actualizado con éxito',
      usuario: usuarioActualizado
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al actualizar el perfil', error });
  }
};

// 3. CAMBIAR CONTRASEÑA
export const cambiarPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { actual, nueva } = req.body;
    
    await usuarioService.cambiarPasswordUsuario(req.usuario!.id, actual, nueva); // 🔥 Acá también

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message || 'Error al cambiar la contraseña' });
  }
};

// 4. SUBIR AVATAR
export const subirAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
    }

    const usuarioActualizado = await usuarioService.actualizarAvatarUsuario(
      req.usuario!.id, 
      req.file.buffer
    );

    res.json({
      mensaje: 'Foto de perfil actualizada con éxito',
      usuario: usuarioActualizado
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: error.message || 'Error al subir la imagen' });
  }
};


// 5. ELIMINAR AVATAR
export const eliminarAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioActualizado = await usuarioService.eliminarAvatarUsuario(req.usuario!.id);

    res.json({
      mensaje: 'Foto de perfil eliminada con éxito',
      usuario: usuarioActualizado
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: error.message || 'Error al eliminar la imagen' });
  }
};