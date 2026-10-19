import { BASE_URL, getToken } from "../api";

/**
 * Convierte una foto elegida en el navegador a { base64, tipo_mime } para la
 * API. Si es grande, la reduce (máx. 1400 px) y la pasa a JPEG: la API acepta
 * hasta 1,5 MB y una foto de celular suele pesar varios MB.
 */
export async function leerImagen(file, { maxLado = 1400, calidad = 0.75 } = {}) {
  if (!file) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG o WEBP.");

  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("No se pudo leer la imagen."));
    r.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("La imagen está dañada."));
    i.src = dataUrl;
  });

  const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
  if (escala === 1 && file.size <= 1.2 * 1024 * 1024) {
    return { base64: String(dataUrl).split(",")[1], tipo_mime: file.type, vista: dataUrl, bytes: file.size };
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  const jpeg = canvas.toDataURL("image/jpeg", calidad);
  const base64 = jpeg.split(",")[1];
  return { base64, tipo_mime: "image/jpeg", vista: jpeg, bytes: Math.round((base64.length * 3) / 4) };
}

/**
 * Descarga una imagen privada de la API (comprobantes): exige el token, así
 * que no sirve un <img src> directo. Devuelve una URL local (blob:).
 */
export async function urlImagenPrivada(ruta) {
  const r = await fetch(`${BASE_URL}${ruta}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!r.ok) throw new Error(r.status === 404 ? "Sin comprobante." : "No se pudo cargar la imagen.");
  return URL.createObjectURL(await r.blob());
}

/**
 * Busca fotos en Wikimedia Commons (licencia libre, sin llave), igual que el
 * buscador de la app móvil. Tip: en inglés salen más resultados.
 */
export async function buscarImagenes(texto) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${texto} filetype:bitmap`,
    gsrlimit: "30",
    prop: "imageinfo",
    iiprop: "url|mime",
    iiurlwidth: "600"
  });
  const r = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!r.ok) throw new Error(`El buscador de imágenes respondió ${r.status}.`);
  const datos = await r.json();
  const paginas = [...(datos?.query?.pages ?? [])].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return paginas
    .map((p) => ({ p, info: p.imageinfo?.[0] }))
    .filter(({ info }) => info?.thumburl && ["image/jpeg", "image/png", "image/webp"].includes(info.mime))
    .map(({ p, info }) => ({
      titulo: String(p.title ?? "").replace(/^File:/, "").replace(/\.\w+$/, ""),
      miniatura: info.thumburl,
      pagina: info.descriptionurl ?? ""
    }));
}

/** Descarga la foto elegida y la deja lista para la API ({ base64, tipo_mime, vista }). */
export async function descargarImagen(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No se pudo descargar la imagen (${r.status}).`);
  const blob = await r.blob();
  const tipo = /^image\/(jpeg|png|webp)$/.test(blob.type) ? blob.type : "image/jpeg";
  return leerImagen(new File([blob], "foto", { type: tipo }));
}
