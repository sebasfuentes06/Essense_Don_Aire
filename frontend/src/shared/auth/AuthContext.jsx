import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, getToken, setToken, setUnauthorizedHandler } from "../api";
import { ROLES, getPermissions } from "./roles";

/**
 * Sesión de la aplicación, contra la API unificada (la misma de la app móvil).
 *
 * La API maneja tres roles fijos (Administrador, Vendedor, Cliente) y valida
 * cada permiso en el servidor. Aquí los permisos de cada rol salen de
 * roles.js y solo deciden qué se muestra: ocultar un botón es comodidad, la
 * protección real está en la API.
 */

/** Usuario de la API -> forma que usa la interfaz. */
function aSesion(u) {
  if (!u) return null;
  return {
    id: u.id_usuario,
    name: u.nombre,
    email: u.correo,
    phone: u.telefono ?? "",
    role: u.rol,
    idCliente: u.id_cliente ?? null,
    joinDate: u.creado_en ?? null,
    lastLogin: u.ultimo_acceso ?? null,
    permissions: getPermissions(u.rol)
  };
}

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
        const sesion = aSesion(await api.datos("/auth/yo"));
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
      const { datos } = await api.post("/auth/login", { correo: email, password }, { auth: false });
      const sesion = aSesion(datos.usuario);
      setToken(datos.token);
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

  /**
   * Registro: la cuenta queda PENDIENTE hasta que el Administrador la apruebe
   * (no inicia sesión de una vez). Datos en el mismo orden que la app móvil.
   */
  const register = useCallback(async (datos) => {
    try {
      const r = await api.post(
        "/auth/registro",
        {
          nombre: datos.fullName,
          tipo_documento: datos.documentType,
          documento: datos.document,
          telefono: datos.phone,
          ciudad: datos.city,
          direccion: datos.address,
          correo: datos.email,
          password: datos.password,
          acepta_datos: datos.acceptTerms === true
        },
        { auth: false }
      );
      return { ok: true, message: r?.mensaje };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof ApiError ? error.message : "No se pudo crear la cuenta.",
        details: error?.details
      };
    }
  }, []);

  const logout = useCallback(() => clearSession(), [clearSession]);

  /** Guarda nombre y celular en la API y actualiza la sesión. */
  const updateProfile = useCallback(async (changes) => {
    try {
      const r = await api.put("/auth/perfil", { nombre: changes.name, telefono: changes.phone });
      setUser(aSesion(r.datos));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message, details: error?.details };
    }
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
