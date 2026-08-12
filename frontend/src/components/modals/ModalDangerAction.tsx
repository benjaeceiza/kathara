import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ModalDangerActionProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const ModalDangerAction: React.FC<ModalDangerActionProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Sí, cancelar',
    cancelText = 'Volver',
    isLoading = false
}) => {
    // 🔥 ESTOS DOS ESTADOS SON EL SECRETO DE LA ANIMACIÓN
    const [isMounted, setIsMounted] = useState(false); // Controla si existe en el DOM
    const [isVisible, setIsVisible] = useState(false); // Controla las clases de CSS

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true); // 1. Lo metemos en el DOM
            document.body.style.overflow = 'hidden';
            
            // 2. Le damos 10ms al navegador y activamos la animación de entrada
            const timeoutEnter = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timeoutEnter);
        } else {
            setIsVisible(false); // 1. Arranca la animación de salida (se achica y se apaga)
            document.body.style.overflow = 'unset';
            
            // 2. Esperamos 300ms a que termine de animar para borrarlo del DOM
            const timeoutExit = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timeoutExit);
        }
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
                isVisible ? 'bg-black/80 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
            }`}
        >
            {/* Contenedor del Modal con animación de escala (salta de 95% a 100%) */}
            <div 
                className={`relative w-full max-w-sm bg-zinc-950 border border-red-500/30 rounded-[2rem] p-8 shadow-2xl shadow-red-500/10 text-center transform transition-all duration-300 ease-out ${
                    isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                }`}
            >
                {/* Botón de cerrar (X) */}
                {!isLoading && (
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Ícono de Peligro Animado */}
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/30 mb-6 relative group">
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                    <AlertTriangle className={`w-10 h-10 text-red-500 relative z-10 transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-50'}`} />
                </div>

                {/* Textos */}
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed px-2">
                        {message}
                    </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 py-3.5 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent text-red-500 hover:text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Procesando</> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDangerAction;