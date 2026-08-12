import { Sparkles } from 'lucide-react';

const FOOTER_LINKS = ['Privacidad', 'Términos', 'Soporte'];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="font-bold tracking-widest uppercase text-sm text-white">Essence Don Aire</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 Essence Don Aire. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {FOOTER_LINKS.map(item => (
              <a key={item} href="#" className="text-white/40 hover:text-[#C9A227] text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
