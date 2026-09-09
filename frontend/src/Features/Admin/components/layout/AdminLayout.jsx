import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { Footer } from "./Footer";

/**
 * Layout unico del panel. Lo usan los tres perfiles (Administrador, Vendedor
 * y Cliente); lo que cambia entre ellos es el menu que arma el Sidebar a
 * partir de los permisos del rol, no el layout.
 */
function AdminLayout() {
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
    </div>
  );
}

export { AdminLayout };
