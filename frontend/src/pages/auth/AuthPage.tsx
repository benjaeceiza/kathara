import { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Star
} from 'lucide-react';
import logo from "../../assets/logo.png";
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
  alLoguearse: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ alLoguearse }) => {
  const [esLogin, setEsLogin] = useState(true);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estados de los campos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        loginStore(data.token, data.usuario); // Zustand guarda todo y avisa a la app
        setMensaje(`✅ ¡Bienvenido a Kathara, ${data.usuario.nombre}!`);
        setTimeout(() => navigate('/'), 800); // Te redirige a la URL raíz
      } else {
        setMensaje('🎉 ¡Cuenta creada con éxito! Ahora iniciá sesión con tu clave.');
        setEsLogin(true);
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

      {/* ========================================================= */}
      {/* PANEL IZQUIERDO: IMAGEN ESTÉTICA (60% del ancho en PC)     */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-zinc-900 flex-col justify-between p-12 overflow-hidden border-r border-white/10">

        {/* Imagen de fondo de barbería oscura (Unsplash) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125 opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')` }}
        ></div>

        {/* Degradado y luces neón superpuestas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/80 pointer-events-none"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Branding Superior */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Reemplazamos la "B" por tu logo en un círculo limpio */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10 shrink-0">
            <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-wider text-white uppercase block leading-none">Kathara</span>
            <span className="text-[10px] text-orange-400 font-extrabold tracking-widest uppercase">Barber Studio & VIP Club</span>
          </div>
        </div>

        {/* Textos y Testimonios Inferiores */}
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

          {/* Tarjetita de prueba social flotante */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="h-9 w-9 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-xs font-bold text-orange-400">M</div>
              <div className="h-9 w-9 rounded-full ring-2 ring-zinc-900 bg-zinc-700 flex items-center justify-center text-xs font-bold text-amber-300">L</div>
              <div className="h-9 w-9 rounded-full ring-2 ring-zinc-900 bg-zinc-600 flex items-center justify-center text-xs font-bold text-white">G</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1 text-orange-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-orange-400" />
                <span>4.9 / 5.0</span>
              </div>
              <p className="text-zinc-500 font-medium">Más de 500 reservas gestionadas este mes</p>
            </div>
          </div>
        </div>

      </div>


      {/* ========================================================= */}
      {/* PANEL DERECHO: FORMULARIO (100vh a la derecha, 50% en PC)    */}
      {/* ========================================================= */}
      <div className="w-full lg:w-5/12 min-h-screen flex flex-col justify-center px-6 sm:px-12 xl:px-16 relative bg-[#09090B] z-10">

        {/* Resplandor de fondo sutil para el formulario */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Contenedor del Formulario */}
        <div className="w-full max-w-sm mx-auto space-y-8">

          {/* Cabecera del form */}
          <div>
            <p className="text-xs font-extrabold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{esLogin ? 'Bienvenido de vuelta' : 'Sumate al club VIP'}</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {esLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              {esLogin
                ? 'Ingresá tus credenciales para acceder a tu panel de turnos.'
                : 'Completá tus datos en menos de 1 minuto para empezar.'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campos exclusivos de Registro */}
            {!esLogin && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Nombre</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      placeholder="Benja"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    placeholder="E."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="cliente@barberia.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña con botón de Ver/Ocultar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Contraseña</label>
                {esLogin && (
                  <a href="#" className="text-[11px] text-orange-400 hover:underline font-semibold">¿Olvidaste tu clave?</a>
                )}
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón de Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black rounded-xl text-sm uppercase tracking-widest cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group"
              >
                <span>{cargando ? 'Procesando...' : (esLogin ? 'Ingresar ahora' : 'Crear mi cuenta')}</span>
                {!cargando && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            {/* Carteles de Feedback (Éxito o Error) */}
            {mensaje && (
              <div className={`p-4 rounded-xl text-center text-xs font-bold border animate-fadeIn ${mensaje.includes('✅') || mensaje.includes('🎉')
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}>
                {mensaje}
              </div>
            )}

          </form>

          {/* Switch de alternar entre Login / Registro */}
          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-400 text-xs">
              {esLogin ? '¿Todavía no formás parte? ' : '¿Ya tenés una cuenta en el club? '}
              <button
                type="button"
                onClick={() => { setEsLogin(!esLogin); setMensaje(null); }}
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