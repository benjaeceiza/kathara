import { create } from 'zustand';

interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'cliente' | 'peluquero' | 'admin';
}

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  estaLogueado: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
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
    }
  };
});