import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";

const columns = [
  { key: "name", header: "Categoría" },
  { key: "description", header: "Descripción" },
  { key: "productCount", header: "Productos", format: "number" },
  { header: "Estado", value: (row) => (row.status === "active" ? "Activa" : "Inactiva") },
  { key: "createdAt", header: "Creada", format: "date" }
];

function CategoriesHeader({ onNewCategory, rows = [] }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Categorías</h1>
        <p className="text-muted-foreground">Organiza tus productos por categorías</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ExportButton name="categorias" rows={rows} columns={columns} />
        {can("categories.create") && (
          <Button onClick={onNewCategory}>
            <Plus className="h-5 w-5" />
            Nueva Categoría
          </Button>
        )}
      </div>
    </div>
  );
}

export { CategoriesHeader };
