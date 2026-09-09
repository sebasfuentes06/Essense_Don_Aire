import { Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";

function ProductsHeader({ onNewProduct }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Productos</h1>
        <p className="text-muted-foreground">Gestiona tu inventario de fragancias</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="h-5 w-5" />
          Exportar
        </Button>
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
