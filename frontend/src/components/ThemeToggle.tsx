
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle = () => {
    const { tema, toggleTema } = useThemeStore();

    return (
        <button 
            onClick={toggleTema}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-zinc-400 hover:text-white hover:bg-white/5 font-medium w-full"
        >
            <div className="shrink-0 transition-colors text-zinc-500 group-hover:text-orange-400">
                {tema === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <span className="text-sm">
                {tema === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
        </button>
    );
};