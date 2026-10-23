import { useEffect } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { Footer } from "./Footer";
import { useAuth, ROLES } from "../../../../shared/auth";
import { CartModal, CartBar, useCart, MARCA_FINALIZAR } from "../../../../shared/cart";

/**
 * Layout unico del panel. Lo usan los tres perfiles (Administrador, Vendedor
 * y Cliente); lo que cambia entre ellos es el menu que arma el Sidebar a
 * partir de los permisos del rol, no el layout.
 */
function AdminLayout() {
  const { role } = useAuth();
  const esCliente = role === ROLES.CLIENT;
  const cart = useCart();

  // Si venía de la vitrina con "Finalizar compra", al entrar se le abre el
  // carrito (ya con lo que agregó como visitante) para hacer el pedido.
  useEffect(() => {
    let marca = null;
    try {
      marca = window.sessionStorage.getItem(MARCA_FINALIZAR);
    } catch {
      /* sin almacenamiento */
    }
    if (!marca || !esCliente || cart.count === 0) return;
    try {
      window.sessionStorage.removeItem(MARCA_FINALIZAR);
    } catch {
      /* nada */
    }
    cart.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esCliente, cart.count]);

  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      {/* Carrito del cliente: disponible desde cualquier pantalla del panel. */}
      {esCliente && <CartModal />}
      {esCliente && <CartBar />}
    </div>
  );
}

export { AdminLayout };
