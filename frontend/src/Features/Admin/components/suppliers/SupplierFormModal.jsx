import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateSupplierForm } from "../../validations/formValidation";

/**
 * Formulario de un proveedor.
 *
 * Los errores llegan de dos lados y los dos se muestran:
 *  - `validateSupplierForm` revisa lo obvio sin ir al servidor (campos vacíos,
 *    formato del correo) para responder mientras se escribe;
 *  - `serverFieldErrors` trae lo que solo la base puede saber, como que ya
 *    existe otro proveedor con ese nombre.
 *
 * La validación del navegador es comodidad; la que de verdad protege los
 * datos es la de la API, porque a la API se le puede pegar desde Postman sin
 * pasar nunca por esta pantalla.
 */
function SupplierFormModal({
  isOpen,
  onClose,
  isEditing,
  supplierForm,
  onFormChange,
  serverError = "",
  serverFieldErrors = {},
  onSave
}) {
  const [validationOpen, setValidationOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const nombre = supplierForm.nombre ?? supplierForm.name ?? "";
  const contacto = supplierForm.contacto ?? supplierForm.contact ?? "";
  const email = supplierForm.email ?? "";
  const telefono = supplierForm.telefono ?? supplierForm.phone ?? "";
  const ciudad = supplierForm.ciudad ?? supplierForm.city ?? "";
  const calificacion = supplierForm.calificacion ?? "";
  const resenas = supplierForm.resenas ?? "";

  const estadoValue = supplierForm.estado ?? supplierForm.status ?? true;
  const estadoSelect =
    estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";

  const locales = validateSupplierForm({ nombre, contacto, email, telefono, ciudad });
  const errors = { ...locales, ...(serverFieldErrors ?? {}) };
  const validate = () => Object.values(locales)[0] || "";

  const cambiar = (cambios) => onFormChange({ ...supplierForm, ...cambios });

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
        title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
      >
        <div className="space-y-6">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nombre del proveedor"
            value={nombre}
            required
            error={errors.nombre}
            onChange={(e) => cambiar({ nombre: e.target.value, name: e.target.value })}
            placeholder="Razón social del proveedor"
          />

          <Input
            label="Contacto"
            value={contacto}
            required
            error={errors.contacto}
            onChange={(e) => cambiar({ contacto: e.target.value, contact: e.target.value })}
            placeholder="Persona con quien se habla"
          />

          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            error={errors.email}
            onChange={(e) => cambiar({ email: e.target.value })}
            placeholder="contacto@proveedor.com"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Teléfono"
              value={telefono}
              error={errors.telefono}
              onChange={(e) => cambiar({ telefono: e.target.value, phone: e.target.value })}
              placeholder="+57 604 123 4567"
            />

            <Input
              label="Ciudad"
              value={ciudad}
              required
              error={errors.ciudad}
              onChange={(e) => cambiar({ ciudad: e.target.value, city: e.target.value })}
              placeholder="Medellín"
            />
          </div>

          {/*
            Calificación y reseñas se escriben a mano porque todavía no hay
            un módulo que las calcule a partir de evaluaciones reales. Sin
            este par de campos la tarjeta "Calificación Promedio" se quedaría
            en cero para siempre, ya que la tabla arranca todo en 0.
          */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Calificación (0 a 5)"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={calificacion}
              error={errors.calificacion}
              onChange={(e) => cambiar({ calificacion: e.target.value })}
              placeholder="4.5"
            />

            <Input
              label="Cantidad de reseñas"
              type="number"
              min="0"
              step="1"
              value={resenas}
              error={errors.resenas}
              onChange={(e) => cambiar({ resenas: e.target.value })}
              placeholder="0"
            />
          </div>

          <Select
            label="Estado"
            value={estadoSelect}
            required
            onChange={(e) =>
              cambiar({ estado: e.target.value === "active", status: e.target.value })
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

export { SupplierFormModal };
