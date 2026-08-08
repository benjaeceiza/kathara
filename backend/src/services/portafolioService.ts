import Portafolio from '../models/Portafolio';
import Usuario from '../models/Usuario';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// 1. OBTENER O CREAR PORTAFOLIO

export const obtenerPortafolio = async (peluqueroId: string) => {
    const portafolio = await Portafolio.findOne({ peluquero: peluqueroId })
        .populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional'); // 🔥 Esto trae el objeto del usuario completo

    return portafolio;
};
export const crearPortafolio = async (peluqueroId: string) => {
    // Creamos el portafolio vacío
    const nuevoPortafolio = await Portafolio.create({ peluquero: peluqueroId });

    // Lo vinculamos automáticamente al perfil del usuario
    await Usuario.findByIdAndUpdate(
        peluqueroId,
        { portafolio: nuevoPortafolio._id },
        { returnDocument: 'after' }
    );

    return nuevoPortafolio;
};

// 2. ACTUALIZAR TEXTOS Y REDES
export const actualizarDatosPortafolio = async (peluqueroId: string, datos: any) => {
    // 🔥 Preparamos los datos que pertenecen a la colección Usuario
    const datosUsuario: any = {};

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
        await Usuario.findByIdAndUpdate(peluqueroId, datosUsuario);
    }

    // 🔥 Actualizamos el Portafolio y poblamos todo de vuelta
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        {
            $set: {
                biografiaProfesional: datos.biografiaProfesional,
                redesProfesionales: datos.redesProfesionales,
                especialidades: datos.especialidades, // Lo dejamos acá también como respaldo
                serviciosQueRealiza: datos.serviciosQueRealiza,
                estilo: datos.estilo,
                horarios: datos.horarios
            }
        },
        { returnDocument: 'after', upsert: true }
    ).populate('peluquero', 'nombre apellido avatar telefono especialidades tituloProfesional');
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

    // Actualizamos el avatar en el modelo Usuario
    await Usuario.findByIdAndUpdate(peluqueroId, { avatar: resultado.secure_url });

    // Devolvemos el portafolio actualizado para que el front reciba el cambio
    return await Portafolio.findOne({ peluquero: peluqueroId }).populate('peluquero', 'telefono avatar nombre apellido especialidades');
};

// 🔥 7. REORDENAR GALERÍA
export const reordenarGaleriaPortafolio = async (peluqueroId: string, nuevaGaleria: any[]) => {
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        { $set: { galeria: nuevaGaleria } },
        { returnDocument: 'after' }
    ).populate('peluquero', 'telefono avatar nombre apellido especialidades');
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
    await cloudinary.uploader.destroy(public_id); // La borramos de la nube
    return await Portafolio.findOneAndUpdate(
        { peluquero: peluqueroId },
        { $pull: { galeria: { public_id: public_id } } }, // La sacamos del array en MongoDB
        { returnDocument: 'after' }
    );
};