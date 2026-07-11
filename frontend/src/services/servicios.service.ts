const API_URL = import.meta.env.VITE_BACKEND_URL;

// [GET] Traer todos los servicios al catálogo
export const getServicios = async () => {
  try {
    const respuesta = await fetch(`${API_URL}/api/servicios`);
    if (!respuesta.ok) throw new Error('Error al obtener los servicios');
    return await respuesta.json();
  } catch (error) {
    console.error("Error en getServicios:", error);
    return [];
  }
};

// ---------------------------------------------------------
// EJEMPLO FUTURO ABM (Los dejamos comentados para cuando armes el panel Admin)
// ---------------------------------------------------------
/*
export const crearServicio = async (datos) => { ... }
export const actualizarServicio = async (id, datos) => { ... }
export const eliminarServicio = async (id) => { ... }
*/