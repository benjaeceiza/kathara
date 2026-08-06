import { Request, Response } from 'express';
import * as portafolioService from '../services/portafolioService';
import mongoose from 'mongoose';



export const crearMiPortafolio = async (req: Request | any, res: Response) => {
  try {
    // 🔥 Hacemos la misma validación blindada acá
    const usuarioAuth = req.usuario || req.user;
    
    if (!usuarioAuth) {
      return res.status(401).json({ error: 'No autorizado para crear portafolio.' });
    }

    const userId = usuarioAuth.id || usuarioAuth._id;
    
    const existe = await portafolioService.obtenerPortafolio(userId);
    if (existe) {
      return res.status(400).json({ error: 'Ya tenés un portafolio creado' });
    }

    const portafolio = await portafolioService.crearPortafolio(userId);
    res.status(201).json({ mensaje: 'Portafolio creado y vinculado con éxito', portafolio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPortafolioPublico = async (req: Request, res: Response) => {
  try {
    // 1. Le decimos a TypeScript explícitamente que esto es un string
    const { peluqueroId } = req.params as { peluqueroId: string }; 

    // 2. Validamos que el ID tenga el formato correcto de MongoDB antes de buscar
    if (!mongoose.Types.ObjectId.isValid(peluqueroId)) {
      return res.status(400).json({ error: 'El ID del peluquero no es válido' });
    }

    // 3. Ahora sí, hacemos la búsqueda seguros
    const portafolio = await portafolioService.obtenerPortafolio(peluqueroId);
    
    if (!portafolio) {
      return res.status(404).json({ error: 'Este peluquero aún no tiene portafolio' });
    }
    
    res.json({ portafolio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerMiPortafolio = async (req: Request | any, res: Response) => {
  try {
    const usuarioAuth = req.usuario || req.user;
    
    if (!usuarioAuth) {
      return res.status(401).json({ error: 'No autorizado. Token no válido o ausente.' });
    }

    const userId = usuarioAuth.id || usuarioAuth._id;
    const portafolio = await portafolioService.obtenerPortafolio(userId);
    
    res.json({ portafolio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarDatos = async (req: Request | any, res: Response) => {
    try {
        const userId = req.usuario.id;
        const portafolio = await portafolioService.actualizarDatosPortafolio(userId, req.body);
        res.json({ mensaje: 'Datos actualizados', portafolio });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const subirPortada = async (req: Request | any, res: Response) => {
    try {
        if (!req.file) throw new Error('No se envió ninguna imagen');
        const portafolio = await portafolioService.actualizarPortada(req.usuario.id, req.file.buffer);
        res.json({ mensaje: 'Portada actualizada', portafolio });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const subirImagenGaleria = async (req: Request | any, res: Response) => {
    try {
        if (!req.file) throw new Error('No se envió ninguna imagen');
        const portafolio = await portafolioService.agregarFotoGaleria(req.usuario.id, req.file.buffer);
        res.json({ mensaje: 'Imagen agregada a la galería', portafolio });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarImagenGaleria = async (req: Request | any, res: Response) => {
    try {
        const { public_id } = req.body; // Pasamos el ID de la foto por el body
        const portafolio = await portafolioService.eliminarFotoGaleria(req.usuario.id, public_id);
        res.json({ mensaje: 'Imagen eliminada correctamente', portafolio });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const cambiarAvatar = async (req: Request | any, res: Response) => {
  try {
    if (!req.file) throw new Error('No se envió ninguna imagen de perfil');
    const usuarioAuth = req.usuario || req.user;
    const userId = usuarioAuth.id || usuarioAuth._id;

    const portafolio = await portafolioService.actualizarAvatarUsuario(userId, req.file.buffer);
    res.json({ mensaje: 'Avatar actualizado con éxito', portafolio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const reordenarGaleria = async (req: Request | any, res: Response) => {
  try {
    const { nuevaGaleria } = req.body;
    const usuarioAuth = req.usuario || req.user;
    const userId = usuarioAuth.id || usuarioAuth._id;

    const portafolio = await portafolioService.reordenarGaleriaPortafolio(userId, nuevaGaleria);
    res.json({ mensaje: 'Galería reordenada', portafolio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};