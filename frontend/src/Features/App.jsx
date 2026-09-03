import { jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AdminLayout } from "./Admin/components/layout";
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
} from "./Admin/pages";
import { Landing } from "./Landing/Pages/Landing";
import { Login } from "./Auth/pages/Login";
import { ForgotPassword } from "./Auth/pages/ForgotPassword";
import { Register } from "./Auth/pages/Register";
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("landing");
  const [currentPage, setCurrentPage] = useState("/");
  if (!isAuthenticated) {
    switch (authView) {
      case "register":
        return /* @__PURE__ */ jsx(
          Register,
          {
            onBack: () => setAuthView("login"),
            onRegister: () => setIsAuthenticated(true)
          }
        );
      case "forgot-password":
        return /* @__PURE__ */ jsx(
          ForgotPassword,
          {
            onBack: () => setAuthView("login")
          }
        );
      case "login":
        return /* @__PURE__ */ jsx(
          Login,
          {
            onLogin: () => setIsAuthenticated(true),
            onRegister: () => setAuthView("register"),
            onForgotPassword: () => setAuthView("forgot-password")
          }
        );
      default:
        return /* @__PURE__ */ jsx(
          Landing,
          {
            onLogin: () => setAuthView("login")
          }
        );
    }
  }
  const renderPage = () => {
    switch (currentPage) {
      case "/":
        return /* @__PURE__ */ jsx(Dashboard, {});
      case "/catalogo":
        return /* @__PURE__ */ jsx(ProductCatalog, {});
      case "/productos":
        return /* @__PURE__ */ jsx(ProductsManagement, {});
      case "/categorias":
        return /* @__PURE__ */ jsx(Categories, {});
      case "/clientes":
        return /* @__PURE__ */ jsx(Customers, {});
      case "/proveedores":
        return /* @__PURE__ */ jsx(Suppliers, {});
      case "/compras":
        return /* @__PURE__ */ jsx(Purchases, {});
      case "/ventas":
        return /* @__PURE__ */ jsx(Sales, {});
      case "/usuarios":
        return /* @__PURE__ */ jsx(Users, {});
      case "/roles":
        return /* @__PURE__ */ jsx(Roles, {});
      case "/reportes":
        return /* @__PURE__ */ jsx(Reports, {});
      default:
        return /* @__PURE__ */ jsx(Dashboard, {});
    }
  };
  return /* @__PURE__ */ jsx(AdminLayout, {
    currentPath: currentPage,
    onNavigate: setCurrentPage,
    onLogout: () => {
      setIsAuthenticated(false);
      setAuthView("login");
      setCurrentPage("/");
    },
    children: renderPage()
  });
}
function App() {
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) });
}

export default App;
