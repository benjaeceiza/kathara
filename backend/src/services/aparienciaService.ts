import Apariencia, { IApariencia } from '../models/Apariencia';

export const obtenerAparienciaService = async () => {
    let config = await Apariencia.findOne();
    // Si no hay configuración previa, creamos una por defecto
    if (!config) {
        config = await Apariencia.create({ fondoHero: '', fondoGeneral: '' });
    }
    return config;
};

export const actualizarAparienciaService = async (datos: Partial<IApariencia>) => {
    let config = await Apariencia.findOne();
    
    if (!config) {
        config = await Apariencia.create(datos);
    } else {
        // 🔥 Usamos returnDocument: 'after' para evitar los warnings de Mongoose
        config = await Apariencia.findByIdAndUpdate(config._id, datos, { returnDocument: 'after' });
    }
    
    return config;
};