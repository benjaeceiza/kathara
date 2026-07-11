const API_URL = import.meta.env.VITE_BACKEND_URL;

// [GET] Traer la lista de todos los barberos
export const getStaff = async () => {
  try {
    const respuesta = await fetch(`${API_URL}/api/peluqueros`);
    if (!respuesta.ok) throw new Error('Error al obtener el staff');
    return await respuesta.json();
  } catch (error) {
    console.error("Error en getStaff:", error);
    return [];
  }
};

// [GET] Traer un solo barbero por su ID (Para el portafolio VIP)
export const getBarberoPorId = async (id: string) => {
  try {
    const respuesta = await fetch(`${API_URL}/api/staff/${id}`);
    if (!respuesta.ok) throw new Error('Error al obtener el perfil del barbero');
    return await respuesta.json();
  } catch (error) {
    console.error("Error en getBarberoPorId:", error);
    return null;
  }
};

// ---------------------------------------------------------
// EJEMPLO FUTURO ABM
// ---------------------------------------------------------
/*
export const crearBarbero = async (datos) => { ... }
export const actualizarBarbero = async (id, datos) => { ... }
export const eliminarBarbero = async (id) => { ... }
*/