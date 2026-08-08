"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarFotoGaleria = exports.agregarFotoGaleria = exports.actualizarPortada = exports.reordenarGaleriaPortafolio = exports.actualizarAvatarUsuario = exports.actualizarDatosPortafolio = exports.crearPortafolio = exports.obtenerPortafolio = void 0;
const Portafolio_1 = __importDefault(require("../models/Portafolio"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
// 1. OBTENER O CREAR PORTAFOLIO
const obtenerPortafolio = async (peluqueroId) => {
    const portafolio = await Portafolio_1.default.findOne({ peluquero: peluqueroId })
        .populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional'); // 🔥 Esto trae el objeto del usuario completo
    return portafolio;
};
exports.obtenerPortafolio = obtenerPortafolio;
const crearPortafolio = async (peluqueroId) => {
    // Creamos el portafolio vacío
    const nuevoPortafolio = await Portafolio_1.default.create({ peluquero: peluqueroId });
    // Lo vinculamos automáticamente al perfil del usuario
    await Usuario_1.default.findByIdAndUpdate(peluqueroId, { portafolio: nuevoPortafolio._id }, { returnDocument: 'after' });
    return nuevoPortafolio;
};
exports.crearPortafolio = crearPortafolio;
// 2. ACTUALIZAR TEXTOS Y REDES
const actualizarDatosPortafolio = async (peluqueroId, datos) => {
    // 🔥 Preparamos los datos que pertenecen a la colección Usuario
    const datosUsuario = {};
    if (datos.redesProfesionales?.whatsapp) {
        datosUsuario.telefono = datos.redesProfesionales.whatsapp;
    }
    if (datos.tituloProfesional) {
        datosUsuario.tituloProfesional = datos.tituloProfesional;
    }
    // 🔥 ACÁ ESTÁ LA MAGIA: Guardamos las especialidades en el Usuario
    if (datos.especialidades) {
        datosUsuario.especialidades = datos.especialidades;
    }
    // Si hay algo que actualizar en el Usuario, lo disparamos
    if (Object.keys(datosUsuario).length > 0) {
        await Usuario_1.default.findByIdAndUpdate(peluqueroId, datosUsuario);
    }
    // 🔥 Actualizamos el Portafolio y poblamos todo de vuelta
    return await Portafolio_1.default.findOneAndUpdate({ peluquero: peluqueroId }, {
        $set: {
            biografiaProfesional: datos.biografiaProfesional,
            redesProfesionales: datos.redesProfesionales,
            especialidades: datos.especialidades, // Lo dejamos acá también como respaldo
            serviciosQueRealiza: datos.serviciosQueRealiza,
            estilo: datos.estilo,
            horarios: datos.horarios
        }
    }, { returnDocument: 'after', upsert: true }).populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional');
};
exports.actualizarDatosPortafolio = actualizarDatosPortafolio;
// --- LÓGICA DE CLOUDINARY PARA EL PORTAFOLIO ---
const subirACloudinary = (buffer, carpeta) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: `kathara/portafolio/${carpeta}` }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
const actualizarAvatarUsuario = async (peluqueroId, fileBuffer) => {
    const resultado = await subirACloudinary(fileBuffer, 'avatars');
    // Actualizamos el avatar en el modelo Usuario
    await Usuario_1.default.findByIdAndUpdate(peluqueroId, { avatar: resultado.secure_url });
    // Devolvemos el portafolio actualizado para que el front reciba el cambio
    return await Portafolio_1.default.findOne({ peluquero: peluqueroId }).populate('peluquero', 'telefono avatar nombre apellido especialidades');
};
exports.actualizarAvatarUsuario = actualizarAvatarUsuario;
// 🔥 7. REORDENAR GALERÍA
const reordenarGaleriaPortafolio = async (peluqueroId, nuevaGaleria) => {
    return await Portafolio_1.default.findOneAndUpdate({ peluquero: peluqueroId }, { $set: { galeria: nuevaGaleria } }, { returnDocument: 'after' }).populate('peluquero', 'telefono avatar nombre apellido especialidades');
};
exports.reordenarGaleriaPortafolio = reordenarGaleriaPortafolio;
// 3. SUBIR FOTO DE PORTADA
const actualizarPortada = async (peluqueroId, fileBuffer) => {
    const resultado = await subirACloudinary(fileBuffer, 'portadas');
    return await Portafolio_1.default.findOneAndUpdate({ peluquero: peluqueroId }, { fotoPortada: resultado.secure_url }, { returnDocument: 'after' });
};
exports.actualizarPortada = actualizarPortada;
// 4. AGREGAR FOTO A LA GALERÍA
const agregarFotoGaleria = async (peluqueroId, fileBuffer) => {
    const resultado = await subirACloudinary(fileBuffer, 'galeria');
    return await Portafolio_1.default.findOneAndUpdate({ peluquero: peluqueroId }, {
        $push: {
            galeria: {
                $each: [{ url: resultado.secure_url, public_id: resultado.public_id }],
                $position: 0 // 🔥 Mete la foto en el índice 0 del array
            }
        }
    }, { returnDocument: 'after' });
};
exports.agregarFotoGaleria = agregarFotoGaleria;
// 5. ELIMINAR FOTO DE LA GALERÍA
const eliminarFotoGaleria = async (peluqueroId, public_id) => {
    await cloudinary_1.v2.uploader.destroy(public_id); // La borramos de la nube
    return await Portafolio_1.default.findOneAndUpdate({ peluquero: peluqueroId }, { $pull: { galeria: { public_id: public_id } } }, // La sacamos del array en MongoDB
    { returnDocument: 'after' });
};
exports.eliminarFotoGaleria = eliminarFotoGaleria;
//# sourceMappingURL=portafolioService.js.map