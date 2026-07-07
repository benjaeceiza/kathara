import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RutaPrivada } from './components/RutaPrivada';
import { RutaPublica } from './components/RutaPublica';
import AppLayout from './layouts/AppLayout';
import AuthPage from './pages/AuthPage';
import { useAuthStore } from './store/authStore';

function App() {
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* ========================================================= */}
        {/* RUTAS PÚBLICAS (Solo accesibles si NO estás logueado)     */}
        {/* ========================================================= */}
        <Route element={<RutaPublica />}>
          <Route path="/login" element={
            <AuthPage alLoguearse={() => {
              // El login ahora lo maneja Zustand desde el AuthPage, esto es solo por compatibilidad
              const token = localStorage.getItem('token_barberia');
              const usr = JSON.parse(localStorage.getItem('usuario_barberia') || '{}');
              if (token && usr) login(token, usr);
            }} />
          } />
        </Route>


        {/* ========================================================= */}
        {/* RUTAS PRIVADAS (Requieren pulserita/token)   */}
        {/* ========================================================= */}
        <Route element={<RutaPrivada />}>
          {/* Todas las rutas privadas van envueltas en tu AppLayout con el Sidebar y el Footer */}
          <Route element={<AppLayout alCerrarSesion={logout} />}>
            
            {/* Página Principal */}
            <Route path="/" element={<div />} /> {/* El AppLayout ya carga el Home por defecto */}
            
            {/* Acá iremos sumando las próximas pantallas: */}
            {/* <Route path="/reservar" element={<ReservarPage />} /> */}
            {/* <Route path="/mis-turnos" element={<MisTurnosPage />} /> */}
            {/* <Route path="/perfil" element={<ProfilePage />} /> */}
            
          </Route>
        </Route>


        {/* Cualquier URL fantasma que pongan en el navegador los redirige al Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;