import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AdminLayout } from './Admin/Layout/components';
import {
  Dashboard,
  ProductCatalog,
  ProductsManagement,
  Categories,
  Customers,
  Suppliers,
  Sales,
  Purchases,
  Users,
  Roles,
  Reports
} from './Admin/pages';



// Rutas Nurevas

import { Landing } from './Landing/Pages/Landing';
import { Login } from './Auth/pages/Login';
import { ForgotPassword } from './Auth/pages/ForgotPassword';
import { Register } from './Auth/pages/Register';

type AuthView = 'landing' | 'login' | 'register' | 'forgot-password';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [currentPage, setCurrentPage] = useState('/');

  if (!isAuthenticated) {
    switch (authView) {
      case 'register':
        return (
          <Register
            onBack={() => setAuthView('login')}
            onRegister={() => setIsAuthenticated(true)}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onBack={() => setAuthView('login')}
          />
        );
      case 'login':
        return (
          <Login
            onLogin={() => setIsAuthenticated(true)}
            onRegister={() => setAuthView('register')}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        );
      default:
        return (
          <Landing
            onLogin={() => setAuthView('login')}
          />
        );
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/catalogo':
        return <ProductCatalog />;
      case '/productos':
        return <ProductsManagement />;
      case '/categorias':
        return <Categories />;
      case '/clientes':
        return <Customers />;
      case '/proveedores':
        return <Suppliers />;
      case '/compras':
        return <Purchases />;
      case '/ventas':
        return <Sales />;
      case '/usuarios':
        return <Users />;
      case '/roles':
        return <Roles />;
      case '/reportes':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPath={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
