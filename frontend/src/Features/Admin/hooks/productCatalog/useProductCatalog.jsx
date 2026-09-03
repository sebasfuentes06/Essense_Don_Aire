import { useState } from "react";
const categories = ["Todos", "Hombre", "Mujer", "Unisex", "Exclusivos"];
const products = [
  {
    id: 1, name: "Essence Royale", category: "Exclusivos", price: 89.99,
    rating: 4.9,
    reviews: 234, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop", inStock: true,
    featured: true
  },
  {
    id: 2, name: "Noir Elegance", category: "Hombre", price: 74.99,
    rating: 4.8,
    reviews: 189, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop", inStock: true,
    featured: true
  },
  {
    id: 3, name: "Golden Mist", category: "Mujer", price: 79.99,
    rating: 4.7,
    reviews: 156, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=500&fit=crop", inStock: true,
    featured: false
  },
  {
    id: 4, name: "Velvet Rose", category: "Mujer", price: 69.99,
    rating: 4.9,
    reviews: 298, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop", inStock: true,
    featured: false
  },
  {
    id: 5, name: "Ocean Breeze", category: "Unisex", price: 64.99,
    rating: 4.6,
    reviews: 142, image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop", inStock: false,
    featured: false
  },
  {
    id: 6, name: "Midnight Dream", category: "Hombre", price: 84.99,
    rating: 4.8,
    reviews: 201, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=500&fit=crop", inStock: true,
    featured: true
  }
];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "price", label: "Precio" },
  { value: "rating", label: "Calificación" }
];
function useProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" ? product.inStock : !product.inStock);
    return matchesCategory && matchesSearch && matchesAvailability;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleAvailabilityChange = (value) => {
    setAvailabilityFilter(value);
    setCurrentPage(1);
  };
  const handleAddToCart = (product) => {
    setCartItems((items) => {
      const currentItem = items.find((item) => item.id === product.id);
      return currentItem
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
  };
  const handleUpdateCartQuantity = (productId, quantity) => {
    setCartItems((items) => quantity <= 0 ? items.filter((item) => item.id !== productId) : items.map((item) => item.id === productId ? { ...item, quantity } : item));
  };
  const handleRemoveFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };
  return {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery: handleSearchChange,
    availabilityFilter,
    setAvailabilityFilter: handleAvailabilityChange,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortOptions,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    filteredProducts,
    totalPages,
    paginatedProducts,
    cartItems,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart
  };
}
export {
  useProductCatalog
};
