import { Mail, Phone, MapPin, Star } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

/**
 * Ficha de solo lectura de un proveedor.
 *
 * Existe porque antes el botón del ojo abría el mismo formulario de edición:
 * quien solo tenía `suppliers.view` veía campos editables y un botón Guardar
 * que el servidor iba a rechazar con un 403. Aquí no hay nada que escribir.
 *
 * Además muestra las tres cifras que el formulario no tiene porque no se
 * escriben: cuántas compras se le han hecho, cuánto se le ha comprado y
 * cuántos productos suyos hay en catálogo. Las calcula la base al momento.
 */

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function Dato({ etiqueta, children }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{etiqueta}</p>
      <p className="mt-2 font-medium text-foreground">{children}</p>
    </div>
  );
}

function SupplierDetailModal({ isOpen, onClose, supplier }) {
  if (!supplier) return null;

  const activo = supplier.status === "active";
  const productos = supplier.totalProducts ?? 0;
  const ordenes = supplier.totalOrders ?? 0;
  const comprado = Number(supplier.totalSpent ?? 0);
  const calificacion = Number(supplier.rating ?? 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Detalles del proveedor">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Proveedor
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{supplier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {supplier.contact || "Sin contacto registrado"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  activo ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <Badge variant={activo ? "success" : "danger"}>
                {activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Órdenes de compra
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{ordenes}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Total comprado
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">{moneda.format(comprado)}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Productos en catálogo
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{productos}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Dato etiqueta="ID">{supplier.id}</Dato>

          <Dato etiqueta="Correo">
            <span className="flex items-center gap-2 break-all">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              {supplier.email || "No registrado"}
            </span>
          </Dato>

          <Dato etiqueta="Teléfono">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              {supplier.phone || "No registrado"}
            </span>
          </Dato>

          <Dato etiqueta="Ciudad">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              {supplier.city || "No registrada"}
            </span>
          </Dato>

          <Dato etiqueta="Calificación">
            {supplier.reviews > 0 ? (
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {calificacion.toFixed(1)} de 5
              </span>
            ) : (
              "Sin calificar"
            )}
          </Dato>

          <Dato etiqueta="Reseñas">{supplier.reviews ?? 0}</Dato>

          <Dato etiqueta="Proveedor desde">
            {supplier.since ? new Date(supplier.since).toLocaleDateString("es-CO") : "No disponible"}
          </Dato>

          <Dato etiqueta="Estado">{activo ? "Activo" : "Inactivo"}</Dato>
        </div>

        {!activo && (
          <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Un proveedor inactivo no debería aparecer como opción al registrar compras nuevas.
            Sus productos y su historial siguen intactos.
          </div>
        )}
      </div>
    </Modal>
  );
}

export { SupplierDetailModal };
