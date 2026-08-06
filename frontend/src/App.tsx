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
import { WizardReservasPage } from './pages/clientes/reservar/WizardReservasPage';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { TurnosAdminPage } from './pages/admin/TurnosAdminPage';
import { ServiciosAdminPage } from './pages/admin/ServiciosAdminPage';
import { StaffAdminPage } from './pages/admin/StaffAdminPage';
import { ClientesAdminPage } from './pages/admin/ClientesAdminPage';
import PortafolioAdminPage from './pages/admin/PortafolioAdminPage';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ScrollToTop } from './components/ScrollToTop';

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>

        {/* 🔥 LO INYECTAMOS ACÁ SIN ENSUCIAR EL ARCHIVO */}
        <ScrollToTop />

        <Routes>
          {/* 1. RUTAS DE AUTH */}
          <Route element={<RutaPublica />}>
            <Route path="/login" element={<AuthPage alLoguearse={() => { }} />} />
          </Route>

          {/* 2. EL LAYOUT GENERAL (Clientes) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServiciosStaffPage />} />
            <Route path="/staff/:id" element={<PortafolioBarberoPage />} />
            <Route path="/reservar" element={<WizardReservasPage />} />

            <Route element={<RutaPrivada />}>
              <Route path="/mis-turnos" element={<MisTurnosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>
          </Route>

          {/* 3. EL PANEL DE ADMINISTRADOR */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} />
              <Route path="servicios" element={<ServiciosAdminPage />} />
              <Route path="staff" element={<StaffAdminPage />} />
              <Route path="turnos" element={<TurnosAdminPage />} />
              <Route path="clientes" element={<ClientesAdminPage />} />
              <Route path="/admin/perfil" element={<PerfilPage />} />
              <Route path="/admin/portafolio" element={<PortafolioAdminPage />} />
            </Route>
          </Route>

          {/* 4. RUTA SALVAVIDAS */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;