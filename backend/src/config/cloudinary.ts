import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configuramos las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Usamos memoryStorage para guardar el archivo en buffer temporalmente
const storage = multer.memoryStorage();

// Exportamos el middleware listo para usar
export const uploadAvatar = multer({ storage });