import { Edit, Eye, Trash2 } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth } from "../../../../shared/auth";
import { dinero, fecha } from "../../../../shared/negocio";

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg transition-colors";

function CustomerTable({ customers, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onView, onToggleStatus, onEdit, onDelete }) {
  const { can } = useAuth();
  if (customers.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">No hay clientes</p>
          <p className="mt-1 text-sm text-muted-foreground">Registra el primero o ajusta los filtros.</p>
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead>Municipio</TableHead>
            <TableHead className="text-right">Compras</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Última compra</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="max-w-[220px] truncate text-xs text-muted-foreground">{c.email || "Sin correo"}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{c.document ? `${c.documentType} ${c.document}` : "—"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {c.phone ? (
                  <a href={`https://wa.me/57${c.phone}`} target="_blank" rel="noreferrer" className="hover:text-primary">
                    {c.phone}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{c.city || "—"}</TableCell>
              <TableCell className="text-right">{c.purchases}</TableCell>
              <TableCell className={`whitespace-nowrap text-right font-semibold ${c.balance > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {c.balance > 0 ? dinero(c.balance) : "Al día"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{c.lastPurchase ? fecha(c.lastPurchase) : "—"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={c.active}
                    disabled={!can("customers.toggle")}
                    onCheckedChange={() => onToggleStatus(c)}
                    aria-label={`${c.active ? "Desactivar" : "Activar"} ${c.name}`}
                  />
                  <span className={c.active ? "text-sm text-success" : "text-sm text-muted-foreground"}>{c.active ? "Activo" : "Inactivo"}</span>
                </div>
              </TableCell>
              <TableCell className="w-[1%] whitespace-nowrap">
                <div className="flex justify-end gap-1">
                  <button type="button" className={`${iconBtn} hover:bg-muted`} onClick={() => onView(c)} title="Ver ficha y estado de cuenta" aria-label={`Ver ${c.name}`}>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {can("customers.edit") && (
                    <button type="button" className={`${iconBtn} hover:bg-muted`} onClick={() => onEdit(c)} title="Editar" aria-label={`Editar ${c.name}`}>
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                  )}
                  {can("customers.delete") && (
                    <button type="button" className={`${iconBtn} hover:bg-destructive/10`} onClick={() => onDelete(c)} title="Eliminar" aria-label={`Eliminar ${c.name}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
      )}
    </Card>
  );
}

export { CustomerTable };
