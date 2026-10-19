import { Input } from "../components/ui/input";
import { Select } from "../components/ui/Select";
import { TIPOS_DOCUMENTO } from "./persona";
import { CamposUbicacion } from "./CamposUbicacion";

/**
 * Campos de una persona en el orden que pide la ficha del proyecto:
 * nombre*, tipo de documento*, documento*, celular* (solo números),
 * departamento (Antioquia por defecto) y ciudad* (API Colombia), dirección y correo.
 *
 * Lo usan el registro y el formulario de clientes (igual que la app móvil).
 */
function CamposPersona({ valor, onCambio, errores = {}, correoObligatorio = false }) {
  const set = (campo) => (e) => onCambio({ ...valor, [campo]: e.target.value });
  const soloNumeros = ["CC", "TI", "NIT", ""].includes(valor.documentType);

  return (
    <div className="space-y-4">
      <Input
        label="Nombre completo"
        name="fullName"
        required
        value={valor.fullName}
        onChange={set("fullName")}
        error={errores.fullName}
        placeholder="Ej. Laura Gómez Restrepo"
        autoComplete="name"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Tipo de documento"
          name="documentType"
          required
          value={valor.documentType}
          onChange={set("documentType")}
          error={errores.documentType}
          options={[{ value: "", label: "Selecciona..." }, ...TIPOS_DOCUMENTO]}
        />
        <Input
          label="Número de documento"
          name="document"
          required
          value={valor.document}
          inputMode={soloNumeros ? "numeric" : "text"}
          onChange={(e) =>
            onCambio({
              ...valor,
              document: (soloNumeros && valor.documentType !== "NIT" ? e.target.value.replace(/\D/g, "") : e.target.value).slice(0, 15)
            })
          }
          error={errores.document}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Celular"
          name="phone"
          required
          value={valor.phone}
          inputMode="numeric"
          // Solo números: se descarta cualquier otro carácter al escribir o pegar.
          onChange={(e) => onCambio({ ...valor, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          error={errores.phone}
          placeholder="3001234567"
          autoComplete="tel"
        />
        <Input
          label={correoObligatorio ? "Correo" : "Correo (opcional)"}
          name="email"
          type="email"
          required={correoObligatorio}
          value={valor.email}
          onChange={set("email")}
          error={errores.email}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
        />
      </div>
      <CamposUbicacion
        departamento={valor.department || "Antioquia"}
        ciudad={valor.city}
        errores={{ departamento: errores.department, ciudad: errores.city }}
        onCambio={({ departamento, ciudad }) => onCambio({ ...valor, department: departamento, city: ciudad })}
      />
      <Input
        label="Dirección de residencia"
        name="address"
        value={valor.address}
        onChange={set("address")}
        error={errores.address}
        placeholder="Calle 10 # 43-20"
        autoComplete="street-address"
      />

    </div>
  );
}

export { CamposPersona };
