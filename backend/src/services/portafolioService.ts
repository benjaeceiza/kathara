import Portafolio from '../models/Portafolio';
import Usuario from '../models/Usuario';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import mongoose from 'mongoose';

// 1. OBTENER O CREAR PORTAFOLIO
export const obtenerPortafolio = async (peluqueroId: string) => {
    const portafolio = await Portafolio.findOne({ peluquero: peluqueroId })
        .populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional serviciosQueRealiza horarios');

    return portafolio;
};

export const crearPortafolio = async (peluqueroId: string) => {
    const nuevoPortafolio = await Portafolio.create({ peluquero: peluqueroId });
    await Usuario.findByIdAndUpdate(
        peluqueroId,
        { portafolio: nuevoPortafolio._id },
        { returnDocument: 'after' }
    );
    return nuevoPortafolio;
};

// 2. ACTUALIZAR TEXTOS Y REDES
export const actualizarDatosPortafolio = async (peluqueroId: string, datos: any) => {
    const datosUsuario: any = {};

    if (datos.redesProfesionales?.whatsapp) {
        datosUsuario.telefono = datos.redesProfesionales.whatsapp;
    }

    if (datos.tituloProfesional) {
        datosUsuario.tituloProfesional = datos.tituloProfesional;
    }

    if (datos.especialidades) {
        datosUsuario.especialidades = datos.especialidades;
    }
    if (datos.horarios) datosUsuario.horarios = datos.horarios;

    if (datos.serviciosQueRealiza) {
        let serviciosArray = datos.serviciosQueRealiza;

        // 1. Si llegó como un string gigante (texto), lo forzamos a convertirse en array
        if (typeof serviciosArray === 'string') {
            try {
                // Intentamos parsearlo como JSON normal
                serviciosArray = JSON.parse(serviciosArray);
            } catch (e) {
                // Si falla, le sacamos los corchetes, comillas y saltos de línea a la fuerza
                serviciosArray = serviciosArray.replace(/[\[\]\'\"\n ]/g, '').split(',');
            }
        }

        // 2. Filtramos la basura: Solo dejamos los IDs que sean válidos para MongoDB (24 caracteres hex)
        const serviciosLimpios = serviciosArray.filter((id: any) => {
            const idLimpio = String(id).trim();
            return mongoose.Types.ObjectId.isValid(idLimpio) && idLimpio.length === 24;
        });

        // Guardamos la lista limpia lista para usar
        datosUsuario.serviciosQueRealiza = serviciosLimpios;
        datos.serviciosQueRealiza = serviciosLimpios; // Actualizamos el original también
    }
    // =========================================================

    // Si hay algo que actualizar en el Usuario, lo disparamos
    if (Object.keys(datosUsuario).length > 0) {
        await Usuario.findByIdAndUpdate(peluqueroId, datosUsuario);
    }

    // Actualizamos el Portafolio y poblamos todo de vuelta
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        {
            $set: {
                biografiaProfesional: datos.biografiaProfesional,
                redesProfesionales: datos.redesProfesionales,
                especialidades: datos.especialidades,
                serviciosQueRealiza: datos.serviciosQueRealiza, // Acá ya entra limpiecito
                estilo: datos.estilo,
                horarios: datos.horarios
            }
        },
        { returnDocument: 'after', upsert: true }
    ).populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional serviciosQueRealiza horarios');
};

// --- LÓGICA DE CLOUDINARY PARA EL PORTAFOLIO ---
const subirACloudinary = (buffer: Buffer, carpeta: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `kathara/portafolio/${carpeta}` },
            (error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const actualizarAvatarUsuario = async (peluqueroId: string, fileBuffer: Buffer) => {
    const resultado: any = await subirACloudinary(fileBuffer, 'avatars');
    await Usuario.findByIdAndUpdate(peluqueroId, { avatar: resultado.secure_url });
    return await Portafolio.findOne({ peluquero: peluqueroId }).populate('peluquero', 'telefono avatar nombre apellido especialidades serviciosQueRealiza');
};

// 🔥 7. REORDENAR GALERÍA
export const reordenarGaleriaPortafolio = async (peluqueroId: string, nuevaGaleria: any[]) => {
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        { $set: { galeria: nuevaGaleria } },
        { returnDocument: 'after' }
    ).populate('peluquero', 'telefono avatar nombre apellido especialidades serviciosQueRealiza');
};

// 3. SUBIR FOTO DE PORTADA
export const actualizarPortada = async (peluqueroId: string, fileBuffer: Buffer) => {
    const resultado: any = await subirACloudinary(fileBuffer, 'portadas');
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        { fotoPortada: resultado.secure_url },
        { returnDocument: 'after' }
    );
};

// 4. AGREGAR FOTO A LA GALERÍA
export const agregarFotoGaleria = async (peluqueroId: string, fileBuffer: Buffer) => {
    const resultado: any = await subirACloudinary(fileBuffer, 'galeria');
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        {
            $push: {
                galeria: {
                    $each: [{ url: resultado.secure_url, public_id: resultado.public_id }],
                    $position: 0 // 🔥 Mete la foto en el índice 0 del array
                }
            }
        },
        { returnDocument: 'after' }
    );
};

// 5. ELIMINAR FOTO DE LA GALERÍA
export const eliminarFotoGaleria = async (peluqueroId: string, public_id: string) => {
    await cloudinary.uploader.destroy(public_id);
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        { $pull: { galeria: { public_id: public_id } } },
        { returnDocument: 'after' }
    );
};