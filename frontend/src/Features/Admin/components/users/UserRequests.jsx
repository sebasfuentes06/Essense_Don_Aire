import { useEffect, useState } from "react";
import { Check, Mail, Phone, X } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { fechaHora } from "../../../../shared/negocio";

/** Solicitudes de registro esperando aprobación. */
function UserRequests({ requests, onApprove, onReject }) {
  if (requests.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">No hay solicitudes pendientes</p>
          <p className="mt-1 text-sm text-muted-foreground">Cuando alguien se registre en la web o en la app, aparecerá aquí para que la apruebes.</p>
        </div>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {requests.map((u) => (
        <Card key={u.id} className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {(u.name ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{u.name}</p>
              <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {u.email}
              </p>
              {u.phone && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {u.phone}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Solicitó el {fechaHora(u.joinDate)}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" className="text-destructive" onClick={() => onReject(u)}>
              <X /> Rechazar
            </Button>
            <Button size="sm" onClick={() => onApprove(u)}>
              <Check /> Aprobar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Aprobar: se elige el rol (por defecto Cliente, que es quien se registra). */
function ApproveUserModal({ user, roles, onConfirm, onClose }) {
  const [rol, setRol] = useState("Cliente");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  useEffect(() => {
    setRol("Cliente");
    setError("");
  }, [user]);
  if (!user) return null;

  const aprobar = async () => {
    setEnviando(true);
    setError("");
    try {
      await onConfirm(rol);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="sm" title="Aprobar cuenta">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <b className="text-foreground">{user.name}</b> ({user.email}) podrá entrar con el rol que elijas.
        </p>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRol(r)}
              aria-pressed={rol === r}
              className={`rounded-full border px-4 py-1.5 text-sm ${rol === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}
            >
              {r}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={aprobar} disabled={enviando}>
            {enviando ? "Aprobando…" : "Aprobar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { UserRequests, ApproveUserModal };
