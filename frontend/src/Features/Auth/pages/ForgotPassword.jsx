import { Mail, ArrowLeft, CheckCircle, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { AuthLayout, FormField, PasswordField } from "../components/auth";
import { useForgotPassword } from "../hooks/useForgotPassword";

function Aviso({ texto }) {
  if (!texto) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5">
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
      <p className="text-sm text-destructive">{texto}</p>
    </div>
  );
}

function ForgotPassword({ onBack }) {
  const f = useForgotPassword();

  const volver = (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={onBack}
    >
      <ArrowLeft className="h-4 w-4" />
      Volver al inicio de sesión
    </button>
  );

  return (
    <AuthLayout>
      <Card>
        <CardContent>
          {f.step === "correo" && (
            <form className="space-y-6" onSubmit={f.requestCode} noValidate>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¿Olvidaste tu contraseña?</h2>
                <p className="text-sm text-muted-foreground">
                  Escribe el correo de tu cuenta y te enviaremos un código de 6 dígitos.
                </p>
              </div>
              <FormField
                icon={Mail}
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={f.email}
                onChange={(e) => f.setEmail(e.target.value)}
              />
              <Aviso texto={f.error} />
              <Button type="submit" className="w-full" disabled={f.isLoading}>
                {f.isLoading ? "Enviando..." : "Enviar código"}
              </Button>
              {volver}
            </form>
          )}

          {f.step === "codigo" && (
            <form className="space-y-5" onSubmit={f.resetPassword} noValidate>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Revisa tu correo</h2>
                <p className="text-sm text-muted-foreground">{f.info} Revisa también la carpeta de spam.</p>
              </div>
              <FormField
                icon={KeyRound}
                inputMode="numeric"
                placeholder="Código de 6 dígitos"
                value={f.code}
                onChange={(e) => f.setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <PasswordField placeholder="Contraseña nueva (mínimo 8)" value={f.password} onChange={f.setPassword} />
              <PasswordField placeholder="Repite la contraseña nueva" value={f.confirm} onChange={f.setConfirm} />
              <Aviso texto={f.error} />
              <Button type="submit" className="w-full" disabled={f.isLoading}>
                {f.isLoading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
              <button
                type="button"
                disabled={f.wait > 0 || f.isLoading}
                onClick={f.requestCode}
                className="w-full text-sm text-primary disabled:text-muted-foreground"
              >
                {f.wait > 0 ? `Reenviar código en ${f.wait} s` : "Reenviar código"}
              </button>
              {volver}
            </form>
          )}

          {f.step === "listo" && (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-2">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¡Contraseña actualizada!</h2>
                <p className="text-sm text-muted-foreground">Ya puedes iniciar sesión con tu contraseña nueva.</p>
              </div>
              <Button className="w-full" onClick={onBack}>Ir a iniciar sesión</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export { ForgotPassword };
