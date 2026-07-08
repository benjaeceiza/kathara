import { useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Loader: React.FC = () => {
    const [cargando, setCargando] = useState(true);
    const [esCargaInicial, setEsCargaInicial] = useState(true);
    const location = useLocation();

    useLayoutEffect(() => {
        setCargando(true);

        const tiempo = esCargaInicial ? 1400 : 450;

        const timer = setTimeout(() => {
            setCargando(false);
            if (esCargaInicial) setEsCargaInicial(false);
        }, tiempo);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            <style>{`
        @keyframes snipTop {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(22deg); }
        }
        @keyframes snipBottom {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-22deg); }
        }
        .anim-hoja-arriba {
          animation: snipTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 50% 50%;
        }
        .anim-hoja-abajo {
          animation: snipBottom 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 50% 50%;
        }
      `}</style>

            {/* CONTENEDOR PRINCIPAL CON APARECER/DESVANECER PERFECTO */}
            <div
                className={`fixed inset-0 z-[100] bg-[#09090B] flex flex-col items-center justify-center transition-opacity ease-in-out ${cargando
                        ? 'opacity-100 pointer-events-auto duration-0'
                        : 'opacity-0 pointer-events-none duration-500'
                    }`}
            >
                {/* Luz Ambiental Neón Muy Sutil (Minimal Glow) */}
                <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center space-y-8">

                    {/* ========================================================= */}
                    {/* TIJERA MINIMALISTA (CONTORNO LINEAL LINE-ART)               */}
                    {/* ========================================================= */}
                    <div className="relative w-28 h-28 flex items-center justify-center">

                        <svg className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(249,115,22,0.3)]" viewBox="0 0 100 100">

                            {/* HOJA SUPERIOR (Contorno Naranja y Ámbar) */}
                            <g className="anim-hoja-arriba">
                                {/* Anillo del mango */}
                                <circle cx="25" cy="75" r="11" stroke="#F97316" strokeWidth="2.5" fill="none" />
                                {/* Lomo exterior de la hoja */}
                                <path d="M33 67 L47 53 L85 15" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                {/* Filo interior (línea más fina que converge en la punta para formar el contorno) */}
                                <path d="M53 47 L85 15" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" fill="none" className="opacity-80" />
                            </g>

                            {/* HOJA INFERIOR (Contorno Naranja y Ámbar) */}
                            <g className="anim-hoja-abajo">
                                {/* Anillo del mango */}
                                <circle cx="25" cy="25" r="11" stroke="#F97316" strokeWidth="2.5" fill="none" />
                                {/* Lomo exterior de la hoja */}
                                <path d="M33 33 L47 47 L85 85" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"fill="none" />
                                {/* Filo interior */}
                                <path d="M53 53 L85 85" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" fill="none" className="opacity-80" />
                            </g>

                            {/* TORNILLO CENTRAL MINIMALISTA (Aro vacío en vez de punto sólido) */}
                            <circle cx="50" cy="50" r="4" stroke="#FFFFFF" strokeWidth="2" fill="#09090B" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <circle cx="50" cy="50" r="1.5" fill="#F97316" />
                        </svg>

                    </div>

                    {/* BRANDING Y TEXTO SÚPER LIMPIO */}
                    <div className="text-center space-y-2.5">
                        <span className="font-black text-2xl tracking-[0.25em] text-white uppercase block leading-none pl-2">
                            Kathara
                        </span>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 pl-1 animate-pulse">
                            {esCargaInicial ? "Barber Studio & VIP Club" : "Cargando..."}
                        </p>
                    </div>

                    {/* BARRA DE PROGRESO ULTRA FINA (0.5px de alto) */}
                    <div className="w-24 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[translate-x-full_1s_ease-in-out_infinite]"></div>
                    </div>

                </div>
            </div>
        </>
    );
};