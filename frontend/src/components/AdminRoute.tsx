import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AdminRoute = () => {
    const { estaLogueado, usuario } = useAuthStore();

    // Si no está logueado, o si está logueado pero NO es admin, lo pateamos al inicio
    if (!estaLogueado || usuario?.rol !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, lo dejamos pasar al contenido (Outlet)
    return <Outlet />;
};

export default AdminRoute;