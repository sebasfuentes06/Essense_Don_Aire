import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth, ROLES } from "../../../shared/auth";

/**
 * Formulario de acceso.
 *
 * Mientras no hay backend, el rol se elige en un selector del formulario
 * ("Entrar como"). Cuando se conecte la API el rol vendra en la respuesta del
 * login y bastara con quitar el selector: el resto del flujo no cambia.
 */
function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = login({ email, password, role });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const target = location.state?.from?.pathname ?? "/panel";
    navigate(target, { replace: true });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    rememberMe,
    setRememberMe,
    error,
    handleSubmit
  };
}

export { useLoginForm };
