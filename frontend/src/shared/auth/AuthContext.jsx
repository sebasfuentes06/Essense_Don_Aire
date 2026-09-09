import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ROLES, getPermissions, roleCan } from "./roles";

const STORAGE_KEY = "eda_session";

const AuthContext = createContext(undefined);

/**
 * Usuarios de demostracion.
 *
 * Mientras no exista backend, el login valida contra esta lista. Cuando se
 * conecte la API, este arreglo se reemplaza por la llamada a
 * POST /auth/login y el resto del contexto NO cambia.
 */
const DEMO_USERS = [
  { id: 1, name: "Admin Principal", email: "admin@essence.com", role: ROLES.ADMIN, phone: "+57 300 000 0001" },
  { id: 2, name: "Carlos Vendedor", email: "carlos@essence.com", role: ROLES.SELLER, phone: "+57 300 000 0002" },
  { id: 3, name: "María Vendedora", email: "maria@essence.com", role: ROLES.SELLER, phone: "+57 300 000 0003" },
  { id: 4, name: "Laura Cliente", email: "laura@essence.com", role: ROLES.CLIENT, phone: "+57 300 000 0004" }
];

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.role || !Object.values(ROLES).includes(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(user) {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* localStorage puede estar bloqueado: la sesion vive solo en memoria */
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredSession());
    setIsLoading(false);
  }, []);

  /**
   * Login simulado. `role` viene del selector del formulario de acceso.
   * Si el correo coincide con un usuario demo se usa su nombre real;
   * si no, se arma un usuario con el correo escrito.
   */
  const login = useCallback(({ email, password, role }) => {
    const cleanEmail = String(email ?? "").trim().toLowerCase();

    if (!cleanEmail) {
      return { ok: false, error: "Debes indicar tu correo electronico." };
    }
    if (!String(password ?? "").trim()) {
      return { ok: false, error: "Debes indicar tu contrasena." };
    }
    if (!Object.values(ROLES).includes(role)) {
      return { ok: false, error: "Debes seleccionar un perfil valido." };
    }

    const demo = DEMO_USERS.find((candidate) => candidate.email === cleanEmail);
    const session = demo && demo.role === role
      ? { ...demo }
      : {
          id: demo?.id ?? Date.now(),
          name: demo?.name ?? cleanEmail.split("@")[0],
          email: cleanEmail,
          phone: demo?.phone ?? "",
          role
        };

    setUser(session);
    persistSession(session);
    return { ok: true, user: session };
  }, []);

  /** Registro simulado: el rol elegido en el formulario define que vistas vera. */
  const register = useCallback(({ fullName, email, phone, role }) => {
    const session = {
      id: Date.now(),
      name: String(fullName ?? "").trim() || String(email ?? "").split("@")[0],
      email: String(email ?? "").trim().toLowerCase(),
      phone: String(phone ?? "").trim(),
      role: Object.values(ROLES).includes(role) ? role : ROLES.CLIENT
    };
    setUser(session);
    persistSession(session);
    return { ok: true, user: session };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistSession(null);
  }, []);

  const updateProfile = useCallback((changes) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...changes };
      persistSession(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    permissions: getPermissions(user?.role),
    can: (permission) => Boolean(user) && roleCan(user.role, permission),
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

export { AuthProvider, useAuth, DEMO_USERS, STORAGE_KEY };
