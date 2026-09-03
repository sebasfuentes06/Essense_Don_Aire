import { useState } from "react";
const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false
};
function useRegisterForm({ onRegister } = {}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electr\xF3nico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electr\xF3nico inv\xE1lido";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El tel\xE9fono es requerido";
    }
    if (!formData.password) {
      newErrors.password = "La contrase\xF1a es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contrase\xF1a debe tener al menos 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contrase\xF1as no coinciden";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los t\xE9rminos y condiciones";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister?.();
    }, 1500);
  };
  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit
  };
}
export {
  useRegisterForm
};
