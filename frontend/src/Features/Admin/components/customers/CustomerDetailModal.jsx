import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, IdCard } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { clientes, dinero, fecha, NOMBRES_METODO, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";

const ESTADO_PAGO = { pendiente: ["Pendiente", "danger"], parcial: ["Abonada", "warning"], pagada: ["Pagada", "success"] };

/** Ficha del cliente con su estado de cuenta e historial (mismos datos que la app). */
function CustomerDetailModal({ customer, onClose }) {
  const [cuenta, setCuenta] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("cuenta");

  useEffect(() => {
    if (!customer) return;
    setCuenta(null);
    setHistorial(null);
    setError("");
    setTab("cuenta");
    Promise.all([clientes.estadoCuenta(customer.id), clientes.historial(customer.id)])
      .then(([c, h]) => {
        setCuenta(c);
        setHistorial(h);
      })
      .catch((e) => setError(e.message));
  }, [customer]);

  if (!customer) return null;
  const c = customer;
  const r = cuenta?.resumen;

  return (
    <Modal isOpen onClose={onClose} size="lg" title={c.name}>
      <div className="space-y-5">
        <div className="grid gap-2 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2"><IdCard className="h-4 w-4 text-muted-foreground" />{c.document ? `${c.documentType} ${c.document}` : "Sin documento"}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{c.phone || "Sin celular"}</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{c.email || "Sin correo"}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{[c.address, c.city].filter(Boolean).join(", ") || "Sin dirección"}</p>
          {c.notes && <p className="text-muted-foreground sm:col-span-2">Notas: {c.notes}</p>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {!cuenta && !error && <div className="h-24 animate-pulse rounded-xl bg-muted" />}

        {r && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Facturado</p><p className="font-bold">{dinero(r.total_facturado)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Pagado</p><p className="font-bold text-success">{dinero(r.total_pagado)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Saldo</p><p className={`font-bold ${Number(r.saldo) > 0 ? "text-destructive" : "text-success"}`}>{dinero(r.saldo)}</p></div>
          </div>
        )}

        {cuenta && (
          <>
            <div className="flex gap-2 border-b border-border">
              {[["cuenta", "Compras"], ["pagos", "Pagos"], ["favoritos", "Favoritos"]].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "cuenta" && (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {(historial?.ventas ?? []).length === 0 && <p className="text-sm text-muted-foreground">Aún no tiene compras.</p>}
                {(historial?.ventas ?? []).map((v) => {
                  const [label, variant] = v.estado === "anulada" ? ["Anulada", "default"] : ESTADO_PAGO[v.estado_pago] ?? [v.estado_pago, "default"];
                  return (
                    <div key={v.id_venta} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{v.numero_factura} · {fecha(v.fecha)}</span>
                        <Badge variant={variant}>{label}</Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">{v.productos.map((p) => `${p.cantidad}× ${p.nombre}`).join(", ")}</p>
                      <p className="mt-1">Total {dinero(v.total)}{Number(v.saldo) > 0 && v.estado !== "anulada" && <span className="text-destructive"> · saldo {dinero(v.saldo)}</span>}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {tab === "pagos" && (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {cuenta.pagos.length === 0 && <p className="text-sm text-muted-foreground">Aún no tiene pagos.</p>}
                {cuenta.pagos.map((p) => (
                  <div key={p.id_pago} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                    <div>
                      <p className="font-medium">{dinero(p.monto)} · {NOMBRES_METODO[p.metodo] ?? p.metodo}</p>
                      <p className="text-muted-foreground">{p.numero_factura} · {fecha(p.fecha)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{NOMBRES_ESTADO_PAGO[p.estado] ?? p.estado}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "favoritos" && (
              <div className="space-y-2">
                {(historial?.favoritos ?? []).length === 0 && <p className="text-sm text-muted-foreground">Sin datos todavía.</p>}
                {(historial?.favoritos ?? []).map((f) => (
                  <div key={f.id_producto} className="flex justify-between rounded-xl border border-border p-3 text-sm">
                    <span>{f.nombre}</span>
                    <span className="text-muted-foreground">{f.unidades} und.</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export { CustomerDetailModal };
