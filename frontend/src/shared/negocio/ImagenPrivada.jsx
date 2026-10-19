import { useEffect, useState } from "react";
import { urlImagenPrivada } from "./imagen";

/** Muestra una imagen privada de la API (comprobante de pago o de pedido). */
function ImagenPrivada({ ruta, version = 0, alt = "Comprobante", className = "" }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let vivo = true;
    let actual = null;
    setUrl(null);
    setError("");
    urlImagenPrivada(ruta)
      .then((u) => {
        actual = u;
        if (vivo) setUrl(u);
        else URL.revokeObjectURL(u);
      })
      .catch((e) => vivo && setError(e.message));
    return () => {
      vivo = false;
      if (actual) URL.revokeObjectURL(actual);
    };
  }, [ruta, version]);

  if (error) return <p className="text-sm text-muted-foreground">{error}</p>;
  if (!url) return <div className={`animate-pulse rounded-xl bg-muted ${className || "h-48"}`} />;
  return (
    <a href={url} target="_blank" rel="noreferrer" title="Abrir en grande">
      <img src={url} alt={alt} className={`rounded-xl border border-border object-contain ${className || "max-h-80"}`} />
    </a>
  );
}

export { ImagenPrivada };
