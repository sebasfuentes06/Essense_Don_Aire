import { ArrowLeft, AlertCircle, MailCheck } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { AuthLayout, PasswordField } from "../components/auth";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { CamposPersona } from "../../../shared/persona";
import { useState } from "react";

/**
 * Crear cuenta. Mismos campos y mismo orden que la app móvil:
 * nombre, tipo y número de documento, celular, municipio de Antioquia,
 * dirección, correo y contraseña. La cuenta queda pendiente de aprobación.
 */
function Register({ onBack }) {
  const { formData, errors, serverError, isLoading, sentMessage, handleChange, handleSubmit } = useRegisterForm();
  const [verPolitica, setVerPolitica] = useState(false);

  if (sentMessage) {
    return (
      <AuthLayout tagline="Crea tu cuenta y descubre nuestras fragancias">
        <Card>
          <CardContent>
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
                <MailCheck className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¡Solicitud enviada!</h2>
                <p className="text-sm text-muted-foreground">{sentMessage}</p>
              </div>
              <Button className="w-full" onClick={onBack}>Ir a iniciar sesión</Button>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout tagline="Crea tu cuenta y descubre nuestras fragancias">
      <Card>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Crear cuenta nueva</h2>
              <p className="text-sm text-muted-foreground">
                Llena tus datos. La administradora revisará tu solicitud y te avisaremos por correo cuando puedas entrar.
              </p>
            </div>

            <CamposPersona
              valor={formData}
              onCambio={(persona) => handleChange(persona)}
              errores={errors}
              correoObligatorio
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contraseña *</label>
              <PasswordField
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                error={errors.password}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmar contraseña *</label>
              <PasswordField
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(value) => handleChange("confirmPassword", value)}
                error={errors.confirmPassword}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(event) => handleChange("acceptTerms", event.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-input accent-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground flex-1">
                  Acepto el tratamiento de mis datos personales.{" "}
                  <button type="button" className="text-primary hover:underline font-medium" onClick={() => setVerPolitica((v) => !v)}>
                    {verPolitica ? "Ocultar política" : "Leer la política"}
                  </button>
                </span>
              </label>
              {verPolitica && (
                <p className="mt-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  Essence Don Aire (La Pintada, Antioquia) usará tu nombre, documento, celular, dirección y correo únicamente
                  para gestionar tus pedidos, compras, pagos y facturas, y para contactarte sobre ellos. No compartimos tus datos
                  con terceros. Puedes conocer, actualizar, rectificar o pedir la eliminación de tus datos escribiéndonos por
                  WhatsApp, conforme a la Ley 1581 de 2012 (Habeas Data).
                </p>
              )}
              {errors.acceptTerms && <p className="mt-1.5 text-sm text-destructive">{errors.acceptTerms}</p>}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{serverError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar solicitud"}
            </Button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export { Register };
