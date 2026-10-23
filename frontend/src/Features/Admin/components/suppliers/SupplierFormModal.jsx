import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { CamposUbicacion } from "../../../../shared/persona";
import { emailPattern, phonePattern, isBlank } from "../../validations/formValidation";

/** Tipos de documento según el tipo de persona. */
const DOCUMENTOS = {
  natural: [
    { value: "CC", label: "CC · Cédula de ciudadanía" },
    { value: "CE", label: "CE · Cédula de extranjería" },
    { value: "PPT", label: "PPT · Permiso por protección temporal" },
    { value: "PAS", label: "PAS · Pasaporte" }
  ],
  juridica: [{ value: "NIT", label: "NIT" }]
};

function validar(f) {
  const e = {};
  if (!f.tipo_persona) e.tipo_persona = "Elige el tipo de persona.";
  if (!f.tipo_documento) e.tipo_documento = "Elige el tipo de documento.";
  const doc = String(f.documento ?? "").trim();
  if (!doc) e.documento = "El número de documento es obligatorio.";
  else if (f.tipo_documento === "NIT" && !/^\d{6,12}(-\d)?$/.test(doc)) e.documento = "NIT: solo números y el dígito de verificación (900123456-7).";
  else if (f.tipo_documento === "CC" && !/^\d{5,11}$/.test(doc)) e.documento = "Solo números, entre 5 y 11 dígitos.";
  if (isBlank(f.nombre)) e.nombre = f.tipo_persona === "juridica" ? "La razón social es obligatoria." : "El nombre es obligatorio.";
  if (isBlank(f.contacto)) e.contacto = "El contacto es obligatorio.";
  if (!isBlank(f.email) && !emailPattern.test(String(f.email).trim())) e.email = "El correo no tiene un formato válido.";
  if (!isBlank(f.telefono) && !phonePattern.test(String(f.telefono).trim())) e.telefono = "El teléfono no tiene un formato válido.";
  if (isBlank(f.departamento)) e.departamento = "Elige el departamento.";
  if (isBlank(f.ciudad)) e.ciudad = "Elige la ciudad.";
  return e;
}

/**
 * Formulario de un proveedor: tipo de persona y documento, datos de contacto
 * y ubicación (departamento y ciudad desde API Colombia).
 */
function SupplierFormModal({ isOpen, onClose, isEditing, supplierForm, onFormChange, serverError = "", serverFieldErrors = {}, onSave }) {
  const [intentado, setIntentado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const f = supplierForm;
  const set = (cambios) => onFormChange({ ...f, ...cambios });
  const locales = validar(f);
  const errors = { ...(intentado ? locales : {}), ...(serverFieldErrors ?? {}) };
  const juridica = f.tipo_persona === "juridica";
  const docNumerico = ["CC", "NIT"].includes(f.tipo_documento);

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
    <Modal isOpen={isOpen} onClose={cerrar} size="lg" title={isEditing ? "Editar proveedor" : "Nuevo proveedor"}>
      <div className="space-y-4">
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Tipo de persona"
            required
            value={f.tipo_persona ?? ""}
            error={errors.tipo_persona}
            onChange={(e) => {
              const tipo = e.target.value;
              set({ tipo_persona: tipo, tipo_documento: tipo === "juridica" ? "NIT" : tipo === "natural" ? "CC" : "" });
            }}
            options={[
              { value: "", label: "Selecciona..." },
              { value: "natural", label: "Persona natural" },
              { value: "juridica", label: "Persona jurídica" }
            ]}
          />
          <Select
            label="Tipo de documento"
            required
            value={f.tipo_documento ?? ""}
            disabled={!f.tipo_persona}
            error={errors.tipo_documento}
            onChange={(e) => set({ tipo_documento: e.target.value })}
            options={[{ value: "", label: f.tipo_persona ? "Selecciona..." : "Elige el tipo de persona" }, ...(DOCUMENTOS[f.tipo_persona] ?? [])]}
          />
          <Input
            label="Número de documento"
            required
            value={f.documento ?? ""}
            error={errors.documento}
            inputMode={docNumerico ? "numeric" : "text"}
            placeholder={f.tipo_documento === "NIT" ? "900123456-7" : ""}
            onChange={(e) =>
              set({ documento: (f.tipo_documento === "NIT" ? e.target.value.replace(/[^\d-]/g, "") : docNumerico ? e.target.value.replace(/\D/g, "") : e.target.value).slice(0, 20) })
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={juridica ? "Razón social" : "Nombre del proveedor"}
            required
            value={f.nombre ?? ""}
            error={errors.nombre}
            onChange={(e) => set({ nombre: e.target.value, name: e.target.value })}
            maxLength={100}
          />
          <Input
            label="Persona de contacto"
            required
            value={f.contacto ?? ""}
            error={errors.contacto}
            onChange={(e) => set({ contacto: e.target.value, contact: e.target.value })}
            maxLength={100}
          />
          <Input label="Correo electrónico" type="email" value={f.email ?? ""} error={errors.email} onChange={(e) => set({ email: e.target.value })} placeholder="ventas@proveedor.com" />
          <Input label="Teléfono" value={f.telefono ?? ""} error={errors.telefono} onChange={(e) => set({ telefono: e.target.value, phone: e.target.value })} placeholder="3001234567" />
        </div>

        <CamposUbicacion
          departamento={f.departamento ?? ""}
          ciudad={f.ciudad ?? ""}
          errores={{ departamento: errors.departamento, ciudad: errors.ciudad }}
          onCambio={({ departamento, ciudad }) => set({ departamento, ciudad, city: ciudad })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Estado"
            value={f.estado === false || f.status === "inactive" ? "inactive" : "active"}
            onChange={(e) => set({ estado: e.target.value === "active", status: e.target.value })}
            options={[
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" }
            ]}
          />
        </div>

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

export { SupplierFormModal };
