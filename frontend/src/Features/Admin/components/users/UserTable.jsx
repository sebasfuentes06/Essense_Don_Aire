import { Edit, Eye, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";

/** Una cuenta recién creada todavía no ha entrado nunca: mejor decirlo. */
function formatearFecha(valor, vacio = "—") {
  if (!valor) return vacio;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? vacio : fecha.toLocaleDateString();
}

function UserTable({
  users,
  totalPages,
  currentPage,
  totalItems,
  itemsPerPage,
  currentUserId = null,
  onPageChange,
  onShowDetail,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Último Acceso</TableHead>
            <TableHead>Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[1%] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            // El backend rechaza que alguien se desactive o se borre a sí
            // mismo. Se desactivan aquí los controles para que no parezca
            // que la acción existe y luego falle.
            const esMiCuenta = currentUserId != null && Number(user.id) === Number(currentUserId);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {(user.name ?? "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {user.name}
                        {esMiCuenta && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">(tú)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Mail className="mr-2 inline-block h-4 w-4 align-middle text-muted-foreground" />
                  {user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Phone className="mr-2 inline-block h-4 w-4 align-middle text-muted-foreground" />
                  {user.phone || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "Administrador" ? "danger" : "default"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{formatearFecha(user.lastLogin, "Nunca")}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Calendar className="mr-2 inline-block h-4 w-4 align-middle text-muted-foreground" />
                  {formatearFecha(user.joinDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.status === "active"}
                      disabled={esMiCuenta}
                      itemName={user.name}
                      onCheckedChange={() => onToggleStatus(user)}
                      aria-label={`${user.status === "active" ? "Desactivar" : "Activar"} ${user.name}`}
                    />
                    <span
                      className={
                        user.status === "active"
                          ? "text-sm font-medium text-success"
                          : "text-sm font-medium text-muted-foreground"
                      }
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      onClick={() => onShowDetail(user)}
                      title="Ver detalles"
                      aria-label={`Ver detalles de ${user.name}`}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      onClick={() => onEdit(user)}
                      title="Editar"
                      aria-label={`Editar ${user.name}`}
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      type="button"
                      disabled={esMiCuenta}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      onClick={() => onDelete(user)}
                      title={esMiCuenta ? "No puedes eliminar tu propia cuenta" : "Eliminar"}
                      aria-label={`Eliminar ${user.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}

export { UserTable };
