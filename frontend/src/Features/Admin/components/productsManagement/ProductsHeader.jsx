import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";

const estado = (value) => (value === "active" ? "Activo" : "Inactivo");

const columns = [
  { key: "sku", header: "SKU" },
  { key: "name", header: "Producto" },
  { key: "category", header: "Categoría" },
  { key: "supplier", header: "Proveedor" },
  { key: "price", header: "Precio", format: "money" },
  { key: "stock", header: "Stock", format: "number" },
  { key: "minStock", header: "Stock mínimo", format: "number" },
  { header: "Estado", value: (row) => estado(row.status) }
];

function ProductsHeader({ onNewProduct, rows = [] }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Productos</h1>
        <p className="text-muted-foreground">Gestiona tu inventario de fragancias</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ExportButton name="productos" rows={rows} columns={columns} />
        <PrintButton />
        {can("products.create") && (
          <Button onClick={onNewProduct}>
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </Button>
        )}
      </div>
    </div>
  );
}

export { ProductsHeader };
