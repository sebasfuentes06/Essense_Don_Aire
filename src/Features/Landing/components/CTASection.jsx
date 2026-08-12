import { Sparkles, ArrowRight } from 'lucide-react';

export function CTASection({ onLogin }) {
  return (
    <section className="py-20 bg-[#C9A227]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Sparkles className="h-12 w-12 text-black mx-auto mb-4" />
        <h2 className="text-4xl font-serif text-black mb-4">¿Listo para administrar tu tienda?</h2>
        <p className="text-black/60 mb-8">Accede al panel de administración y gestiona todos tus productos, ventas y clientes.</p>
        <button onClick={onLogin}
          className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition-all">
          Acceder al Sistema <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
