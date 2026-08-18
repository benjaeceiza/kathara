import { useState, useLayoutEffect } from 'react';
// 🔥 IMPORTAMOS TU LOGO REAL 🔥
import logo from '../assets/logo.png'; 

interface LoaderProps {
    tipoLayout?: 'admin' | 'cliente' | 'completo';
}

export const Loader: React.FC<LoaderProps> = ({ tipoLayout = 'completo' }) => {
    const [cargando, setCargando] = useState(true);
    const [primeraCarga, setPrimeraCarga] = useState(true);

    useLayoutEffect(() => {
        setCargando(true);
        
        const timer = setTimeout(() => {
            setCargando(false);
            setTimeout(() => setPrimeraCarga(false), 700);
        }, 1400);

        return () => clearTimeout(timer);
    }, []); 

    let clasesPosicion = 'fixed inset-0'; 
    
    if (!primeraCarga) {
        if (tipoLayout === 'admin') {
            clasesPosicion = 'fixed top-0 right-0 bottom-0 left-0 md:left-64'; 
        } else if (tipoLayout === 'cliente') {
            clasesPosicion = 'fixed top-0 right-0 bottom-0 left-0 lg:left-64'; 
        }
    }

    return (
        <>
            <style>{`
        /* 🔥 Latido suave con brillo NEUTRO/MONOCROMÁTICO para el logo real 🔥 */
        @keyframes pulseLogo {
          0%, 100% { 
            transform: scale(0.95); 
            filter: drop-shadow(0 0 5px rgba(161, 161, 170, 0.2)); 
          }
          50% { 
            transform: scale(1.05); 
            filter: drop-shadow(0 0 20px rgba(161, 161, 170, 0.5)); 
          }
        }
        
        /* 🔥 Órbitas de carga exterior 🔥 */
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .anim-logo {
          animation: pulseLogo 2.5s ease-in-out infinite;
        }
        
        /* Efecto elástico para el aro principal */
        .anim-spinner-1 {
          animation: spinRing 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        
        /* Giro constante y suave para el aro secundario */
        .anim-spinner-2 {
          animation: spinRing 3s linear infinite reverse;
        }
      `}</style>

            <div
                className={`${clasesPosicion} z-[100] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl flex flex-col items-center justify-center transition-opacity ease-in-out duration-700 ${cargando
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Resplandor de fondo general (ahora es gris/blanco sutil en lugar de naranja) */}
                <div className="absolute w-72 h-72 bg-zinc-900/5 dark:bg-white/5 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center space-y-10">
                    
                    {/* CONTENEDOR DE LA ANIMACIÓN DEL LOGO (Más grande: w-36 h-36) */}
                    <div className="relative w-36 h-36 flex items-center justify-center drop-shadow-xl">
                        
                        {/* Aro Exterior (Blanco o Negro según el tema) */}
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-zinc-900 border-r-zinc-900/30 dark:border-t-white dark:border-r-white/30 anim-spinner-1"></div>
                        
                        {/* Aro Interior (Inverso, más sutil) */}
                        <div className="absolute inset-3 rounded-full border-[2px] border-transparent border-b-zinc-900 dark:border-b-white opacity-30 anim-spinner-2"></div>
                        
                        {/* TU LOGO ORIGINAL (Más grande: w-24 h-24) */}
                        <div className="w-24 h-24 relative z-10 anim-logo flex items-center justify-center">
                            <img 
                                src={logo} 
                                alt="Logo Kathara" 
                                /* dark:invert asegura que se ponga blanco si el modo es oscuro */
                                className="w-full h-full object-contain dark:invert" 
                            />
                        </div>
                    </div>

                    {/* TEXTOS */}
                    <div className="text-center space-y-2.5">
                        <span className="font-black text-2xl tracking-[0.25em] text-zinc-900 dark:text-white uppercase block leading-none pl-2 transition-colors duration-700">
                            Kathara
                        </span>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 pl-1 animate-pulse transition-colors duration-700">
                            {primeraCarga ? "Kathara Studio" : "Cargando..."}
                        </p>
                    </div>

                    {/* BARRA DE CARGA INFERIOR */}
                    <div className="w-24 h-[2px] bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-700 mt-2">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-zinc-900 dark:via-white to-transparent animate-[translate-x-full_1s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        </>
    );
};