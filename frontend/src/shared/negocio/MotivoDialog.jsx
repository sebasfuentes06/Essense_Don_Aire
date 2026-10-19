import { useEffect, useState } from "react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/button";

/** Pide un texto obligatorio (motivo de cancelar, anular o rechazar). */
function MotivoDialog({ isOpen, title, description, label = "Motivo", confirmText = "Confirmar", danger = true, onConfirm, onClose }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTexto("");
      setError("");
    }
  }, [isOpen]);

  const enviar = async (e) => {
    e.preventDefault();
    if (texto.trim().length < 3) return setError("Escribe el motivo (mínimo 3 letras).");
    setEnviando(true);
    try {
      await onConfirm(texto.trim());
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <form className="space-y-4" onSubmit={enviar}>
        {description && <p className="text-sm text-muted-foreground whitespace-pre-line">{description}</p>}
        <label className="block text-sm font-medium text-foreground">
          {label}
          <textarea
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={250}
            rows={3}
            className="mt-1 w-full rounded-xl border border-input bg-input-background p-3 text-sm"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Volver
          </Button>
          <Button type="submit" variant={danger ? "destructive" : "default"} disabled={enviando}>
            {enviando ? "Guardando..." : confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { MotivoDialog };
