import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "../api";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

/**
 * Cambio de contraseña de la propia cuenta.
 *
 * Sirve igual para administrador, vendedor y cliente: el backend saca el
 * id del token, así que nadie puede cambiar la contraseña de otra persona
 * desde aquí. Pide la contraseña actual a propósito, para que una sesión
 * olvidada abierta en un equipo compartido no alcance para robar la cuenta.
 */
function ChangePasswordModal({ isOpen, onClose }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [verClaves, setVerClaves] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [listo, setListo] = useState(false);

  // Al abrir, el formulario arranca limpio: si no, quedarían las claves
  // escritas de la vez anterior.
  useEffect(() => {
    if (!isOpen) return;
    setActual("");
    setNueva("");
    setConfirmacion("");
    setVerClaves(false);
    setError("");
    setErrores({});
    setListo(false);
  }, [isOpen]);

  const validar = () => {
    const problemas = {};
    if (!actual) problemas.actual = "Escribe tu contraseña actual.";
    if (!nueva) problemas.nueva = "Escribe la nueva contraseña.";
    else if (nueva.length < 8) problemas.nueva = "Debe tener al menos 8 caracteres.";
    else if (nueva === actual) problemas.nueva = "Debe ser distinta de la actual.";
    if (confirmacion !== nueva) problemas.confirmacion = "Las contraseñas no coinciden.";
    return problemas;
  };

  const guardar = async () => {
    setError("");
    const problemas = validar();
    setErrores(problemas);
    if (Object.keys(problemas).length) return;

    setEnviando(true);
    try {
      await api.patch("/auth/password", { actual, nueva, confirmacion });
      setListo(true);
      setActual("");
      setNueva("");
      setConfirmacion("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo cambiar la contraseña.");
      if (e?.details) setErrores(e.details);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Cambiar contraseña">
      <div className="space-y-5">
        {listo ? (
          <>
            <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Tu contraseña se actualizó. Úsala la próxima vez que inicies sesión.
              </span>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={onClose}>
                Listo
              </Button>
            </div>
          </>
        ) : (
          <>
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Contraseña actual"
              type={verClaves ? "text" : "password"}
              value={actual}
              required
              error={errores.actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="Tu contraseña de ahora"
              autoComplete="current-password"
            />

            <Input
              label="Nueva contraseña"
              type={verClaves ? "text" : "password"}
              value={nueva}
              required
              error={errores.nueva}
              onChange={(e) => setNueva(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />

            <Input
              label="Repite la nueva contraseña"
              type={verClaves ? "text" : "password"}
              value={confirmacion}
              required
              error={errores.confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              placeholder="La misma de arriba"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setVerClaves((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {verClaves ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {verClaves ? "Ocultar contraseñas" : "Mostrar contraseñas"}
            </button>

            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="outline" onClick={onClose} disabled={enviando}>
                Cancelar
              </Button>
              <Button type="button" onClick={guardar} disabled={enviando}>
                {enviando ? "Guardando…" : "Cambiar contraseña"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export { ChangePasswordModal };
