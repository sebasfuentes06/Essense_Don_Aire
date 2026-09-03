import { jsx, jsxs } from "react/jsx-runtime";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { BrandPanel } from "../components/auth";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
function Login({
  onLogin,
  onRegister,
  onForgotPassword
}) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleSubmit
  } = useLoginForm({
    onLogin
  });
  const passwordVisibility = usePasswordVisibility();
  return /* @__PURE__ */jsxs("div", {
    className: "h-screen flex overflow-hidden bg-[#0a0a0a]",
    children: [/* @__PURE__ */jsx(BrandPanel, {}), /* @__PURE__ */jsx("div", {
      className: "w-full lg:w-1/2 flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121212] p-8",
      children: /* @__PURE__ */jsxs("div", {
        className: "w-full max-w-md",
        children: [/* @__PURE__ */jsxs("div", {
          className: "lg:hidden flex flex-col items-center mb-8",
          children: [/* @__PURE__ */jsx("div", {
            className: "w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center mb-3",
            children: /* @__PURE__ */jsx(Sparkles, {
              className: "h-6 w-6 text-black"
            })
          }), /* @__PURE__ */jsx("h1", {
            className: "text-2xl font-bold text-[#1a1a1a] dark:text-white tracking-wide",
            children: "ESSENCE DON AIRE"
          })]
        }), /* @__PURE__ */jsxs("div", {
          className: "hidden lg:block mb-8",
          children: [/* @__PURE__ */jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [/* @__PURE__ */jsx(Sparkles, {
              className: "h-5 w-5 text-[#C9A227]"
            }), /* @__PURE__ */jsx("span", {
              className: "text-[#C9A227] tracking-widest uppercase text-xs font-semibold",
              children: "Essence Don Aire"
            })]
          }), /* @__PURE__ */jsx("h2", {
            className: "text-3xl font-bold text-[#1a1a1a] dark:text-white",
            children: "Bienvenido de vuelta"
          }), /* @__PURE__ */jsx("p", {
            className: "text-[#666] dark:text-gray-400 mt-1",
            children: "Inicia sesi\xF3n para continuar"
          })]
        }), /* @__PURE__ */jsxs("form", {
          className: "space-y-5",
          onSubmit: handleSubmit,
          children: [/* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("label", {
              className: "block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2",
              children: "Correo electr\xF3nico"
            }), /* @__PURE__ */jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */jsx(Mail, {
                className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]"
              }), /* @__PURE__ */jsx("input", {
                className: "w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all",
                value: email,
                onChange: e => setEmail(e.target.value),
                required: true
              })]
            })]
          }), /* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("label", {
              className: "block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2",
              children: "Contrase\xF1a"
            }), /* @__PURE__ */jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */jsx(Lock, {
                className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]"
              }), /* @__PURE__ */jsx("input", {
                className: "w-full h-11 pl-10 pr-11 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all",
                type: passwordVisibility.inputType,
                value: password,
                onChange: e => setPassword(e.target.value),
                required: true
              }), /* @__PURE__ */jsx("button", {
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#C9A227] transition-colors",
                onClick: passwordVisibility.toggle,
                children: passwordVisibility.isVisible ? /* @__PURE__ */jsx(EyeOff, {
                  className: "h-4 w-4"
                }) : /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4"
                })
              })]
            })]
          }), /* @__PURE__ */jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */jsxs("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [/* @__PURE__ */jsx("input", {
                checked: rememberMe,
                onChange: e => setRememberMe(e.target.checked),
                className: "w-4 h-4 rounded border-[#ddd] accent-[#C9A227]"
              }), /* @__PURE__ */jsx("span", {
                className: "text-sm text-[#555] dark:text-gray-400",
                children: "Recordarme"
              })]
            }), /* @__PURE__ */jsx("button", {
                type: "button",
              className: "text-sm text-[#C9A227] hover:underline font-medium",
              onClick: onForgotPassword,
              children: "\xBFOlvidaste tu contrase\xF1a?"
            })]
          }), /* @__PURE__ */jsxs("button", {
            className: "w-full h-11 bg-[#C9A227] hover:bg-[#b8911f] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg",
            children: ["Iniciar sesi\xF3n", /* @__PURE__ */jsx("span", {
              children: "\u2192"
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "text-center text-sm text-[#999]",
            children: "\xBFNo tienes cuenta?"
          }), /* @__PURE__ */jsx("button", {
            type: "button",
            className: "w-full h-11 bg-transparent border border-[#C9A227] text-[#C9A227] rounded-lg font-semibold hover:bg-[#C9A227]/10 transition-all",
            onClick: onRegister,
            children: "Crear cuenta nueva"
          })]
        })]
      })
    })]
  });
}
export { Login };