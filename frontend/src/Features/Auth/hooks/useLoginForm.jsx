import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../shared/auth";

/**
 * Formulario de acceso, ya contra la API.
 * El perfil lo determina la base de datos según el usuario: por eso
 * desapareció el selector "Entrar como" que usábamos mientras no había backend.
 */
function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login({ email, password });

    setIsLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(location.state?.from?.pathname ?? "/panel", { replace: true });
  };

  return { email, setEmail, password, setPassword, rememberMe, setRememberMe, error, isLoading, handleSubmit };
}

export { useLoginForm };
