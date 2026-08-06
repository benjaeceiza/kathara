const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
import { useAuthStore } from '../store/authStore';

// Función auxiliar para no repetir los headers del token en cada petición
const getAuthHeaders = () => {
    // Sacamos el token directamente de Zustand
    const token = useAuthStore.getState().token;

    // (Por si acaso lo tenías en localStorage con otro nombre, podés usarlo de respaldo)
    const tokenRespaldo = localStorage.getItem('token');

    return {
        'Authorization': `Bearer ${token || tokenRespaldo}`
    };
};

// CREAR PORTAFOLIO DESDE CERO
export const crearMiPortafolio = async () => {
    const respuesta = await fetch(`${API_URL}/api/portafolio`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al crear el portafolio');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

// 1. OBTENER MI PORTAFOLIO
export const obtenerMiPortafolio = async () => {
    const respuesta = await fetch(`${API_URL}/api/portafolio`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al obtener el portafolio');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

export const obtenerPortafolioPublico = async (peluqueroId: string) => {
    const respuesta = await fetch(`${API_URL}/api/portafolio/publico/${peluqueroId}`);

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'No se pudo cargar el portafolio');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

// 2. ACTUALIZAR TEXTOS Y REDES
export const actualizarDatosPortafolio = async (datos: any) => {
    const respuesta = await fetch(`${API_URL}/api/portafolio/datos`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al actualizar los datos');
    }

    const data = await respuesta.json();
    return data.portafolio;
};



// 3. SUBIR FOTO DE PORTADA
export const subirFotoPortada = async (archivo: File | Blob) => {
    const formData = new FormData();
    formData.append('imagen', archivo);

    const respuesta = await fetch(`${API_URL}/api/portafolio/portada`, {
        method: 'PUT',
        headers: getAuthHeaders(), // 🔥 SIN Content-Type acá, el navegador lo hace solo
        body: formData,
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al subir la portada');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

// 4. SUBIR IMAGEN A LA GALERÍA
export const subirImagenGaleria = async (archivo: File | Blob) => {
    const formData = new FormData();
    formData.append('imagen', archivo);

    const respuesta = await fetch(`${API_URL}/api/portafolio/galeria`, {
        method: 'POST',
        headers: getAuthHeaders(), // 🔥 SIN Content-Type acá tampoco
        body: formData,
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al agregar la imagen');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

// 5. ELIMINAR IMAGEN DE LA GALERÍA
export const eliminarImagenGaleria = async (public_id: string) => {
    const respuesta = await fetch(`${API_URL}/api/portafolio/galeria`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id }), // Acá sí mandamos JSON, así que va con su Content-Type
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al eliminar la imagen');
    }

    const data = await respuesta.json();
    return data.portafolio;
};


export const subirAvatarUsuario = async (archivo: File | Blob) => {
    const formData = new FormData();
    formData.append('imagen', archivo);

    const respuesta = await fetch(`${API_URL}/api/portafolio/avatar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al actualizar el avatar');
    }

    const data = await respuesta.json();
    return data.portafolio;
};

export const actualizarOrdenGaleria = async (nuevaGaleria: any[]) => {
    const respuesta = await fetch(`${API_URL}/api/portafolio/galeria/reordenar`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaGaleria }),
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error al reordenar la galería');
    }

    const data = await respuesta.json();
    return data.portafolio;
};