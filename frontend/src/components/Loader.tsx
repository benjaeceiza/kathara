import { useState, useLayoutEffect } from 'react';

// 🔥 1. Le decimos que puede recibir un tipo de layout
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
            // 🔥 CLAVE: Esperamos 700ms (lo que dura la animación de desvanecerse)
            // ANTES de decirle al layout que ya pasó la primera carga.
            setTimeout(() => setPrimeraCarga(false), 700);
        }, 1400);

        return () => clearTimeout(timer);
    }, []); 

    // 🔥 LA MAGIA DE LA SINCRONIZACIÓN
    // Mientras sea la primera carga (incluso mientras se está desvaneciendo),
    // forzamos el 'inset-0' para que tape TODA la pantalla, incluyendo el Sidebar.
    // Así escondemos el parpadeo del fondo detrás del menú.
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

            <div
                // El z-[100] asegura que quede por encima del Sidebar que tiene z-50
                className={`${clasesPosicion} z-[100] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl flex flex-col items-center justify-center transition-opacity ease-in-out duration-700 ${cargando
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="absolute w-64 h-64 bg-zinc-400/20 dark:bg-white/5 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center space-y-8">
                    
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full overflow-visible drop-shadow-xl" viewBox="0 0 100 100">
                            <g className="anim-hoja-arriba text-zinc-900 dark:text-white">
                                <circle cx="25" cy="75" r="11" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                <path d="M33 67 L47 53 L85 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                <path d="M53 47 L85 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" className="text-zinc-400 dark:text-zinc-500 opacity-80" />
                            </g>
                            <g className="anim-hoja-abajo text-zinc-900 dark:text-white">
                                <circle cx="25" cy="25" r="11" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                <path d="M33 33 L47 47 L85 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                <path d="M53 53 L85 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" className="text-zinc-400 dark:text-zinc-500 opacity-80" />
                            </g>
                            
                            <circle cx="50" cy="50" r="4" strokeWidth="2" className="stroke-zinc-900 dark:stroke-white fill-white dark:fill-zinc-900 drop-shadow-md" />
                            <circle cx="50" cy="50" r="1.5" className="fill-zinc-900 dark:fill-white" />
                        </svg>
                    </div>

                    <div className="text-center space-y-2.5">
                        <span className="font-black text-2xl tracking-[0.25em] text-zinc-900 dark:text-white uppercase block leading-none pl-2 transition-colors duration-700">
                            Kathara
                        </span>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 pl-1 animate-pulse transition-colors duration-700">
                            {primeraCarga ? "Barber Studio & VIP Club" : "Cargando..."}
                        </p>
                    </div>

                    <div className="w-24 h-[2px] bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-700">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-zinc-900 dark:via-white to-transparent animate-[translate-x-full_1s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        </>
    );
};