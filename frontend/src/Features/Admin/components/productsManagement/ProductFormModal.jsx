import { useEffect, useState } from "react";
import { Flower2, ImagePlus, Search, Trash2 } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { BuscadorImagenes, leerImagen } from "../../../../shared/negocio";
import { validateProductForm } from "../../validations/formValidation";

/**
 * Crear o editar un producto. La foto se elige del computador o se busca en
 * internet (Wikimedia Commons), igual que en la app; se sube al guardar.
 */
function ProductFormModal({ isOpen, onClose, isEditing, productForm, onProductFormChange, categories, suppliers, onSave, error }) {
  const [validationOpen, setValidationOpen] = useState(false);
  const [buscadorOpen, setBuscadorOpen] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");
  const [guardando, setGuardando] = useState(false);

  const f = productForm;
  const set = (cambios) => onProductFormChange({ ...f, ...cambios });
  const estadoSelect = f.estado === true || f.estado === "true" || f.estado === "active" ? "active" : "inactive";
  const datos = {
    nombre: f.nombre ?? "",
    sku: f.sku ?? "",
    categoriaValue: String(f.id_categoria ?? ""),
    proveedorValue: String(f.id_proveedor ?? ""),
    precio: f.precio ?? "",
    stock: f.stock ?? "",
    stockMinimo: f.stock_minimo ?? ""
  };
  const [intentado, setIntentado] = useState(false);
  useEffect(() => {
    if (isOpen) setIntentado(false);
  }, [isOpen]);
  const todos = validateProductForm(datos);
  // Los errores se muestran después del primer intento de guardar, no al abrir.
  const errors = intentado ? todos : {};
  const primerError = Object.values(todos)[0] || "";
  const vista = f.imagenNueva?.vista ?? (f.quitarImagen ? null : f.imagenActual);

  const elegirArchivo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErrorFoto("");
    try {
      set({ imagenNueva: await leerImagen(file), quitarImagen: false });
    } catch (err) {
      setErrorFoto(err.message);
    }
  };

  const guardar = async () => {
    setIntentado(true);
    if (primerError) return setValidationOpen(true);
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  const soloDigitos = (v) => v.replace(/\D/g, "");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEditing ? "Editar producto" : "Nuevo producto"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Categoría"
              required
              value={datos.categoriaValue}
              error={errors.id_categoria}
              onChange={(e) => set({ id_categoria: e.target.value })}
              options={[{ value: "", label: "Seleccionar" }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]}
            />
            <Input label="Nombre del producto" required value={datos.nombre} error={errors.nombre} onChange={(e) => set({ nombre: e.target.value })} maxLength={100} />
            <Input label="Código (SKU)" required value={datos.sku} error={errors.sku} onChange={(e) => set({ sku: e.target.value.toUpperCase() })} maxLength={30} placeholder="FLO-ROS-001" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Select
                label="Proveedor"
                required
                value={datos.proveedorValue}
                error={errors.id_proveedor}
                onChange={(e) => set({ id_proveedor: e.target.value })}
                options={[{ value: "", label: "Seleccionar" }, ...suppliers.map((s) => ({ value: String(s.id), label: s.name }))]}
              />
            </div>
            <Input label="Precio (COP)" required inputMode="numeric" value={datos.precio} error={errors.precio} onChange={(e) => set({ precio: soloDigitos(e.target.value) })} />
            <Input label="Stock mínimo" inputMode="numeric" value={datos.stockMinimo} error={errors.stock_minimo} onChange={(e) => set({ stock_minimo: soloDigitos(e.target.value) })} />
            <Input label="Stock actual" inputMode="numeric" value={datos.stock} error={errors.stock} onChange={(e) => set({ stock: soloDigitos(e.target.value) })} />
          </div>

          <label className="block text-sm font-medium text-foreground">
            Descripción
            <textarea
              value={f.descripcion ?? ""}
              onChange={(e) => set({ descripcion: e.target.value })}
              maxLength={250}
              rows={2}
              placeholder="Notas de salida, corazón y fondo; ocasión de uso..."
              className="mt-2 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Imagen</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                {vista ? <img src={vista} alt="Foto del producto" className="h-full w-full object-cover" /> : <Flower2 className="h-8 w-8 text-primary/40" />}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted">
                  <ImagePlus className="h-4 w-4" /> Subir foto
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={elegirArchivo} />
                </label>
                <Button type="button" variant="outline" size="sm" onClick={() => setBuscadorOpen(true)}>
                  <Search /> Buscar en internet
                </Button>
                {vista && (
                  <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => set({ imagenNueva: null, quitarImagen: Boolean(f.imagenActual) })}>
                    <Trash2 /> Quitar
                  </Button>
                )}
              </div>
              {f.imagenNueva && <p className="w-full text-xs text-muted-foreground">La foto nueva se guarda al presionar Guardar.</p>}
              {errorFoto && <p className="w-full text-xs text-destructive">{errorFoto}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Estado"
              value={estadoSelect}
              onChange={(e) => set({ estado: e.target.value === "active" })}
              options={[
                { value: "active", label: "Activo" },
                { value: "inactive", label: "Inactivo" }
              ]}
            />
          </div>

          {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</div>}
        </div>
        <div className="mt-5 flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={guardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Modal>

      <BuscadorImagenes
        isOpen={buscadorOpen}
        busquedaInicial={datos.nombre ? `${datos.nombre} perfume` : "perfume bottle"}
        onElegir={(img) => set({ imagenNueva: img, quitarImagen: false })}
        onClose={() => setBuscadorOpen(false)}
      />

      <FormValidationDialog isOpen={validationOpen} onClose={() => setValidationOpen(false)} message={primerError} />
    </>
  );
}

export { ProductFormModal };
