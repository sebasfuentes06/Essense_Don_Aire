import { useEffect, useState } from "react";
import { api, ApiError } from "../../../shared/api";

/**
 * "¿Olvidaste tu contraseña?" contra la API (igual que la app móvil):
 *  1. Se pide el código: llega un código de 6 dígitos al correo registrado.
 *  2. Se escribe el código y la contraseña nueva.
 * El código vence en 15 minutos y se invalida tras 5 intentos fallidos.
 */
function useForgotPassword() {
  const [step, setStep] = useState("correo"); // correo | codigo | listo
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const requestCode = async (e) => {
    e?.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Escribe un correo válido.");
      return;
    }
    setIsLoading(true);
    try {
      const r = await api.post("/auth/olvide", { correo: email.trim() }, { auth: false });
      setInfo(r?.mensaje ?? "Si el correo tiene cuenta, te enviamos un código.");
      setWait(r?.datos?.reenviar_en ?? 60);
      setStep("codigo");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo enviar el código.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code.trim())) return setError("El código tiene 6 números.");
    if (password.length < 8) return setError("La contraseña nueva debe tener al menos 8 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    setIsLoading(true);
    try {
      await api.post("/auth/restablecer", { correo: email.trim(), codigo: code.trim(), nueva: password }, { auth: false });
      setStep("listo");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step, setStep, email, setEmail, code, setCode, password, setPassword, confirm, setConfirm,
    error, info, isLoading, wait, requestCode, resetPassword
  };
}

export { useForgotPassword };
