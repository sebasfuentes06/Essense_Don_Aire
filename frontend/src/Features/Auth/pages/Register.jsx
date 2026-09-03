import { jsx, jsxs } from "react/jsx-runtime";
import { Mail, User, Phone, ArrowLeft } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { AuthLayout, FormField, PasswordField } from "../components/auth";
import { useRegisterForm } from "../hooks/useRegisterForm";
function Register({
  onBack,
  onRegister
}) {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit
  } = useRegisterForm({
    onRegister
  });
  return /* @__PURE__ */jsx(AuthLayout, {
    children: /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsx(CardContent, {
        children: /* @__PURE__ */jsxs("form", {
          className: "space-y-5",
          onSubmit: handleSubmit,
          children: [/* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("h2", {
              className: "text-2xl font-bold text-foreground mb-2",
              children: "Crear cuenta nueva"
            }), /* @__PURE__ */jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Completa el formulario para registrarte"
            })]
          }), /* @__PURE__ */jsx(FormField, {
            icon: User,
            value: formData.fullName,
            onChange: e => handleChange("fullName", e.target.value),
            error: errors.fullName
          }), /* @__PURE__ */jsx(FormField, {
            icon: Mail,
            value: formData.email,
            onChange: e => handleChange("email", e.target.value),
            error: errors.email
          }), /* @__PURE__ */jsx(FormField, {
            icon: Phone,
            value: formData.phone,
            onChange: e => handleChange("phone", e.target.value),
            error: errors.phone
          }), /* @__PURE__ */jsx(PasswordField, {
            value: formData.password,
            onChange: value => handleChange("password", value),
            error: errors.password
          }), /* @__PURE__ */jsx(PasswordField, {
            value: formData.confirmPassword,
            onChange: value => handleChange("confirmPassword", value),
            error: errors.confirmPassword
          }), /* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsxs("label", {
              className: "flex items-start gap-3 cursor-pointer group",
              children: [/* @__PURE__ */jsx("input", {
                checked: formData.acceptTerms,
                onChange: e => handleChange("acceptTerms", e.target.checked),
                className: "w-5 h-5 mt-0.5 rounded border-input text-primary focus:ring-2 focus:ring-primary"
              }), /* @__PURE__ */jsxs("span", {
                className: "text-sm text-foreground flex-1",
                children: ["Acepto los", " ", /* @__PURE__ */jsx("button", {
                  type: "button",
                  className: "text-primary hover:underline font-medium",
                  children: "t\xE9rminos y condiciones"
                }), " ", "y la", " ", /* @__PURE__ */jsx("button", {
                  type: "button",
                  className: "text-primary hover:underline font-medium",
                  children: "pol\xEDtica de privacidad"
                })]
              })]
            }), errors.acceptTerms && /* @__PURE__ */jsx("p", {
              className: "mt-1.5 text-sm text-destructive",
              children: errors.acceptTerms
            })]
          }), /* @__PURE__ */jsx(Button, {
            loading: isLoading,
            children: "Crear cuenta"
          }), /* @__PURE__ */jsxs("button", {
            type: "button",
            className: "w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            onClick: onBack,
            children: [/* @__PURE__ */jsx(ArrowLeft, {
              className: "h-4 w-4"
            }), "\xBFYa tienes cuenta? Inicia sesi\xF3n"]
          })]
        })
      })
    })
  });
}
export { Register };