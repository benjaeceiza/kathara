import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    tema: 'light' | 'dark';
    toggleTema: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            tema: 'dark', // Arranca en oscuro
            toggleTema: () => set((state) => {
                const nuevoTema = state.tema === 'light' ? 'dark' : 'light';
                
                // 🔥 Magia pura: Cambiamos el HTML desde el estado global directamente
                if (nuevoTema === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                
                return { tema: nuevoTema };
            }),
        }),
        {
            name: 'kathara-theme',
        }
    )
);

// 🔥 INICIALIZADOR GLOBAL
// Apenas carga tu web (antes de que React dibuje las pantallas), lee la memoria y aplica el tema.
const temaInicial = useThemeStore.getState().tema;
if (temaInicial === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}