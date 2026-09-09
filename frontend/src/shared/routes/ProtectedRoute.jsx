import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth";

/**
 * Guard de rutas.
 *
 * - Sin sesion  -> manda a /login recordando a donde queria ir.
 * - Con sesion pero sin el permiso requerido -> manda al inicio de su panel.
 *
 * Se usa como ruta envolvente:
 *   <Route element={<ProtectedRoute permission="users.view" />}>
 *     <Route path="usuarios" element={<Users />} />
 *   </Route>
 */
function ProtectedRoute({ permission, redirectTo = "/panel" }) {
  const { isAuthenticated, isLoading, can } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !can(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
