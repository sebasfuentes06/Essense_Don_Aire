import { jsx } from "react/jsx-runtime";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
function PasswordField({ placeholder, value, onChange, error }) {
  const { isVisible, toggle, inputType } = usePasswordVisibility();
  return /* @__PURE__ */ jsx(
    FormField,
    {
      icon: Lock,
      type: inputType,
      placeholder,
      value,
      onChange: (e) => onChange(e.target.value),
      error,
      hasTrailingButton: true,
      children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground",
          onClick: toggle,
          "aria-label": isVisible ? "Ocultar contraseña" : "Mostrar contraseña",
          children: isVisible ? /* @__PURE__ */ jsx(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5" })
        }
      )
    }
  );
}
export {
  PasswordField
};
