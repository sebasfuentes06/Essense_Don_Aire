import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/button";
import { buscarImagenes, descargarImagen } from "./imagen";

/** Buscar una foto en internet (Wikimedia Commons) para el producto. */
function BuscadorImagenes({ isOpen, busquedaInicial = "", onElegir, onClose }) {
  const [texto, setTexto] = useState(busquedaInicial);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [bajando, setBajando] = useState(null);
  const solicitud = useRef(0);

  const buscar = async (q = texto) => {
    if (!q.trim()) return;
    const n = ++solicitud.current;
    setCargando(true);
    setError("");
    try {
      const r = await buscarImagenes(q.trim());
      if (n === solicitud.current) setResultados(r);
    } catch (e) {
      if (n === solicitud.current) setError(e.message || "No se pudo buscar.");
    } finally {
      if (n === solicitud.current) setCargando(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setTexto(busquedaInicial);
    setResultados(null);
    buscar(busquedaInicial || "perfume bottle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const elegir = async (img) => {
    setBajando(img.miniatura);
    setError("");
    try {
      onElegir({ ...(await descargarImagen(img.miniatura)), origen: img.pagina });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBajando(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Buscar foto en internet">
      <form
        className="mb-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          buscar();
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej. perfume bottle, rose perfume, cologne"
          className="h-10 flex-1 rounded-xl border border-input bg-input-background px-3 text-sm"
        />
        <Button type="submit" disabled={cargando}>
          {cargando ? <Loader2 className="animate-spin" /> : <Search />} Buscar
        </Button>
      </form>
      <p className="mb-4 text-xs text-muted-foreground">
        Fotos de Wikimedia Commons (licencia libre). Tip: busca en inglés para ver más resultados.
      </p>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      {cargando && !resultados ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : resultados?.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Sin resultados. Prueba con otras palabras.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(resultados ?? []).map((img) => (
            <button
              key={img.miniatura}
              type="button"
              onClick={() => elegir(img)}
              disabled={Boolean(bajando)}
              title={img.titulo}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img src={img.miniatura} alt={img.titulo} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              {bajando === img.miniatura && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

export { BuscadorImagenes };
