

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