import { jsx, jsxs } from "react/jsx-runtime";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { AuthLayout, FormField } from "../components/auth";
import { useForgotPassword } from "../hooks/useForgotPassword";
function ForgotPassword({
  onBack
}) {
  const {
    email,
    setEmail,
    isSubmitted,
    isLoading,
    handleSubmit,
    reset
  } = useForgotPassword();
  return /* @__PURE__ */jsx(AuthLayout, {
    children: /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsx(CardContent, {
        children: !isSubmitted ? /* @__PURE__ */jsxs("form", {
          className: "space-y-6",
          onSubmit: handleSubmit,
          children: [/* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("h2", {
              className: "text-2xl font-bold text-foreground mb-2",
              children: "\xBFOlvidaste tu contrase\xF1a?"
            }), /* @__PURE__ */jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "No te preocupes, te enviaremos instrucciones para recuperarla"
            })]
          }), /* @__PURE__ */jsx(FormField, {
            icon: Mail,
            value: email,
            onChange: e => setEmail(e.target.value),
            required: true
          }), /* @__PURE__ */jsx(Button, {
            loading: isLoading,
            children: "Enviar instrucciones"
          }), /* @__PURE__ */jsxs("button", {
            type: "button",
            className: "w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            onClick: onBack,
            children: [/* @__PURE__ */jsx(ArrowLeft, {
              className: "h-4 w-4"
            }), "Volver al inicio de sesi\xF3n"]
          })]
        }) : /* @__PURE__ */jsxs("div", {
          className: "space-y-6 text-center",
          children: [/* @__PURE__ */jsx("div", {
            className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-2",
            children: /* @__PURE__ */jsx(CheckCircle, {
              className: "h-8 w-8 text-success"
            })
          }), /* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("h2", {
              className: "text-2xl font-bold text-foreground mb-2",
              children: "\xA1Correo enviado!"
            }), /* @__PURE__ */jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: ["Te hemos enviado un correo a ", /* @__PURE__ */jsx("span", {
                className: "font-semibold text-foreground",
                children: email
              }), " con las instrucciones para recuperar tu contrase\xF1a."]
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "p-4 rounded-xl bg-muted/50 border border-border",
            children: /* @__PURE__ */jsx("p", {
              className: "text-sm text-foreground",
              children: "No olvides revisar tu carpeta de spam si no recibes el correo en los pr\xF3ximos minutos."
            })
          }), /* @__PURE__ */jsxs("div", {
            className: "space-y-3",
            children: [/* @__PURE__ */jsx(Button, {
              onClick: onBack,
              children: "Volver al inicio de sesi\xF3n"
            }), /* @__PURE__ */jsx("button", {
              type: "button",
              className: "w-full text-sm text-muted-foreground hover:text-foreground transition-colors",
              onClick: reset,
              children: "Enviar nuevamente"
            })]
          })]
        })
      })
    })
  });
}
export { ForgotPassword };