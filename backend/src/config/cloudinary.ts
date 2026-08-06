import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configuramos las credenciales de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Usamos memoryStorage para guardar el archivo en buffer temporalmente
const storage = multer.memoryStorage();

// Creamos la instancia general de multer
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB por seguridad para cuidar la RAM
});

// 🔥 Exportamos todas las variantes para que coincidan perfectamente con tus rutas
export const uploadAvatar = upload;
export const uploadPortada = upload;
export const uploadGaleria = upload;