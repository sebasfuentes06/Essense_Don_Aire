import { Shield, CheckCircle, Users, KeyRound } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";

/**
 * Indicadores de la pantalla de Roles.
 *
 * `stats` viene del servidor y cuenta TODOS los roles. `roles` es solo la
 * página que se está viendo: usarlo para contar daría una cifra distinta
 * apenas hubiera más roles de los que caben en una página. Se prefiere el
 * dato del servidor y se calcula a partir de la página solo si no llegó.
 */
function RoleStats({ roles = [], availablePermissions = [], stats }) {
  const total = stats?.total ?? roles.length;
  const activos = stats?.activos ?? roles.filter((r) => r.status === "active").length;
  const usuarios = roles.reduce((suma, r) => suma + (r.usersCount ?? 0), 0);

  const tarjetas = [
    { etiqueta: "Total Roles", valor: total, color: "text-foreground", Icono: Shield, tono: "text-primary" },
    { etiqueta: "Roles Activos", valor: activos, color: "text-success", Icono: CheckCircle, tono: "text-success" },
    { etiqueta: "Usuarios Asignados", valor: usuarios, color: "text-primary", Icono: Users, tono: "text-primary" },
    { etiqueta: "Permisos Totales", valor: availablePermissions.length, color: "text-foreground", Icono: KeyRound, tono: "text-muted-foreground" }
  ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {tarjetas.map(({ etiqueta, valor, color, Icono, tono }) => (
        <Card key={etiqueta}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{etiqueta}</p>
              <p className={`text-2xl font-bold ${color}`}>{valor}</p>
            </div>
            <Icono className={`h-8 w-8 ${tono}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { RoleStats };
