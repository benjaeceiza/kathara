

export interface ReservaPayload {
  peluqueroId: string;
  servicios: string[];
  fechaHoraInicio: string;
}

export const confirmarReserva = async (payload: ReservaPayload, token: string | null) => {
  if (!token) {
    throw new Error('No estás autenticado. Iniciá sesión para reservar.');
  }

  // 🔥 Le pegamos a la URL exacta que me pediste
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/turnos/reservar`;

  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // La pulsera VIP
    },
    body: JSON.stringify(payload)
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.mensaje || 'Hubo un error al procesar la reserva');
  }

  return data;
};

// 🔥 OBTENER MIS TURNOS (Activos y el Historial)
export const obtenerMisTurnos = async (token: string | null) => {
  if (!token) {
    throw new Error('No estás autenticado.');
  }

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/turnos/mis-turnos`;

  const respuesta = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Hubo un error al obtener tus turnos');
  }

  return data; // Devuelve { turnos: [...] }
};

// 🔥 CANCELAR UN TURNO
export const cancelarTurno = async (turnoId: string, token: string | null) => {
  if (!token) {
    throw new Error('No estás autenticado.');
  }

  const url = `${import.meta.env.VITE_BACKEND_URL}/api/turnos/${turnoId}/cancelar`;

  const respuesta = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Hubo un error al cancelar el turno');
  }

  return data;
};


export const obtenerTurnosOcupados = async (peluqueroId: string, fecha: string) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const url = `${API_URL}/api/turnos/ocupados?peluqueroId=${peluqueroId}&fecha=${fecha}`;

  const respuesta = await fetch(url);
  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Hubo un error al obtener disponibilidad');
  }

  // Esto ahora devuelve un array: [{ inicio: "...", fin: "..." }, ...]
  return data.ocupados; 
};


// 🔥 OBTENER TURNOS DE HOY (DASHBOARD ADMIN)
export const obtenerTurnosHoyAdmin = async (token: string | null) => {
  if (!token) throw new Error('No estás autenticado.');

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const respuesta = await fetch(`${API_URL}/api/turnos/hoy`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al obtener métricas');
  
  return data.turnos;
};

export const obtenerTurnosSemanaAdmin = async (token: string | null) => {
  if (!token) throw new Error('No estás autenticado.');

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const respuesta = await fetch(`${API_URL}/api/turnos/semana`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al obtener la agenda');
  
  return data.turnos;
};