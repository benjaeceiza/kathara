import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Award,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    KeyRound,
    Save
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';


const PerfilPage: React.FC = () => {
    const usuarioStore = useAuthStore((state) => state.usuario);

    // 1. Estados para los datos del formulario
    const [nombre, setNombre] = useState(usuarioStore?.nombre || 'Benjamin');
    const [apellido, setApellido] = useState(usuarioStore?.apellido || 'Eceiza');
    const [email, setEmail] = useState(usuarioStore?.email || 'cliente@barberia.com');
    const [telefono, setTelefono] = useState('+54 9 2657 00-0000');

    // 2. Estado para la foto de Cloudinary (Provisorio con Unsplash o inicial)
    const [fotoUrl, setFotoUrl] = useState<string | null>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop");

    // 3. Estados para Seguridad (Contraseñas)
    const [passActual, setPassActual] = useState('');
    const [passNueva, setPassNueva] = useState('');
    const [passRepetir, setPassRepetir] = useState('');

    // 4. Estado de fidelidad (Simulamos que tiene 7 cortes de 10)
    const cortesRealizados = 7;
    const totalParaPremio = 10;

    // Manejo de subida de foto (Preview local antes de mandar a Cloudinary)
    const handleCambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const archivo = e.target.files[0];
            const previewTemporal = URL.createObjectURL(archivo);
            setFotoUrl(previewTemporal);

            // Acá después hacemos el fetch('http://localhost:8080/api/usuarios/subir-avatar', formData)
            alert("📸 Foto cargada. Al guardar cambios se subirá a Cloudinary.");
        }
    };

    const handleGuardarDatos = (e: React.FormEvent) => {
        e.preventDefault();
        alert("✅ ¡Datos personales actualizados con éxito en el salón!");
    };

    const handleCambiarPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passNueva !== passRepetir) {
            alert("❌ Las contraseñas nuevas no coinciden.");
            return;
        }
        alert("🔒 ¡Contraseña cambiada con seguridad!");
        setPassActual('');
        setPassNueva('');
        setPassRepetir('');
    };

    return (
        <div className="space-y-12 pb-16 max-w-5xl mx-auto">

            {/* Cabecera de Página */}
            <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Membresía VIP Kathara</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Mi Perfil.
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base mt-2">
                    Administrá tu identidad en el salón, revisá tus beneficios del club y mantené tu cuenta segura.
                </p>
            </div>

            {/* ========================================================= */}
            {/* SECCIÓN 1: TARJETA VIP DE FIDELIDAD (EL KILLER FEATURE)   */}
            {/* ========================================================= */}
            <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-orange-500/40 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-orange-950/20 overflow-hidden group">

                {/* Resplandor ámbars de fondo */}
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-orange-600/20 to-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">

                    {/* Info del Premio */}
                    <div className="space-y-3 text-center lg:text-left max-w-md">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                            <Award className="w-4 h-4" />
                            <span>Kathara Rewards Club</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                            ¡Estás a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{totalParaPremio - cortesRealizados} cortes</span> de tu premio!
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                            Cada vez que te atendés con nuestro staff sumás un sello en tu tarjeta digital. Al completar los 10, te regalamos un corte de autor 100% bonificado.
                        </p>
                    </div>

                    {/* Grilla de Sellos Digitales (10 Tréboles de Kathara) */}
                    <div className="bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md w-full lg:w-auto">
                        <div className="flex justify-between items-center mb-3 text-xs font-bold">
                            <span className="text-zinc-400">Progreso de sellos:</span>
                            <span className="text-orange-400 font-mono font-black text-sm">{cortesRealizados} / {totalParaPremio}</span>
                        </div>

                        {/* Los 10 sellos */}
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                            {Array.from({ length: totalParaPremio }).map((_, index) => {
                                const completado = index < cortesRealizados;
                                return (
                                    <div
                                        key={index}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${completado
                                                ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-black font-black shadow-lg shadow-orange-500/30 scale-105'
                                                : 'bg-zinc-800/80 border border-white/5 text-zinc-600'
                                            }`}
                                        title={completado ? `Corte #${index + 1} completado` : 'Sello pendiente'}
                                    >
                                        {completado ? (
                                            <span className="text-base">☘️</span> // O acá ponemos un mini trébol SVG de Kathara
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Barra de progreso fina abajo de los sellos */}
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                                style={{ width: `${(cortesRealizados / totalParaPremio) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                </div>
            </section>


            {/* ========================================================= */}
            {/* SECCIÓN 2: DATOS PERSONALES & AVATAR CLOUDINARY           */}
            {/* ========================================================= */}
            <form onSubmit={handleGuardarDatos} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 sm:p-10 space-y-8">

                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-orange-400" />
                            <span>Información Personal</span>
                        </h2>
                        <p className="text-zinc-400 text-xs mt-0.5">Actualizá tu nombre y vías de contacto para las notificaciones del turno.</p>
                    </div>
                </div>

                {/* Zona de Foto de Perfil (Cloudinary Trigger) */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-900/80 border border-white/5 w-fit">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-orange-500/50 flex items-center justify-center shrink-0">
                            {fotoUrl ? (
                                <img src={fotoUrl} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            ) : (
                                <span className="text-2xl font-black text-orange-400">{nombre.charAt(0)}</span>
                            )}
                        </div>

                        {/* Overlay al pasar el mouse o tocar para cambiar foto */}
                        <label className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6 text-white mb-0.5" />
                            <span className="text-[9px] font-bold text-white uppercase">Cambiar</span>
                            <input type="file" accept="image/*" onChange={handleCambiarFoto} className="hidden" />
                        </label>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                        <h4 className="text-sm font-bold text-white">Foto de Perfil en el Salón</h4>
                        <p className="text-xs text-zinc-400 max-w-xs">
                            Sube una foto clara para que tu peluquero te reconozca al llegar. Formatos: JPG, PNG o WEBP.
                        </p>
                        <label className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-orange-400 text-xs font-extrabold cursor-pointer transition-all border border-white/5">
                            <span>Seleccionar imagen</span>
                            <input type="file" accept="image/*" onChange={handleCambiarFoto} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Grilla de inputs personales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Correo Electrónico (No modificable)</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-950/50 border border-white/5 text-zinc-500 text-sm cursor-not-allowed font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Teléfono / WhatsApp</label>
                        <div className="relative">
                            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+54 9 2657 ..."
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>Guardar Datos Personales</span>
                    </button>
                </div>

            </form>


            {/* ========================================================= */}
            {/* SECCIÓN 3: SEGURIDAD & CAMBIO DE CONTRASEÑA               */}
            {/* ========================================================= */}
            <form onSubmit={handleCambiarPassword} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 sm:p-10 space-y-8">

                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-orange-400" />
                            <span>Seguridad de la Cuenta</span>
                        </h2>
                        <p className="text-zinc-400 text-xs mt-0.5">Te recomendamos usar una contraseña segura que no utilices en otros sitios.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Contraseña Actual</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={passActual}
                                onChange={(e) => setPassActual(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Nueva Contraseña</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={passNueva}
                                onChange={(e) => setPassNueva(e.target.value)}
                                required
                                placeholder="Mínimo 6 caracteres"
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Repetir Nueva</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={passRepetir}
                                onChange={(e) => setPassRepetir(e.target.value)}
                                required
                                placeholder="Confirmar clave"
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-8 py-3.5 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-black text-zinc-300 font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer border border-white/5"
                    >
                        <span>Actualizar Contraseña</span>
                    </button>
                </div>

            </form>

        </div>
    );
};

export default PerfilPage;