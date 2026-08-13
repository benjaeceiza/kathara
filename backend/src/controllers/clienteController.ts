import * as clienteService from '../services/clienteService';

// 🔥 GET /api/clientes
export const obtenerClientes = async (req: any, res: any) => {
    try {
        const clientes = await clienteService.obtenerClientesService();
        res.json(clientes);
    } catch (error: any) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

// 🔥 POST /api/clientes
export const crearCliente = async (req: any, res: any) => {
    try {
        const nuevo = await clienteService.crearClienteService(req.body);
        res.status(201).json({ mensaje: 'Cliente creado con éxito', cliente: nuevo });
    } catch (error: any) {
        console.error("Error al crear cliente:", error);
        res.status(400).json({ error: error.message || 'Error al crear el cliente' });
    }
};

// 🔥 PUT /api/clientes/:id
export const actualizarCliente = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const actualizado = await clienteService.actualizarClienteService(id, req.body);
        res.json({ mensaje: 'Actualizado con éxito', cliente: actualizado });
    } catch (error: any) {
        console.error("Error al actualizar cliente:", error);
        res.status(400).json({ error: error.message || 'Error al actualizar' });
    }
};