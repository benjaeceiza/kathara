import { useState } from 'react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      const respuesta = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || 'Error al iniciar sesión');
      }

      // Guardamos el token y el usuario en el navegador
      localStorage.setItem('token_barberia', data.token);
      localStorage.setItem('usuario_barberia', JSON.stringify(data.usuario));

      setMensaje(`✅ ¡Bienvenido ${data.usuario.nombre}! Token guardado con éxito.`);
      console.log('Token VIP recibido:', data.token);

    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      width: '100vw'
    }}>
      <form onSubmit={handleLogin} style={{
        backgroundColor: '#1E1E1E',
        padding: '2.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        border: '1px solid #333'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#00E676', margin: '0 0 1.5rem 0' }}>
          Barbería VIP - Login
        </h2>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@barberia.com"
            required
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2A2A2A',
              color: '#fff',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.8rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2A2A2A',
              color: '#fff',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            padding: '0.9rem',
            backgroundColor: cargando ? '#555' : '#00E676',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: cargando ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {cargando ? 'Verificando...' : 'Entrar a la Barbería'}
        </button>

        {mensaje && (
          <div style={{
            marginTop: '1.5rem',
            padding: '0.8rem',
            borderRadius: '6px',
            backgroundColor: mensaje.includes('✅') ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 82, 82, 0.1)',
            border: `1px solid ${mensaje.includes('✅') ? '#00E676' : '#FF5252'}`,
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;