import React from 'react';

interface ProfilePageProps {
  alCerrarSesion: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ alCerrarSesion }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario_barberia') || '{}');

  const cerrarSesion = () => {
    localStorage.removeItem('token_barberia');
    localStorage.removeItem('usuario_barberia');
    alCerrarSesion();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center p-4 font-sans w-screen">
      {/* Tarjeta principal con bordes, sombreado y fondo oscuro */}
      <div className="bg-zinc-900 p-8 sm:p-12 rounded-2xl w-full max-w-md text-center border border-zinc-800 shadow-2xl">
        
        {/* Avatar redondo con borde verde esmeralda */}
        <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-emerald-400 flex justify-center items-center text-3xl font-bold mx-auto mb-6 text-emerald-400 shadow-lg shadow-emerald-950">
          {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '👤'}
        </div>

        {/* Textos con jerarquía limpia */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          ¡Hola, {usuario.nombre} {usuario.apellido}!
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          {usuario.email}
        </p>

        {/* BADGE DEL ROL: Cambia de color dinámicamente según si es admin o cliente */}
        <div className={`inline-block px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-8 border ${
          usuario.rol === 'admin'
            ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm shadow-amber-950'
            : 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-950'
        }`}>
          🛡️ Rol: {usuario.rol || 'cliente'}
        </div>

        {/* Botón con efecto Hover (cambia al pasar el mouse por arriba) */}
        <div className="border-t border-zinc-800 pt-6">
          <button 
            onClick={cerrarSesion} 
            className="w-full py-3 px-4 bg-transparent border border-red-500/80 text-red-400 rounded-xl font-bold cursor-pointer hover:bg-red-500 hover:text-black transition-all duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;