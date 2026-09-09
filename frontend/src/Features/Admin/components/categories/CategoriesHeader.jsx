import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";

function CategoriesHeader({ onNewCategory }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Categorías</h1>
        <p className="text-muted-foreground">Organiza tus productos por categorías</p>
      </div>
      {can("categories.create") && (
        <Button onClick={onNewCategory}>
          <Plus className="h-5 w-5" />
          Nueva Categoría
        </Button>
      )}
    </div>
  );
}

export { CategoriesHeader };
