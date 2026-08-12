import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardContent } from '../../../shared/components/ui/Card';


import { AuthLayout, FormField } from '../components/auth';
import { useForgotPassword } from '../hooks/useForgotPassword';

export function ForgotPassword({ onBack }) {
  const { email, setEmail, isSubmitted, isLoading, handleSubmit, reset } = useForgotPassword();

  return (
    <AuthLayout tagline="Fragancias premium para momentos inolvidables">
      <Card className="shadow-2xl border-border/50 backdrop-blur-sm">
        <CardContent className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-sm text-muted-foreground">
                  No te preocupes, te enviaremos instrucciones para recuperarla
                </p>
              </div>

              {/* Email */}
              <FormField
                icon={Mail}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Enviar */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
              >
                Enviar instrucciones
              </Button>

              {/* Volver al login */}
              <button
                type="button"
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              {/* Ícono de éxito */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-2">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  ¡Correo enviado!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Te hemos enviado un correo a <span className="font-semibold text-foreground">{email}</span> con las instrucciones para recuperar tu contraseña.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-foreground">
                  No olvides revisar tu carpeta de spam si no recibes el correo en los próximos minutos.
                </p>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={onBack}
                >
                  Volver al inicio de sesión
                </Button>

                <button
                  type="button"
                  onClick={reset}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Enviar nuevamente
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
