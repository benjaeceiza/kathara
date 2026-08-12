const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const getServicios = async () => {
  const respuesta = await fetch(`${API_URL}/api/servicios`);
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al obtener servicios');
  return data;
};

// 🔥 NUEVO: Crear Servicio
export const crearServicio = async (servicioData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/servicios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(servicioData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al crear servicio');
  return data;
};

// 🔥 NUEVO: Actualizar Servicio
export const actualizarServicio = async (id: string, servicioData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/servicios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(servicioData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al actualizar servicio');
  return data;
};

// 🔥 NUEVO: Eliminar Servicio
export const eliminarServicio = async (id: string, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/servicios/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al eliminar servicio');
  return data;
};