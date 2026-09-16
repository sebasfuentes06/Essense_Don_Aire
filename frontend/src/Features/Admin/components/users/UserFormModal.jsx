import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateUserForm } from "../../validations/formValidation";

function UserFormModal({
  isOpen,
  onClose,
  isEditing,
  userForm,
  onUserFormChange,
  roles = [],
  serverError = "",
  serverFieldErrors = {},
  onSave
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const nombre = userForm.nombre ?? userForm.name ?? "";
  const correo = userForm.correo ?? userForm.email ?? "";
  const contrasena = userForm.contrasena ?? userForm.password ?? "";
  const telefono = userForm.telefono ?? userForm.phone ?? "";
  const rolValue = String(userForm.id_rol ?? userForm.role ?? "");
  const estadoValue = userForm.estado ?? userForm.status ?? true;
  const estadoSelect =
    estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";

  const datos = { nombre, correo, contrasena, telefono, id_rol: rolValue, isEditing };
  // Se juntan los errores del navegador con los que devolvió el servidor:
  // el servidor es el que manda, porque valida contra la base de datos.
  const errors = { ...validateUserForm(datos), ...(serverFieldErrors ?? {}) };
  const validate = () => Object.values(validateUserForm(datos))[0] || "";

  const opcionesRol = roles
    .filter((rol) => rol !== "Todos")
    .map((rol) => ({ value: String(rol.id ?? rol), label: rol.name ?? rol }));

  const guardar = async () => {
    const error = validate();
    if (error) {
      setValidationOpen(true);
      return;
    }
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <div className="space-y-6">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nombre completo"
            value={nombre}
            required
            error={errors.nombre}
            onChange={(e) =>
              onUserFormChange({ ...userForm, nombre: e.target.value, name: e.target.value })
            }
            placeholder="Nombre completo"
          />

          <Input
            label="Correo electrónico"
            value={correo}
            required
            error={errors.correo}
            onChange={(e) =>
              onUserFormChange({ ...userForm, correo: e.target.value, email: e.target.value })
            }
            placeholder="correo@ejemplo.com"
          />

          <div className="relative">
            <Input
              label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              type={showPassword ? "text" : "password"}
              required={!isEditing}
              error={errors.contrasena}
              value={contrasena}
              onChange={(e) =>
                onUserFormChange({ ...userForm, contrasena: e.target.value, password: e.target.value })
              }
              placeholder={isEditing ? "Dejar vacío para conservarla" : "Mínimo 8 caracteres"}
              className="pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-[calc(50%+0.5rem)] -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Input
            label="Teléfono"
            value={telefono}
            error={errors.telefono}
            onChange={(e) =>
              onUserFormChange({ ...userForm, telefono: e.target.value, phone: e.target.value })
            }
            placeholder="Teléfono"
          />

          <Select
            label="Rol"
            value={rolValue}
            required
            error={errors.id_rol}
            onChange={(e) =>
              onUserFormChange({ ...userForm, id_rol: Number(e.target.value), role: e.target.value })
            }
            options={opcionesRol}
          />

          <Select
            label="Estado"
            value={estadoSelect}
            required
            onChange={(e) =>
              onUserFormChange({
                ...userForm,
                estado: e.target.value === "active",
                status: e.target.value
              })
            }
            options={[
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" }
            ]}
          />

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="button" onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>

      <FormValidationDialog
        isOpen={validationOpen}
        onClose={() => setValidationOpen(false)}
        message={validate()}
      />
    </div>
  );
}

export { UserFormModal };
