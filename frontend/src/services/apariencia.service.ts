const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const getApariencia = async () => {
  const respuesta = await fetch(`${API_URL}/api/apariencia`);
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al obtener apariencia');
  return data;
};

export const actualizarApariencia = async (datos: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/apariencia`, {
    method: 'PUT',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(datos)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al actualizar apariencia');
  return data;
};

export const subirFondoBackend = async (file: File, tipo: 'hero' | 'general', token: string) => {
  const formData = new FormData();
  formData.append('imagen', file);
  formData.append('tipo', tipo); // 👈 Le mandamos el dato al backend

  const respuesta = await fetch(`${API_URL}/api/apariencia/upload`, {
    method: 'POST',
    headers: { 
        'Authorization': `Bearer ${token}` 
    },
    body: formData
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al subir la imagen al servidor');
  return data.url;
};