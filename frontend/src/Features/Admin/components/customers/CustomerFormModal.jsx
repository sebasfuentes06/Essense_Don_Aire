import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { CamposPersona, validarPersona } from "../../../../shared/persona";

/** Registrar o editar un cliente con la misma ficha que la app móvil. */
function CustomerFormModal({ isOpen, onClose, isEditing, form, onFormChange, serverErrors = {}, serverError = "", onSave }) {
  const [intentado, setIntentado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const locales = validarPersona(form);
  const errores = { ...(intentado ? locales : {}), ...serverErrors };

  const guardar = async () => {
    setIntentado(true);
    if (Object.keys(locales).length) return;
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  const cerrar = () => {
    setIntentado(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={cerrar} size="lg" title={isEditing ? "Editar cliente" : "Nuevo cliente"}>
      <div className="space-y-5">
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
        <CamposPersona valor={form} onCambio={onFormChange} errores={errores} />
        <label className="block text-sm font-medium text-foreground">
          Notas (opcional)
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
            maxLength={250}
            rows={2}
            placeholder="Ej. prefiere fragancias florales, entregar en la tarde"
            className="mt-2 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm"
          />
        </label>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => onFormChange({ ...form, active: e.target.checked })} className="h-4 w-4 accent-primary" />
            Cliente activo
          </label>
        )}
        <div className="flex justify-end gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={cerrar} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="button" onClick={guardar} disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { CustomerFormModal };
