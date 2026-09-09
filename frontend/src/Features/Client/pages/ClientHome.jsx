import { useNavigate } from "react-router";
import { Sparkles, Package, Tag, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { Badge } from "../../../shared/components/ui/Badge";
import { useAuth } from "../../../shared/auth";
import { useProductCatalog } from "../../Admin/hooks/productCatalog";

/**
 * Inicio del perfil Cliente (story mapping, fila "Cliente" > Modulo Dashboard):
 * mini-dashboard con sus datos, novedades y acceso al catalogo.
 */
function ClientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, categories } = useProductCatalog();

  const featured = products.filter((product) => product.featured).slice(0, 3);
  const available = products.filter((product) => product.inStock).length;

  const stats = [
    { icon: Package, label: "Productos disponibles", value: available },
    { icon: Tag, label: "Categorías", value: Math.max(categories.length - 1, 0) },
    { icon: Sparkles, label: "Novedades", value: featured.length }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-primary tracking-widest uppercase text-xs font-semibold">
            Essence Don Aire
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Hola, {user?.name?.split(" ")[0] ?? "bienvenido"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Explora nuestras fragancias y descubre las novedades de la temporada.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/panel/catalogo")}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 shadow-md"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/panel/pedidos")}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-primary text-primary font-semibold transition-all hover:bg-primary/10"
          >
            Mis pedidos
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Destacados para ti</h2>
          <button
            type="button"
            onClick={() => navigate("/panel/catalogo")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todo
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Card key={product.id} hover>
              <CardContent>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge>${product.price}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                  <span>({product.reviews} reseñas)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ClientHome };
