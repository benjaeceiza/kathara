import { useState } from 'react';
import {
  Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Star, ArrowLeft
} from 'lucide-react';
import logo from "../../assets/logo.png";
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 🔥 IMPORTAMOS EL HOOK OFICIAL
import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface AuthPageProps {
  alLoguearse: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ alLoguearse }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [esLogin, setEsLogin] = useState(searchParams.get('mode') !== 'register');
  const [pasoLogin, setPasoLogin] = useState(1); 
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const loginStore = useAuthStore((state) => state.login);

  // 🔥 MAGIA DE GOOGLE: Abre el popup y maneja la respuesta
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setCargando(true);
      setMensaje('⏳ Conectando con los servidores...');
      
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
        const respuesta = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token_google: tokenResponse.access_token })
        });

        const data = await respuesta.json();
        if (!respuesta.ok) throw new Error(data.mensaje);

        loginStore(data.token, data.usuario); 
        setMensaje(`✅ ¡Bienvenido a Kathara, ${data.usuario.nombre}!`);

        const rutaDestino = searchParams.get('returnTo');
        let rutaFinal = '/';
        if (rutaDestino) {
          rutaFinal = rutaDestino;
        } else if (data.usuario.rol === 'admin' || data.usuario.rol === 'peluquero') {
          rutaFinal = '/admin';
        }

        setTimeout(() => navigate(rutaFinal), 800);

      } catch (error: any) {
        setMensaje(`❌ ${error.message}`);
        setCargando(false);
      }
    },
    onError: () => setMensaje('❌ Error al intentar iniciar sesión con Google'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (esLogin && pasoLogin === 1) {
      if (email.includes('@') && email.includes('.')) {
        setPasoLogin(2);
        setMensaje(null);
      } else {
        setMensaje('❌ Por favor, ingresá un correo válido.');
      }
      return; 
    }

    setCargando(true);
    setMensaje(null);

    const endpoint = esLogin ? '/api/auth/login' : '/api/auth/register';
    const url = `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;
    const bodyData = esLogin ? { email, password } : { nombre, apellido, email, password };

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || 'Hubo un error en la petición');
      }

      if (esLogin) {
        loginStore(data.token, data.usuario); 
        setMensaje(`✅ ¡Bienvenido a Kathara, ${data.usuario.nombre}!`);

        const rutaDestino = searchParams.get('returnTo');
        let rutaFinal = '/';

        if (rutaDestino) {
          rutaFinal = rutaDestino;
        } else if (data.usuario.rol === 'admin' || data.usuario.rol === 'peluquero') {
          rutaFinal = '/admin';
        }

        setTimeout(() => navigate(rutaFinal), 800);

      } else {
        setMensaje('🎉 ¡Cuenta creada con éxito! Ahora iniciá sesión.');
        setEsLogin(true);
        setPasoLogin(1);
        setPassword('');
      }
    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090B] font-sans overflow-hidden">

      {/* PANEL IZQUIERDO: IMAGEN ESTÉTICA */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-zinc-900 flex-col justify-between p-12 overflow-hidden border-r border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125 opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/80 pointer-events-none"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10 shrink-0">
            <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-wider text-white uppercase block leading-none">Kathara</span>
            <span className="text-[10px] text-orange-400 font-extrabold tracking-widest uppercase">Barber Studio & VIP Club</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-orange-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCESO EXCLUSIVO PARA CLIENTES</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight">
            Tu estilo y tu tiempo, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-white">
              en un solo lugar.
            </span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed font-normal">
            Gestioná tus turnos en tiempo real, elegí a tu profesional favorito y accedé a beneficios exclusivos del club VIP sin esperas innecesarias.
          </p>
        </div>
      </div>

      {/* PANEL DERECHO: FORMULARIO */}
      <div className="w-full lg:w-5/12 min-h-screen flex flex-col justify-center px-6 sm:px-12 xl:px-16 relative bg-[#09090B] z-10">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-sm mx-auto space-y-8">
          <div>
            <p className="text-xs font-extrabold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{esLogin ? 'Bienvenido de vuelta' : 'Sumate al club VIP'}</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {esLogin ? (pasoLogin === 1 ? 'Iniciar Sesión' : 'Tu contraseña') : 'Crear Cuenta'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              {esLogin 
                ? (pasoLogin === 1 ? 'Ingresá tu correo o usá tu cuenta de Google.' : `Ingresá la clave de ${email}`)
                : 'Completá tus datos en menos de 1 minuto para empezar.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {(pasoLogin === 1 || !esLogin) && (
              <div className="space-y-5 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()} // 🔥 EJECUTAMOS EL HOOK ACÁ
                  className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
                >
                  <GoogleIcon />
                  Continuar con Google
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">o con tu email</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>
              </div>
            )}

            {!esLogin && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Nombre</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Benja" className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Apellido</label>
                  <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required placeholder="E." className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                </div>
              </div>
            )}

            {(pasoLogin === 1 || !esLogin) && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="cliente@barberia.com" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                </div>
              </div>
            )}

            {(pasoLogin === 2 || !esLogin) && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Contraseña</label>
                  {esLogin && <a href="#" className="text-[11px] text-orange-400 hover:underline font-semibold">¿Olvidaste tu clave?</a>}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type={mostrarPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                  <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1">
                    {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <button type="submit" disabled={cargando} className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black rounded-xl text-sm uppercase tracking-widest cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2 group">
                <span>
                  {cargando ? 'Procesando...' : (esLogin ? (pasoLogin === 1 ? 'Continuar con email' : 'Ingresar ahora') : 'Crear mi cuenta')}
                </span>
                {!cargando && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              {esLogin && pasoLogin === 2 && (
                <button type="button" onClick={() => setPasoLogin(1)} className="w-full py-3 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowLeft className="w-4 h-4" /> Usar otro correo
                </button>
              )}
            </div>

            {mensaje && (
              <div className={`p-4 rounded-xl text-center text-xs font-bold border animate-fadeIn ${mensaje.includes('✅') || mensaje.includes('🎉') ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
                {mensaje}
              </div>
            )}
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-400 text-xs">
              {esLogin ? '¿Todavía no formás parte? ' : '¿Ya tenés una cuenta en el club? '}
              <button
                type="button"
                onClick={() => { setEsLogin(!esLogin); setPasoLogin(1); setMensaje(null); }}
                className="text-orange-400 font-extrabold hover:underline ml-1 cursor-pointer"
              >
                {esLogin ? 'Registrate gratis' : 'Iniciá sesión acá'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;