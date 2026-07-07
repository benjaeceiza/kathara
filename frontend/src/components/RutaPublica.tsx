
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RutaPublica: React.FC = () => {
  const estaLogueado = useAuthStore((state) => state.estaLogueado);

  // Si YA está logueado y quiere entrar al login, lo mandamos al Home
  return !estaLogueado ? <Outlet /> : <Navigate to="/" replace />;
};