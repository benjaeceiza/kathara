import { create } from 'zustand';

interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string;
  telefono?: string;
  rol: 'cliente' | 'peluquero' | 'admin';
  turnosCompletados?: number;
  faltas?: number;
  exentoSena?: boolean;
  fechaCreacion?: string;
}

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  estaLogueado: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  // 🔥 AGREGAMOS LA FIRMA DE LA FUNCIÓN
  actualizarUsuario: (nuevosDatos: Partial<Usuario>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // 1. Al iniciar la app, verificamos si ya había una sesión guardada en el navegador
  const tokenGuardado = localStorage.getItem('token_barberia');
  const usuarioGuardado = localStorage.getItem('usuario_barberia');
  const usuarioInicial = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  return {
    token: tokenGuardado,
    usuario: usuarioInicial,
    estaLogueado: !!tokenGuardado, // Si hay token, da true; si es null, da false

    // 2. Función para iniciar sesión (la llamaremos desde el AuthPage)
    login: (token, usuario) => {
      localStorage.setItem('token_barberia', token);
      localStorage.setItem('usuario_barberia', JSON.stringify(usuario));
      set({ token, usuario, estaLogueado: true });
    },

    // 3. Función para cerrar sesión (la llamaremos desde el Sidebar / Navbar)
    logout: () => {
      localStorage.removeItem('token_barberia');
      localStorage.removeItem('usuario_barberia');
      set({ token: null, usuario: null, estaLogueado: false });
    },

    // 🔥 4. Función para actualizar datos en tiempo real (ej: al editar el perfil)
    actualizarUsuario: (nuevosDatos) => set((state) => {
      // Si por alguna razón no hay usuario logueado, no hacemos nada
      if (!state.usuario) return state; 

      // Unimos los datos viejos con los nuevos que nos llegan
      const usuarioActualizado = { ...state.usuario, ...nuevosDatos };
      
      // Guardamos en el localStorage para que el cambio sobreviva si apretan F5
      localStorage.setItem('usuario_barberia', JSON.stringify(usuarioActualizado));

      // Actualizamos el estado global de Zustand
      return { usuario: usuarioActualizado };
    })
  };
});