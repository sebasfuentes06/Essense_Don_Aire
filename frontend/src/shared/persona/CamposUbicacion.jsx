import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/Select";
import { cargarDepartamentos, cargarCiudades, mismoNombre } from "./ubicacion";

/**
 * Departamento + ciudad (desplegables de API Colombia). Por defecto el
 * departamento es Antioquia. Si no hay lista de ciudades para el
 * departamento elegido, la ciudad se escribe a mano.
 */
function CamposUbicacion({ departamento, ciudad, onCambio, errores = {}, requerido = true }) {
  const [deps, setDeps] = useState(null);
  const [lista, setLista] = useState(null);

  useEffect(() => {
    let vivo = true;
    cargarDepartamentos().then((d) => vivo && setDeps(d));
    return () => {
      vivo = false;
    };
  }, []);

  const actual = deps?.find((d) => mismoNombre(d.nombre, departamento)) ?? null;

  useEffect(() => {
    let vivo = true;
    setLista(null);
    if (!actual) return;
    cargarCiudades(actual).then((l) => {
      if (!vivo) return;
      // Si la ficha tenía una ciudad que no está en la lista, se conserva.
      setLista(ciudad && l.length && !l.some((c) => mismoNombre(c, ciudad)) ? [ciudad, ...l] : l);
    });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual?.nombre]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Departamento"
        required={requerido}
        value={actual?.nombre ?? departamento ?? ""}
        disabled={!deps}
        error={errores.departamento}
        onChange={(e) => onCambio({ departamento: e.target.value, ciudad: "" })}
        options={[
          { value: "", label: deps ? "Selecciona..." : "Cargando..." },
          ...(deps ?? []).map((d) => ({ value: d.nombre, label: d.nombre }))
        ]}
      />
      {actual && lista && lista.length === 0 ? (
        <Input
          label="Ciudad / municipio"
          required={requerido}
          value={ciudad ?? ""}
          error={errores.ciudad}
          onChange={(e) => onCambio({ departamento: actual.nombre, ciudad: e.target.value })}
          placeholder="Escribe la ciudad"
        />
      ) : (
        <Select
          label="Ciudad / municipio"
          required={requerido}
          value={ciudad ?? ""}
          disabled={!lista}
          error={errores.ciudad}
          onChange={(e) => onCambio({ departamento: actual?.nombre ?? departamento, ciudad: e.target.value })}
          options={[
            { value: "", label: !actual ? "Elige primero el departamento" : lista ? `Selecciona (${lista.length})...` : "Cargando ciudades..." },
            ...(lista ?? []).map((c) => ({ value: c, label: c }))
          ]}
        />
      )}
    </div>
  );
}

export { CamposUbicacion };
