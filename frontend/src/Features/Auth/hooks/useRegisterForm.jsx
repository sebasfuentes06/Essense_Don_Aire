import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, ROLES } from "../../../shared/auth";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: ROLES.CLIENT,
  acceptTerms: false
};

/**
 * Registro contra la API. El backend solo acepta crear cuentas de Cliente o
 * Vendedor: el perfil Administrador lo asigna un administrador desde Usuarios.
 */
function useRegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es requerido";
    if (!formData.email.trim()) newErrors.email = "El correo electrónico es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Correo electrónico inválido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (![ROLES.CLIENT, ROLES.SELLER].includes(formData.role)) newErrors.role = "Debes seleccionar un perfil";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      // errores por campo que devuelva el backend
      if (result.details) setErrors((prev) => ({ ...prev, ...result.details }));
      return;
    }

    navigate("/panel", { replace: true });
  };

  return { formData, errors, serverError, isLoading, handleChange, handleSubmit };
}

export { useRegisterForm };
