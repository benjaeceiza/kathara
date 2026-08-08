import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Camera, Grip, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { actualizarOrdenGaleria } from '../../../services/portafolioService';

const FOTOS_POR_PAGINA = 5;

export default function PortafolioGaleria({
    portafolio,
    setPortafolio,
    editandoInfo,
    subiendoGaleria,
    handleSubirGaleria,
    handleEliminarImagen,
    setToast,
    cargarPortafolio
}: any) {
    const galeriaInputRef = useRef<HTMLInputElement>(null);
    const [paginaGaleria, setPaginaGaleria] = useState(0);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // 🔥 Nuevos estados para controlar el drag en los bordes
    const [isDragging, setIsDragging] = useState(false);
    const changePageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const totalPaginas = Math.ceil((portafolio?.galeria?.length || 0) / FOTOS_POR_PAGINA);
    const fotosMostradas = portafolio?.galeria?.slice(paginaGaleria * FOTOS_POR_PAGINA, (paginaGaleria + 1) * FOTOS_POR_PAGINA) || [];

    const handleNextPage = () => setPaginaGaleria(p => Math.min(p + 1, totalPaginas - 1));
    const handlePrevPage = () => setPaginaGaleria(p => Math.max(p - 1, 0));

    // ==========================================
    // 🖐️ EVENTOS DRAG NORMALES
    // ==========================================
    const handleDragStart = (e: React.DragEvent, realIndex: number) => {
        if (!editandoInfo) { e.preventDefault(); return; }
        setDraggedIndex(realIndex);
        setIsDragging(true); // Avisamos que empezó el arrastre
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { (e.target as HTMLElement).style.opacity = '0.5'; }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        setDraggedIndex(null);
        setIsDragging(false);
        if (changePageTimeout.current) clearTimeout(changePageTimeout.current);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetRealIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetRealIndex) return;

        const nuevaGaleria = [...portafolio.galeria];
        const [movedItem] = nuevaGaleria.splice(draggedIndex, 1);
        nuevaGaleria.splice(targetRealIndex, 0, movedItem);

        setPortafolio({ ...portafolio, galeria: nuevaGaleria });

        // Reseteamos estados
        setDraggedIndex(null);
        setIsDragging(false);
        if (changePageTimeout.current) clearTimeout(changePageTimeout.current);

        try {
            await actualizarOrdenGaleria(nuevaGaleria);
            setToast({ visible: true, mensaje: 'Orden guardado', tipo: 'success' });
        } catch (error: any) {
            setToast({ visible: true, mensaje: error.message, tipo: 'error' });
            cargarPortafolio();
        }
    };

    // ==========================================
    // 🚀 LÓGICA DE ZONAS LATERALES (NUEVO)
    // ==========================================
    const handleEdgeEnter = (direction: 'left' | 'right') => {
        if (!isDragging) return;
        if (changePageTimeout.current) clearTimeout(changePageTimeout.current);

        // Si se queda 600ms en el borde, cambiamos la página
        changePageTimeout.current = setTimeout(() => {
            if (direction === 'left') {
                setPaginaGaleria(p => Math.max(p - 1, 0));
            } else {
                setPaginaGaleria(p => Math.min(p + 1, totalPaginas - 1));
            }
        }, 600);
    };

    const handleEdgeLeave = () => {
        // Si saca el mouse del borde antes de los 600ms, cancelamos el cambio
        if (changePageTimeout.current) clearTimeout(changePageTimeout.current);
    };

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-orange-500" /> Galería de Trabajos
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        {editandoInfo ? 'Arrastrá a los bordes para cambiar de slider.' : 'Activá la edición para modificar tu galería.'}
                    </p>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={galeriaInputRef} onChange={handleSubirGaleria} />
                <button onClick={() => galeriaInputRef.current?.click()} disabled={subiendoGaleria} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-black font-bold rounded-xl transition-all border border-orange-500/30 hover:border-transparent disabled:opacity-50 shrink-0">
                    {subiendoGaleria ? 'Subiendo...' : <><Upload className="w-4 h-4" /> Añadir Foto</>}
                </button>
            </div>

            {portafolio.galeria && portafolio.galeria.length > 0 ? (
                <div className="flex-1 flex flex-col justify-between relative">

                    {/* 🔥 ZONA LATERAL IZQUIERDA */}
                    {isDragging && paginaGaleria > 0 && (
                        <div
                            onDragEnter={() => handleEdgeEnter('left')}
                            onDragLeave={handleEdgeLeave}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleEdgeLeave}
                            className="absolute left-0 top-0 bottom-0 w-12 z-20 flex items-center justify-center bg-gradient-to-r from-orange-500/30 to-transparent border-l-2 border-orange-500 rounded-l-2xl"
                        >
                            <ChevronLeft className="w-8 h-8 text-orange-500 animate-pulse" />
                        </div>
                    )}

                    {/* 🔥 ZONA LATERAL DERECHA */}
                    {isDragging && paginaGaleria < totalPaginas - 1 && (
                        <div
                            onDragEnter={() => handleEdgeEnter('right')}
                            onDragLeave={handleEdgeLeave}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleEdgeLeave}
                            className="absolute right-0 top-0 bottom-0 w-12 z-20 flex items-center justify-center bg-gradient-to-l from-orange-500/30 to-transparent border-r-2 border-orange-500 rounded-r-2xl"
                        >
                            <ChevronRight className="w-8 h-8 text-orange-500 animate-pulse" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[150px] sm:auto-rows-[180px]">
                        {fotosMostradas.map((foto: any, indexLocal: number) => {
                            const realIndex = (paginaGaleria * FOTOS_POR_PAGINA) + indexLocal;
                            const isMainImage = indexLocal === 0;

                            return (
                                <div
                                    key={foto.public_id}
                                    draggable={editandoInfo}
                                    onDragStart={(e) => handleDragStart(e, realIndex)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, realIndex)}
                                    className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950 transition-all ${isMainImage ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'} ${editandoInfo ? 'cursor-grab active:cursor-grabbing hover:ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900' : ''}`}
                                >
                                    <img src={foto.url} alt="Trabajo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none" />
                                    {editandoInfo && (
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                            <Grip className="w-8 h-8 text-white/50" />
                                            <button
                                                onClick={() => {
                                                    handleEliminarImagen(foto.public_id);
                                                    if (paginaGaleria > 0 && portafolio.galeria.length - 1 <= paginaGaleria * FOTOS_POR_PAGINA) {
                                                        setPaginaGaleria(p => p - 1);
                                                    }
                                                }}
                                                className="absolute bottom-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg"
                                                title="Eliminar foto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button onClick={handlePrevPage} disabled={paginaGaleria === 0} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 transition-all">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: totalPaginas }).map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${paginaGaleria === i ? 'bg-orange-500 w-6' : 'bg-zinc-700'}`} />
                                ))}
                            </div>
                            <button onClick={handleNextPage} disabled={paginaGaleria === totalPaginas - 1} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 transition-all">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-black/30 rounded-2xl border border-white/5 border-dashed h-full">
                    <Camera className="w-12 h-12 text-zinc-700 mb-4" />
                    <h4 className="text-white font-bold mb-1">Tu galería está vacía</h4>
                    <p className="text-zinc-500 text-sm text-center max-w-sm">Subí fotos para armar tu slider collage.</p>
                </div>
            )}
        </div>
    );
}