import { useState } from "react";
import { useAuth } from "../../../shared/auth";
import { PERSONA_VACIA, validarPersona, erroresApiAPersona } from "../../../shared/persona";

const INITIAL_FORM = {
  ...PERSONA_VACIA,
  password: "",
  confirmPassword: "",
  acceptTerms: false
};

/**
 * Registro contra la API unificada (la misma de la app móvil).
 *
 * La cuenta queda PENDIENTE: la administradora la aprueba (y le asigna el
 * rol) desde Usuarios. Por eso aquí no se inicia sesión: se muestra el aviso
 * de "solicitud enviada".
 */
function useRegisterForm() {
  const { register } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState("");

  const validateForm = () => {
    const newErrors = validarPersona(formData, { correoObligatorio: true });
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Debes aceptar el tratamiento de datos personales";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Recibe el formulario completo (CamposPersona) o un solo campo. */
  const handleChange = (field, value) => {
    if (typeof field === "object") {
      setFormData((prev) => ({ ...prev, ...field }));
      setErrors({});
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setServerError("Revisa los campos marcados en rojo.");
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      if (result.details) setErrors((prev) => ({ ...prev, ...erroresApiAPersona(result.details) }));
      return;
    }
    setSentMessage(result.message ?? "Tu solicitud fue enviada. Te avisaremos por correo cuando la aprueben.");
  };

  return { formData, errors, serverError, isLoading, sentMessage, handleChange, handleSubmit };
}

export { useRegisterForm };
