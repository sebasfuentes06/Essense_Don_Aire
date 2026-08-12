/**
 * Encabezado reutilizado por varias secciones:
 * línea dorada + eyebrow + título serif + subtítulo opcional.
 */
export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px w-12 bg-[#C9A227]" />
        <span className="text-[#C9A227] text-sm tracking-widest uppercase">{eyebrow}</span>
        <div className="h-px w-12 bg-[#C9A227]" />
      </div>
      <h2 className="text-4xl font-serif text-white mb-4">{title}</h2>
      {subtitle && <p className="text-white/50 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
