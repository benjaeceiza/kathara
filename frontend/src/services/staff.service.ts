const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const getStaff = async (token?: string | null) => {
  // Si hay token, apuntamos a la ruta protegida (Todo el staff)
  // Si no hay token, apuntamos a la ruta pública (Solo activos)
  const url = token ? `${API_URL}/api/peluqueros` : `${API_URL}/api/peluqueros/activos`;

  const headers: any = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Mostramos la pulsera VIP
  }

  const respuesta = await fetch(url, { headers });
  const data = await respuesta.json();

  if (!respuesta.ok) throw new Error(data.error || data.mensaje || 'Error al obtener staff');
  return data;
};

// Crear
export const crearStaff = async (staffData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/peluqueros`, { // 🔥
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(staffData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al crear miembro');
  return data;
};

// Actualizar
export const actualizarStaff = async (id: string, staffData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/peluqueros/${id}`, { // 🔥
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(staffData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al actualizar');
  return data;
};

// Eliminar
export const eliminarStaff = async (id: string, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/peluqueros/${id}`, { // 🔥
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al eliminar');
  return data;
};