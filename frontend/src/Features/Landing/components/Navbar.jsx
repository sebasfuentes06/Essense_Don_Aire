import { Menu, X } from 'lucide-react';
import { useMobileMenu } from '../Hooks/useMobileMenu';

const NAV_ITEMS = ['Inicio', 'Catálogo', 'Nosotros', 'Contacto'];

export function Navbar({ onLogin }) {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/essence_don_aire_logo_wordmark.svg"
            alt="Essence Don Aire"
            className="h-10 w-auto rounded-md bg-white px-2 py-1"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-white/70 hover:text-[#C9A227] transition-colors text-sm tracking-wide">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onLogin}
            className="px-5 py-2 border border-[#C9A227] text-[#C9A227] rounded-lg text-sm hover:bg-[#C9A227] hover:text-black transition-all">
            Iniciar Sesión
          </button>
        </div>

        <button className="md:hidden text-white" onClick={toggle}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 space-y-4">
          {NAV_ITEMS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={close}
              className="block text-white/70 hover:text-[#C9A227] transition-colors py-2">{item}</a>
          ))}
          <button onClick={onLogin}
            className="w-full py-2 bg-[#C9A227] text-black rounded-lg font-semibold">
            Iniciar Sesión
          </button>
        </div>
      )}
    </nav>
  );
}
