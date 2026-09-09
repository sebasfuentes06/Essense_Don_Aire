import { Navigate, Route, Routes, useNavigate } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth, ROLES } from "../shared/auth";
import { OrdersProvider } from "../shared/orders";
import { ProtectedRoute } from "../shared/routes";
import { AdminLayout } from "./Admin/components/layout";
import {
  Dashboard,
  Orders,
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
} from "./Admin/pages";
import { ClientHome } from "./Client/pages";
import { MyProfile } from "./Account/pages";
import { Landing } from "./Landing/Pages/Landing";
import { Login } from "./Auth/pages/Login";
import { ForgotPassword } from "./Auth/pages/ForgotPassword";
import { Register } from "./Auth/pages/Register";

/** Inicio del panel: cada rol aterriza en la vista que le corresponde. */
function RoleHome() {
  const { role } = useAuth();
  return role === ROLES.CLIENT ? <ClientHome /> : <Dashboard />;
}

/** Rutas publicas: si ya hay sesion, no tiene sentido volver a login/registro. */
function PublicOnly({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/panel" replace /> : children;
}

function LandingPage() {
  const navigate = useNavigate();
  return <Landing onLogin={() => navigate("/login")} />;
}

function LoginPage() {
  const navigate = useNavigate();
  return (
    <Login
      onRegister={() => navigate("/registro")}
      onForgotPassword={() => navigate("/recuperar-password")}
    />
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  return <Register onBack={() => navigate("/login")} />;
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  return <ForgotPassword onBack={() => navigate("/login")} />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Publicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/registro" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/recuperar-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />

      {/* Panel: requiere sesion. Cada hija exige ademas su propio permiso. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/panel" element={<AdminLayout />}>
          <Route index element={<RoleHome />} />

          <Route element={<ProtectedRoute permission="catalog.view" />}>
            <Route path="catalogo" element={<ProductCatalog />} />
          </Route>
          <Route element={<ProtectedRoute permission="products.view" />}>
            <Route path="productos" element={<ProductsManagement />} />
          </Route>
          <Route element={<ProtectedRoute permission="categories.view" />}>
            <Route path="categorias" element={<Categories />} />
          </Route>
          <Route element={<ProtectedRoute permission="orders.view" />}>
            <Route path="pedidos" element={<Orders />} />
          </Route>
          <Route element={<ProtectedRoute permission="sales.view" />}>
            <Route path="ventas" element={<Sales />} />
          </Route>
          <Route element={<ProtectedRoute permission="purchases.view" />}>
            <Route path="compras" element={<Purchases />} />
          </Route>
          <Route element={<ProtectedRoute permission="customers.view" />}>
            <Route path="clientes" element={<Customers />} />
          </Route>
          <Route element={<ProtectedRoute permission="suppliers.view" />}>
            <Route path="proveedores" element={<Suppliers />} />
          </Route>
          <Route element={<ProtectedRoute permission="users.view" />}>
            <Route path="usuarios" element={<Users />} />
          </Route>
          <Route element={<ProtectedRoute permission="roles.view" />}>
            <Route path="roles" element={<Roles />} />
          </Route>
          <Route element={<ProtectedRoute permission="reports.view" />}>
            <Route path="reportes" element={<Reports />} />
          </Route>
          <Route element={<ProtectedRoute permission="profile.view" />}>
            <Route path="mi-perfil" element={<MyProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrdersProvider>
          <AppRoutes />
        </OrdersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
