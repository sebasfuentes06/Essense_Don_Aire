import { useState } from "react";
import { Upload, X } from "lucide-react";
import { leerImagen } from "./imagen";

/** Botón para adjuntar la foto del comprobante, con vista previa. */
function CampoComprobante({ valor, onCambio, obligatorio = false }) {
  const [error, setError] = useState("");
  const elegir = async (e) => {
    setError("");
    try {
      onCambio(await leerImagen(e.target.files?.[0]));
    } catch (err) {
      setError(err.message);
    }
    e.target.value = "";
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 p-3 hover:bg-primary/5">
          {valor ? (
            <img src={valor.vista} alt="Comprobante" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <Upload className="h-6 w-6 text-primary" />
          )}
          <span className="text-sm">
            {valor ? "Comprobante adjunto · clic para cambiarlo" : `Adjuntar comprobante${obligatorio ? " (obligatorio)" : " (opcional)"}`}
            <span className="block text-xs text-muted-foreground">Foto o captura (JPG, PNG o WEBP)</span>
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={elegir} />
        </label>
        {valor && (
          <button type="button" className="rounded-lg p-2 hover:bg-muted" onClick={() => onCambio(null)} aria-label="Quitar comprobante">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { CampoComprobante };
