import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(f, isEditing) {
  const e = {};
  if (f.nombre.trim().length < 3) e.nombre = "Escribe el nombre (mínimo 3 letras).";
  if (!PATRON_CORREO.test(f.correo.trim())) e.correo = "Correo no válido.";
  if (!isEditing && f.contrasena.length < 8) e.contrasena = "Mínimo 8 caracteres.";
  if (isEditing && f.contrasena && f.contrasena.length < 8) e.contrasena = "Mínimo 8 caracteres.";
  if ((f.contrasena || !isEditing) && (f.confirmar ?? "") !== f.contrasena) e.confirmar = "Las contraseñas no coinciden.";
  if (f.rol === "Cliente" && !f.id_cliente) e.id_cliente = "Elige la ficha del cliente.";
  return e;
}

/** Crear o editar una cuenta. Una cuenta Cliente se liga a su ficha de cliente. */
function UserFormModal({ isOpen, onClose, isEditing, isSelf, userForm, onUserFormChange, roles = [], customers = [], serverError = "", serverFieldErrors = {}, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [intentado, setIntentado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const f = userForm;
  const set = (c) => onUserFormChange({ ...f, ...c });
  const locales = validar(f, isEditing);
  const errors = { ...(intentado ? locales : {}), ...(serverFieldErrors ?? {}) };

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
    <Modal isOpen={isOpen} onClose={cerrar} size="lg" title={isEditing ? "Editar usuario" : "Nuevo usuario"}>
      <div className="space-y-5">
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
        <Input label="Nombre completo" required value={f.nombre} error={errors.nombre} onChange={(e) => set({ nombre: e.target.value })} maxLength={100} />
        <Input label="Correo electrónico" required value={f.correo} error={errors.correo} onChange={(e) => set({ correo: e.target.value })} placeholder="correo@ejemplo.com" />
        <div className="relative">
          <Input
            label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
            type={showPassword ? "text" : "password"}
            required={!isEditing}
            value={f.contrasena}
            error={errors.contrasena}
            onChange={(e) => set({ contrasena: e.target.value })}
            placeholder={isEditing ? "Déjala vacía para conservarla" : "Mínimo 8 caracteres"}
            className="pr-11"
          />
          <button
            type="button"
            className="absolute right-3 top-[2.85rem] text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {(!isEditing || f.contrasena) && (
          <Input
            label="Confirmar contraseña"
            type={showPassword ? "text" : "password"}
            required
            value={f.confirmar ?? ""}
            error={errors.confirmar}
            onChange={(e) => set({ confirmar: e.target.value })}
            placeholder="Escríbela otra vez"
          />
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Rol"
            required
            value={f.rol}
            disabled={isSelf}
            error={errors.rol}
            onChange={(e) => set({ rol: e.target.value })}
            options={roles.map((r) => ({ value: r, label: r }))}
          />
          {isEditing && (
            <Select
              label="Estado"
              value={f.estado ? "active" : "inactive"}
              disabled={isSelf}
              onChange={(e) => set({ estado: e.target.value === "active" })}
              options={[
                { value: "active", label: "Activo" },
                { value: "inactive", label: "Inactivo" }
              ]}
            />
          )}
        </div>
        {f.rol === "Cliente" && (
          <Select
            label="Ficha de cliente"
            required
            value={String(f.id_cliente ?? "")}
            error={errors.id_cliente}
            onChange={(e) => set({ id_cliente: e.target.value })}
            options={[
              { value: "", label: "Seleccionar cliente" },
              ...customers.map((c) => ({ value: String(c.id), label: c.document ? `${c.name} · ${c.document}` : c.name }))
            ]}
          />
        )}
        {isSelf && <p className="text-xs text-muted-foreground">No puedes cambiar tu propio rol ni desactivarte.</p>}
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

export { UserFormModal };
