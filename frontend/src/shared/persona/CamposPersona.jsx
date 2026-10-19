import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/Select";
import { TIPOS_DOCUMENTO, cargarMunicipios } from "./persona";

/**
 * Campos de una persona en el orden que pide la ficha del proyecto:
 * nombre*, tipo de documento*, documento*, celular* (solo números),
 * municipio de Antioquia* (lista de API Colombia), dirección y correo.
 *
 * Lo usan el registro y el formulario de clientes (igual que la app móvil).
 */
function CamposPersona({ valor, onCambio, errores = {}, correoObligatorio = false }) {
  const [municipios, setMunicipios] = useState(null);
  const [desdeApi, setDesdeApi] = useState(true);

  useEffect(() => {
    let vivo = true;
    cargarMunicipios().then((r) => {
      if (!vivo) return;
      // Si la ficha tenía una ciudad que no está en la lista, se conserva.
      const lista = valor.city && !r.lista.includes(valor.city) ? [valor.city, ...r.lista] : r.lista;
      setMunicipios(lista);
      setDesdeApi(r.desdeApi);
    });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div>
          <Select
            label="Municipio (Antioquia)"
            name="city"
            required
            value={valor.city}
            onChange={set("city")}
            error={errores.city}
            disabled={!municipios}
            options={[
              { value: "", label: municipios ? `Selecciona (${municipios.length})...` : "Cargando municipios..." },
              ...(municipios ?? []).map((m) => ({ value: m, label: m }))
            ]}
          />
          {municipios && !desdeApi && (
            <p className="mt-1 text-xs text-muted-foreground">Sin conexión con la API de municipios: se usa la lista guardada.</p>
          )}
        </div>
      </div>
      <Input
        label="Dirección de residencia"
        name="address"
        value={valor.address}
        onChange={set("address")}
        error={errores.address}
        placeholder="Calle 10 # 43-20"
        autoComplete="street-address"
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
  );
}

export { CamposPersona };
