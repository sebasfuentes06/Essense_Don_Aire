import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth";

/**
 * Carrito del Cliente (igual que en la app móvil).
 *
 * Es UN solo carrito para toda la web, fuera de las pantallas: no se pierde
 * al cambiar de módulo ni al recargar la página, porque se guarda en el
 * navegador, uno por usuario.
 */
const CartContext = createContext(undefined);

const clave = (idUsuario) => `eda_carrito_${idUsuario}`;

function leer(idUsuario) {
  try {
    const texto = window.localStorage.getItem(clave(idUsuario));
    const lista = texto ? JSON.parse(texto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function CartProvider({ children }) {
  const { user } = useAuth();
  const idUsuario = user?.id ?? null;
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Al entrar (o cambiar de usuario) se recupera su carrito guardado.
  useEffect(() => {
    setItems(idUsuario ? leer(idUsuario) : []);
  }, [idUsuario]);

  // Cada cambio se guarda.
  useEffect(() => {
    if (!idUsuario) return;
    try {
      if (items.length) window.localStorage.setItem(clave(idUsuario), JSON.stringify(items));
      else window.localStorage.removeItem(clave(idUsuario));
    } catch {
      /* sin almacenamiento: el carrito vive en memoria */
    }
  }, [items, idUsuario]);

  /** Agrega unidades. Devuelve false si se pasaría del stock. */
  const add = useCallback(
    (product, quantity = 1) => {
      const actual = items.find((i) => i.id === product.id);
      const nueva = (actual?.quantity ?? 0) + quantity;
      if (nueva > product.stock) return false;
      const linea = { id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock, quantity: nueva };
      setItems((prev) => (prev.some((i) => i.id === product.id) ? prev.map((i) => (i.id === product.id ? linea : i)) : [...prev, linea]));
      return true;
    },
    [items]
  );

  const setQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.stock ?? quantity) } : i))
    );
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return { items, count, total, add, setQuantity, remove, clear, isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
  }, [items, add, setQuantity, remove, clear, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

export { CartProvider, useCart };
