import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  mensaje: string;
  tipo: 'success' | 'error';
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ mensaje, tipo, visible, onClose }) => {
  const [debeRenderizar, setDebeRenderizar] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    if (visible) {
      setDebeRenderizar(true);
      const t1 = setTimeout(() => setAnimando(true), 10);
      
      const t2 = setTimeout(() => {
        cerrarToast();
      }, 3500);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [visible]);

  const cerrarToast = () => {
    setAnimando(false);
    setTimeout(() => {
      setDebeRenderizar(false);
      onClose();
    }, 300); 
  };

  if (!debeRenderizar) return null;

  const isSuccess = tipo === 'success';

  // 🔥 ARMAMOS EL COMPONENTE
  const contenidoToast = (
    // 🔥 Contenedor fantasma: 0 ancho, 0 alto y pointer-events-none para que no interfiera
    <div className="absolute top-0 left-0 w-0 h-0 pointer-events-none">
      <div 
        // 🔥 Agregamos pointer-events-auto acá para que el botón de cerrar siga funcionando
        className={`fixed top-6 right-6 sm:top-10 sm:right-10 z-[9999] pointer-events-auto transition-all duration-300 ease-out transform ${
          animando 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-16 opacity-0 scale-95'
        }`}
      >
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
          isSuccess 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold tracking-wide">{mensaje}</p>
          <button 
            onClick={cerrarToast} 
            className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // 🔥 LO TELETRANSPORTAMOS DIRECTO AL BODY
  return createPortal(contenidoToast, document.body);
};