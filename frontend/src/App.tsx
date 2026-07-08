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

function App() {
  const logout = useAuthStore((state) => state.logout);

  return (
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

          {/* B) RUTAS PRIVADAS VIP (Solo si están logueados) */}
          <Route element={<RutaPrivada />}>
            <Route path="/mis-turnos" element={<MisTurnosPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            {/* Acordate que luego acá sumaremos: <Route path="/reservar" element={<WizardReservasPage />} /> */}
          </Route>

        </Route>

        {/* Cualquier ruta inventada te tira al Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;