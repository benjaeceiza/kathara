"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadGaleria = exports.uploadPortada = exports.uploadAvatar = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configuramos las credenciales de Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Usamos memoryStorage para guardar el archivo en buffer temporalmente
const storage = multer_1.default.memoryStorage();
// Creamos la instancia general de multer
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB por seguridad para cuidar la RAM
});
// 🔥 Exportamos todas las variantes para que coincidan perfectamente con tus rutas
exports.uploadAvatar = upload;
exports.uploadPortada = upload;
exports.uploadGaleria = upload;
//# sourceMappingURL=cloudinary.js.map