import * as peluqueroService from '../services/peluqueroService';

// 🔥 GET /api/peluqueros (Trae todo el staff para el admin)
export const obtenerTodoElStaff = async (req: any, res: any) => {
    try {
        const staff = await peluqueroService.obtenerTodoElStaff();
        res.json(staff);
    } catch (error: any) {
        console.error("Error al obtener staff:", error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

// 🔥 POST /api/peluqueros
export const crearPeluquero = async (req: any, res: any) => {
    try {
        const nuevo = await peluqueroService.crearNuevoPeluquero(req.body);
        res.status(201).json({ mensaje: 'Miembro creado con éxito', miembro: nuevo });
    } catch (error: any) {
        console.error("Error al crear staff:", error);
        res.status(400).json({ error: error.message || 'Error al crear el miembro' });
    }
};

// 🔥 PUT /api/peluqueros/:id
export const actualizarPeluquero = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const actualizado = await peluqueroService.actualizarPeluquero(id, req.body);
        res.json({ mensaje: 'Actualizado con éxito', miembro: actualizado });
    } catch (error: any) {
        console.error("Error al actualizar staff:", error);
        res.status(400).json({ error: error.message || 'Error al actualizar' });
    }
};

// 🔥 DELETE /api/peluqueros/:id
export const eliminarPeluquero = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await peluqueroService.eliminarPeluquero(id);
        res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error: any) {
        console.error("Error al eliminar staff:", error);
        res.status(400).json({ error: error.message || 'Error al eliminar' });
    }
};

export const obtenerPeluquerosActivos = async (req: any, res: any) => {
    try {
        const activos = await peluqueroService.obtenerPeluquerosActivos();
        res.json(activos);
    } catch (error: any) {
        console.error("Error al obtener activos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};