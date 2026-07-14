import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RutaPrivada } from './components/RutaPrivada';
import { RutaPublica } from './components/RutaPublica';
import AppLayout from './layouts/AppLayout';
import AuthPage from './pages/auth/AuthPage';
import { HomePage } from './pages/home/HomePage';
import MisTurnosPage from './pages/clientes/mis-turnos/MisTurnosPage';
import PerfilPage from './pages/clientes/perfil/PerfilPage';
import ServiciosStaffPage from './pages/servicios/ServiciosStaffPage';
import PortafolioBarberoPage from './pages/staff/PortafolioBarberoPage';
import { useAuthStore } from './store/authStore';
import { Loader } from './components/Loader';
import { WizardReservasPage } from './pages/clientes/reservar/WizardReservasPage';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { TurnosAdminPage } from './pages/admin/TurnosAdminPage';
import { ServiciosAdminPage } from './pages/admin/ServiciosAdminPage';
import { StaffAdminPage } from './pages/admin/StaffAdminPage';

// 🔥 IMPORTS DEL PANEL DE ADMINISTRADOR
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';

// 🔥 IMPORT DE GOOGLE OAUTH
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ClientesAdminPage } from './pages/admin/ClientesAdminPage';

function App() {
  const logout = useAuthStore((state) => state.logout);

  return (
    // 🔥 ENVOLVEMOS LA APP CON EL PROVIDER Y TU VARIABLE DE ENTORNO
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Loader />

        <Routes>

          {/* ========================================================= */}
          {/* 1. RUTAS DE AUTH (Públicas, SIN Sidebar ni Layout)        */}
          {/* ========================================================= */}
          <Route element={<RutaPublica />}>
            <Route path="/login" element={<AuthPage alLoguearse={() => { }} />} />
          </Route>


          {/* ========================================================= */}
          {/* 2. EL LAYOUT GENERAL (Todas estas rutas TIENEN Sidebar)    */}
          {/* ========================================================= */}
          <Route element={<AppLayout alCerrarSesion={logout} />}>

            {/* A) RUTAS PÚBLICAS DEL SALÓN (Las ve un visitante o un VIP) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServiciosStaffPage />} />
            <Route path="/staff/:id" element={<PortafolioBarberoPage />} />
            <Route path="/reservar" element={<WizardReservasPage />} />

            {/* B) RUTAS PRIVADAS VIP (Solo si están logueados) */}
            <Route element={<RutaPrivada />}>
              <Route path="/mis-turnos" element={<MisTurnosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>

          </Route>


          {/* ========================================================= */}
          {/* 3. EL PANEL DE ADMINISTRADOR (La Bóveda)                  */}
          {/* ========================================================= */}
          <Route element={<AdminRoute />}>
            {/* Todas las rutas acá adentro usan el layout de Admin (Barra lateral oscura) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} /> 
              <Route path="servicios" element={<ServiciosAdminPage />} />
              <Route path="staff" element={<StaffAdminPage />} />
              <Route path="turnos" element={<TurnosAdminPage />} />
              <Route path="clientes" element={<ClientesAdminPage />} />
            </Route>
          </Route>


          {/* ========================================================= */}
          {/* 4. RUTA SALVAVIDAS                                        */}
          {/* ========================================================= */}
          {/* Cualquier ruta inventada te tira al Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;