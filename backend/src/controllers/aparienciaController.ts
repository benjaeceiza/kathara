import * as aparienciaService from '../services/aparienciaService';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/apariencia (Público, para que el frontend lo cargue)
export const obtenerApariencia = async (req: any, res: any) => {
    try {
        const config = await aparienciaService.obtenerAparienciaService();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la apariencia' });
    }
};

// PUT /api/apariencia (Protegido, solo admin)
export const actualizarApariencia = async (req: any, res: any) => {
    try {
        const actualizado = await aparienciaService.actualizarAparienciaService(req.body);
        res.json({ mensaje: 'Apariencia actualizada', apariencia: actualizado });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar apariencia' });
    }
};


export const subirImagenFondo = async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ninguna imagen.' });
        }

        // 🔥 ATRAPAMOS EL TIPO QUE MANDA EL FRONTEND ('hero' o 'general')
        const { tipo } = req.body;

        // 🔥 DEFINIMOS LA CARPETA DINÁMICAMENTE
        // Podés ajustar los nombres 'heros' y 'fondos' si en tu Cloudinary se llaman distinto
        const carpetaDestino = tipo === 'hero' ? 'kathara/heros' : 'kathara/fondos';

        const subirACloudinary = (buffer: Buffer): Promise<string> => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: carpetaDestino }, // 👈 Acá le inyectamos la carpeta correcta
                    (error, result) => {
                        if (result) resolve(result.secure_url);
                        else reject(error);
                    }
                );
                stream.end(buffer);
            });
        };

        const imageUrl = await subirACloudinary(req.file.buffer);
        res.json({ url: imageUrl });

    } catch (error: any) {
        console.error("Error al subir a Cloudinary:", error);
        res.status(500).json({ error: 'Error al procesar la imagen en el servidor.' });
    }
};