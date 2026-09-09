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
 * Registro de cuenta.
 *
 * El rol elegido aqui determina que vistas vera la persona al entrar:
 * Cliente -> catalogo y su cuenta; Vendedor -> panel de ventas.
 * El perfil Administrador no se auto-asigna: lo crea un administrador
 * desde el modulo Usuarios.
 */
function useRegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (![ROLES.CLIENT, ROLES.SELLER].includes(formData.role)) {
      newErrors.role = "Debes seleccionar un perfil";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simula la latencia de la futura llamada a POST /auth/register
    setTimeout(() => {
      register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      setIsLoading(false);
      navigate("/panel", { replace: true });
    }, 800);
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
}

export { useRegisterForm };
