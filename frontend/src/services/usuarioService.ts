import { useAuthStore } from '../store/authStore';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`;

// Función auxiliar para armar los headers con el token
const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const actualizarDatosPersonales = async (datos: { nombre: string, apellido: string, telefono: string }) => {
  const respuesta = await fetch(`${API_URL}/mi-perfil`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al actualizar el perfil');
  
  return data;
};

export const cambiarClave = async (actual: string, nueva: string) => {
  const respuesta = await fetch(`${API_URL}/cambiar-password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ actual, nueva })
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al cambiar la contraseña');
  
  return data;
};


export const actualizarAvatar = async (archivo: File) => {
  // 1. Armamos el "paquete" con el archivo
  const formData = new FormData();
  // El nombre 'imagen' TIENE que coincidir con el uploadAvatar.single('imagen') del backend
  formData.append('imagen', archivo); 

  // 2. Traemos el token
  const token = useAuthStore.getState().token;

  // 3. Hacemos la petición
  const respuesta = await fetch(`${API_URL}/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // 🔥 ATENCIÓN: No ponemos 'Content-Type' acá. El navegador lo maneja.
    },
    body: formData
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al actualizar la foto de perfil');
  
  return data;
};


export const eliminarAvatar = async () => {
  const token = useAuthStore.getState().token;

  const respuesta = await fetch(`${API_URL}/avatar`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al eliminar la foto de perfil');
  
  return data;
};