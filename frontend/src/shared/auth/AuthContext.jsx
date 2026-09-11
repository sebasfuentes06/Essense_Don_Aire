import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, getToken, setToken, setUnauthorizedHandler } from "../api";
import { ROLES } from "./roles";

/**
 * Sesión de la aplicación, contra la API real.
 *
 * Los permisos ya NO salen de roles.js: vienen del backend, que los lee de
 * `rol_permiso`. Así, si un administrador cambia los permisos de un rol desde
 * el módulo Roles, el cambio se refleja sin tocar código.
 */

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Si cualquier petición recibe 401 (token vencido o revocado), se cierra
  // la sesión en vez de dejar la interfaz a medias.
  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  /** Al cargar la app: si hay token guardado, se rehidrata la sesión. */
  useEffect(() => {
    let cancelado = false;

    async function rehidratar() {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: sesion } = await api.get("/auth/me");
        if (!cancelado) setUser(sesion);
      } catch (error) {
        if (cancelado) return;
        // Solo se borra el token cuando el servidor dice que ya no sirve (401).
        // Si la API está caída o no hay red (status 0), el token sigue siendo
        // válido: se conserva para que al volver el servidor la sesión se
        // recupere sola, sin obligar a entrar de nuevo.
        if (error?.status === 401) clearSession();
        else setUser(null);
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    }

    rehidratar();
    return () => { cancelado = true; };
  }, [clearSession]);

  const login = useCallback(async ({ email, password }) => {
    try {
      const { token, user: sesion } = await api.post(
        "/auth/login",
        { correo: email, contrasena: password },
        { auth: false }
      );
      setToken(token);
      setUser(sesion);
      return { ok: true, user: sesion };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof ApiError ? error.message : "No se pudo iniciar sesión.",
        details: error?.details
      };
    }
  }, []);

  const register = useCallback(async ({ fullName, email, phone, password, role }) => {
    try {
      const { token, user: sesion } = await api.post(
        "/auth/register",
        { nombre: fullName, correo: email, telefono: phone, contrasena: password, rol: role },
        { auth: false }
      );
      setToken(token);
      setUser(sesion);
      return { ok: true, user: sesion };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof ApiError ? error.message : "No se pudo crear la cuenta.",
        details: error?.details
      };
    }
  }, []);

  const logout = useCallback(() => clearSession(), [clearSession]);

  /** Actualiza los datos visibles de la sesión (el perfil aún no se guarda en la API). */
  const updateProfile = useCallback((changes) => {
    setUser((prev) => (prev ? { ...prev, ...changes } : prev));
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    permissions: user?.permissions ?? [],
    /** Único punto donde se decide si algo se muestra o no. */
    can: (permission) => Boolean(user?.permissions?.includes(permission)),
    login,
    register,
    logout,
    updateProfile
  }), [user, isLoading, login, register, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth, ROLES };
