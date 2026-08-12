import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { BrandPanel } from '../components/auth';
import { useLoginForm } from '../hooks/useLoginForm';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';

export function Login({ onLogin, onRegister, onForgotPassword }) {
  const {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    handleSubmit,
  } = useLoginForm({ onLogin });
  const passwordVisibility = usePasswordVisibility();

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a0a]">
      {/* PANEL IZQUIERDO - Imagen y marca */}
      <BrandPanel />

      {/* PANEL DERECHO - Formulario de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121212] p-8">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white tracking-wide">ESSENCE DON AIRE</h1>
          </div>

          {/* Encabezado desktop */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#C9A227]" />
              <span className="text-[#C9A227] tracking-widest uppercase text-xs font-semibold">Essence Don Aire</span>
            </div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-white">Bienvenido de vuelta</h2>
            <p className="text-[#666] dark:text-gray-400 mt-1">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] dark:text-gray-200 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
                <input
                  type={passwordVisibility.inputType}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-white dark:bg-[#1e1e1e] border border-[#e0ddd8] dark:border-[#333] text-[#1a1a1a] dark:text-white placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={passwordVisibility.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#C9A227] transition-colors"
                >
                  {passwordVisibility.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Recordarme y olvidé contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ddd] accent-[#C9A227]"
                />
                <span className="text-sm text-[#555] dark:text-gray-400">Recordarme</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#C9A227] hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Enviar */}
            <button
              type="submit"
              className="w-full h-11 bg-[#C9A227] hover:bg-[#b8911f] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              Iniciar sesión
              <span>→</span>
            </button>

            {/* Divisor */}
            <div className="text-center text-sm text-[#999]">¿No tienes cuenta?</div>

            {/* Registro */}
            <button
              type="button"
              onClick={onRegister}
              className="w-full h-11 bg-transparent border border-[#C9A227] text-[#C9A227] rounded-lg font-semibold hover:bg-[#C9A227]/10 transition-all"
            >
              Crear cuenta nueva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
