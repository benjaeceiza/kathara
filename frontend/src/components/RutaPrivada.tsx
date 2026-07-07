
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RutaPrivada: React.FC = () => {
  const estaLogueado = useAuthStore((state) => state.estaLogueado);

  // Si tiene sesión, dejamos pasar al contenido (<Outlet />). Si no, al /login
  return estaLogueado ? <Outlet /> : <Navigate to="/login" replace />;
};