import { Phone, Mail, MapPin } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const CONTACT_INFO = [
  { icon: Phone, title: 'Teléfono', info: '+52 555 1234 5678' },
  { icon: Mail, title: 'Email', info: 'contacto@essencedonaire.com' },
  { icon: MapPin, title: 'Dirección', info: 'Av. Reforma 456, Ciudad de México' },
];

export function Contact() {
  return (
    <section id="contacto" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Contacto" title="Estamos para servirte" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {CONTACT_INFO.map(({ icon: Icon, title, info }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-white font-semibold">{title}</p>
                  <p className="text-white/50">{info}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Nombre</label>
                  <input type="text" placeholder="Tu nombre"
                    className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-all" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Email</label>
                  <input type="email" placeholder="tu@email.com"
                    className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Mensaje</label>
                <textarea rows={4} placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-all resize-none" />
              </div>
              <button className="w-full py-3 bg-[#C9A227] text-black rounded-xl font-bold hover:bg-[#b8911f] transition-all">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
