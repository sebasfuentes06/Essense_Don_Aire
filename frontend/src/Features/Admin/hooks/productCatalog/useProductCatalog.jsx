import { useCallback, useEffect, useMemo, useState } from "react";
import { cargarProductos, cargarCategorias } from "../../../../shared/negocio";

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "price", label: "Precio" },
  { value: "stock", label: "Disponibles" }
];

/**
 * Catálogo con los productos REALES de la API (los mismos de la app móvil),
 * con sus fotos. El carrito vive aparte (CartContext) para que no se pierda
 * al cambiar de pantalla.
 */
function useProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, c] = await Promise.all([cargarProductos({ status: "active" }), cargarCategorias()]);
      setProducts(p);
      setCategoryList(c);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const categories = useMemo(() => ["Todos", ...categoryList.map((c) => c.name)], [categoryList]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? p.inStock : !p.inStock);
      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [products, selectedCategory, searchQuery, availabilityFilter]);

  const sortedProducts = useMemo(
    () =>
      [...filteredProducts].sort((a, b) => {
        const av = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
        const bv = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
        if (av === bv) return 0;
        return sortDirection === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      }),
    [filteredProducts, sortBy, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const reset = (fn) => (v) => {
    fn(v);
    setCurrentPage(1);
  };

  return {
    isLoading,
    error,
    reload,
    categories,
    products,
    selectedCategory,
    setSelectedCategory: reset(setSelectedCategory),
    searchQuery,
    setSearchQuery: reset(setSearchQuery),
    availabilityFilter,
    setAvailabilityFilter: reset(setAvailabilityFilter),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortOptions,
    itemsPerPage,
    setItemsPerPage: reset(setItemsPerPage),
    currentPage,
    setCurrentPage,
    filteredProducts,
    totalPages,
    paginatedProducts
  };
}

export { useProductCatalog };
