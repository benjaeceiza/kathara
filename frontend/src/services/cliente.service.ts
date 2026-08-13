const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const getClientes = async (token: string) => {
  const respuesta = await fetch(`${API_URL}/api/clientes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al obtener clientes');
  return data;
};

export const crearCliente = async (clienteData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(clienteData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al crear cliente');
  return data;
};

export const actualizarCliente = async (id: string, clienteData: any, token: string) => {
  const respuesta = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(clienteData)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al actualizar');
  return data;
};