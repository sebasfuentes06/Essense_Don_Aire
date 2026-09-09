import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { BrandPanel } from "../components/auth";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { ROLE_LIST } from "../../../shared/auth";

const inputClass =
  "w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all";

function Login({ onRegister, onForgotPassword }) {
  const {
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
  } = useLoginForm();

  const passwordVisibility = usePasswordVisibility();

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a0a]">
      <BrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121212] p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white tracking-wide">
              ESSENCE DON AIRE
            </h1>
          </div>

          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#C9A227]" />
              <span className="text-[#C9A227] tracking-widest uppercase text-xs font-semibold">
                Essence Don Aire
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white">Bienvenido de vuelta</h2>
            <p className="text-[#666] dark:text-gray-400 mt-1">Inicia sesión para continuar</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  placeholder="tucorreo@essence.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
                <input
                  id="login-password"
                  className={`${inputClass} pr-11`}
                  type={passwordVisibility.inputType}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#C9A227] transition-colors"
                  onClick={passwordVisibility.toggle}
                  aria-label={passwordVisibility.isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {passwordVisibility.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Selector temporal: mientras no hay backend, define el perfil de la sesión. */}
            <div>
              <label htmlFor="login-role" className="block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2">
                Entrar como
              </label>
              <select
                id="login-role"
                className="w-full h-11 px-3 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {ROLE_LIST.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-[#999]">
                {ROLE_LIST.find((option) => option.value === role)?.description}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="w-4 h-4 rounded border-[#ddd] accent-[#C9A227]"
                />
                <span className="text-sm text-[#555] dark:text-gray-400">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#C9A227] hover:underline font-medium"
                onClick={onForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#C9A227] hover:bg-[#b8911f] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              Iniciar sesión
              <span>→</span>
            </button>

            <div className="text-center text-sm text-[#999]">¿No tienes cuenta?</div>

            <button
              type="button"
              className="w-full h-11 bg-transparent border border-[#C9A227] text-[#C9A227] rounded-lg font-semibold hover:bg-[#C9A227]/10 transition-all"
              onClick={onRegister}
            >
              Crear cuenta nueva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { Login };
