import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

/**
 * Layout del panel administrativo (Paso 3.1 de la guía).
 * Estructura: Sidebar | Header + Breadcrumb + contenido + Footer.
 * Toda página administrativa se renderiza como children de este layout.
 */
export function AdminLayout({ currentPath, onNavigate, children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            <Breadcrumb currentPath={currentPath} onNavigate={onNavigate} />
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
