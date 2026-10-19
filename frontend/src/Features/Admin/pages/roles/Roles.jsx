import { useEffect, useState } from "react";
import { Check, Shield, ShieldCheck, User, Users } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { api } from "../../../../shared/api";
import { ROLE_LIST, PERMISSIONS_BY_ROLE } from "../../../../shared/auth/roles";

/**
 * Roles: vista de solo lectura.
 *
 * La API de la app maneja tres roles fijos (Administrador, Vendedor y
 * Cliente) y sus reglas viven en el servidor, así que aquí no se crean ni se
 * editan roles: se muestra qué puede hacer cada uno y cuántas cuentas tiene.
 * Para cambiarle el rol a alguien se usa el módulo Usuarios.
 */

const MODULOS = {
  dashboard: "Dashboard",
  catalog: "Catálogo",
  products: "Productos",
  categories: "Categorías",
  sales: "Ventas",
  orders: "Pedidos",
  payments: "Pagos",
  purchases: "Compras",
  customers: "Clientes",
  suppliers: "Proveedores",
  users: "Usuarios",
  roles: "Roles",
  data: "Exportar datos",
  profile: "Mi perfil"
};

const ACCIONES = {
  view: "ver",
  create: "crear",
  edit: "editar",
  delete: "eliminar",
  toggle: "activar/desactivar",
  own: "solo lo suyo",
  status: "cambiar estado",
  convert: "convertir en venta",
  cancel: "cancelar/anular",
  statement: "estado de cuenta",
  export: "CSV y PDF"
};

const ICONOS = { Administrador: ShieldCheck, Vendedor: Users, Cliente: User };

function agrupar(permisos) {
  const grupos = {};
  for (const p of permisos) {
    const [modulo, accion] = p.split(".");
    (grupos[modulo] ??= []).push(ACCIONES[accion] ?? accion);
  }
  return Object.entries(grupos).map(([modulo, acciones]) => ({ modulo: MODULOS[modulo] ?? modulo, acciones }));
}

function Roles() {
  const [conteo, setConteo] = useState(null);

  useEffect(() => {
    api
      .todos("/usuarios")
      .then((lista) => {
        const c = {};
        for (const u of lista) if (u.estado && u.aprobacion !== "pendiente") c[u.rol] = (c[u.rol] ?? 0) + 1;
        setConteo(c);
      })
      .catch(() => setConteo({}));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">Roles</h1>
        <p className="text-muted-foreground">
          Los tres roles del sistema y lo que puede hacer cada uno. Son fijos (los mismos de la app móvil); para cambiarle el rol a una persona usa el módulo Usuarios.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {ROLE_LIST.map((rol) => {
          const Icono = ICONOS[rol.value] ?? Shield;
          const grupos = agrupar(PERMISSIONS_BY_ROLE[rol.value] ?? []);
          return (
            <Card key={rol.value} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icono className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{rol.label}</h2>
                    <p className="text-sm text-muted-foreground">{rol.description}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm">
                <b className="text-foreground">{conteo ? conteo[rol.value] ?? 0 : "…"}</b>{" "}
                <span className="text-muted-foreground">cuenta(s) activa(s)</span>
              </p>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {grupos.map((g) => (
                  <div key={g.modulo} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <p>
                      <span className="font-medium text-foreground">{g.modulo}:</span>{" "}
                      <span className="text-muted-foreground">{g.acciones.join(", ")}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { Roles };
