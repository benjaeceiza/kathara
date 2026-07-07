
import { MapPin, Clock, Phone, Share2, Heart } from 'lucide-react';
import logo from "../assets/logo.png";

 const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-12 text-zinc-400 font-sans mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
        
        {/* Columna 1: Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center  shadow-lg shadow-white/5 shrink-0">
              <img src={logo} alt="Logo Kathara" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white uppercase block leading-none">Kathara</span>
              <span className="text-[9px] text-orange-400 font-bold tracking-widest uppercase">Barber Studio</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Cuidado personal elevado al máximo nivel. Cortes de autor, rituales de barba tradicionales y un ambiente diseñado para tu desconexión.
          </p>
        </div>

        {/* Columna 2: Horarios */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Horarios de Atención</span>
          </h4>
          <ul className="text-xs space-y-2 text-zinc-400">
            <li className="flex justify-between font-medium">
              <span>Martes a Sábados:</span>
              <span className="text-white font-bold">10:00 - 20:30 hs</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>Lunes & Domingos:</span>
              <span className="text-orange-400/80 font-bold">Cerrado</span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Ubicación & Contacto */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>El Salón</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Villa Mercedes, San Luis, Argentina. <br />
            <span className="text-zinc-500">Estacionamiento exclusivo para clientes del club.</span>
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-bold text-white">+54 9 2657 00-0000</span>
          </div>
        </div>

        {/* Columna 4: Redes & Comunidad */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">
            Comunidad Kathara
          </h4>
          <p className="text-xs text-zinc-400">Seguinos para ver los últimos cortes, tendencias y beneficios del club VIP.</p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-orange-500 hover:text-orange-400 text-white transition-all">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-orange-500 hover:text-orange-400 text-white transition-all">
              <span className="font-black text-xs px-1">IG</span>
            </a>
          </div>
        </div>

      </div>

      {/* Copyright inferior */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <p>© 2026 Kathara Barber Studio. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1">
          <span>Desarrollado con</span>
          <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>para excelencia en cortes.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;