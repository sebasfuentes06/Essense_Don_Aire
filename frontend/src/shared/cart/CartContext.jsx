import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth";

/**
 * Carrito del Cliente (igual que en la app móvil).
 *
 * Es UN solo carrito para toda la web, fuera de las pantallas: no se pierde
 * al cambiar de módulo ni al recargar la página, porque se guarda en el
 * navegador, uno por usuario.
 *
 * Un visitante sin sesión también tiene carrito (el de la vitrina). Cuando
 * inicia sesión como Cliente, lo que agregó pasa a su carrito.
 */
const CartContext = createContext(undefined);

const INVITADO = "invitado";
const clave = (idUsuario) => `eda_carrito_${idUsuario}`;
/** Marca que deja el visitante al pulsar "Finalizar compra" antes de entrar. */
export const MARCA_FINALIZAR = "eda_finalizar_compra";

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
  // De quién son los `items` en memoria. Evita guardar el carrito de un
  // usuario con la clave de otro justo cuando cambia la sesión.
  const [cargadoPara, setCargadoPara] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dueno = idUsuario ?? INVITADO;
  const esCliente = user?.role === "Cliente";

  // Al entrar (o cambiar de usuario) se recupera su carrito guardado. Si es un
  // Cliente y venía con un carrito de visitante, se suman (sin pasar el stock).
  useEffect(() => {
    const propio = leer(dueno);
    if (idUsuario && esCliente) {
      const invitado = leer(INVITADO);
      if (invitado.length) {
        const unido = [...propio];
        for (const linea of invitado) {
          const actual = unido.find((i) => i.id === linea.id);
          if (actual) actual.quantity = Math.min(actual.quantity + linea.quantity, linea.stock ?? Infinity);
          else unido.push(linea);
        }
        try {
          window.localStorage.removeItem(clave(INVITADO));
        } catch {
          /* nada */
        }
        setItems(unido);
        setCargadoPara(dueno);
        return;
      }
    }
    setItems(propio);
    setCargadoPara(dueno);
  }, [dueno, idUsuario, esCliente]);

  // Cada cambio se guarda.
  useEffect(() => {
    if (cargadoPara !== dueno) return;
    try {
      if (items.length) window.localStorage.setItem(clave(dueno), JSON.stringify(items));
      else window.localStorage.removeItem(clave(dueno));
    } catch {
      /* sin almacenamiento: el carrito vive en memoria */
    }
  }, [items, dueno, cargadoPara]);

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
