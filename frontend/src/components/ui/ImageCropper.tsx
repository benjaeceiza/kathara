import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropCompleteAction: (croppedAreaPixels: any) => void;
  onClose: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropCompleteAction, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center z-10 bg-zinc-900">
          <h3 className="text-white font-black uppercase tracking-widest text-sm">Ajustar Foto</h3>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zona del Cropper */}
        <div className="relative flex-1 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // 1:1 para que sea un cuadrado/círculo perfecto
            cropShape="round" // Muestra una guía circular
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controles de Zoom y Guardar */}
        <div className="p-6 bg-zinc-900 border-t border-white/5 z-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          
          <button 
            onClick={() => onCropCompleteAction(croppedAreaPixels)}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Aplicar y Subir</span>
          </button>
        </div>
      </div>
    </div>
  );
};