import { Mail, User, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardContent } from '../../../shared/components/ui/Card';
import { AuthLayout, FormField, PasswordField } from '../components/auth';
import { useRegisterForm } from '../hooks/useRegisterForm';

export function Register({ onBack, onRegister }) {
  const { formData, errors, isLoading, handleChange, handleSubmit } = useRegisterForm({ onRegister });

  return (
    <AuthLayout tagline="Únete a nuestra familia de fragancias premium">
      <Card className="shadow-2xl border-border/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Crear cuenta nueva
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa el formulario para registrarte
              </p>
            </div>

            {/* Nombre completo */}
            <FormField
              icon={User}
              type="text"
              placeholder="Nombre completo"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
            />

            {/* Email */}
            <FormField
              icon={Mail}
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            {/* Teléfono */}
            <FormField
              icon={Phone}
              type="tel"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
            />

            {/* Contraseña */}
            <PasswordField
              placeholder="Contraseña"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
            />

            {/* Confirmar contraseña */}
            <PasswordField
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              error={errors.confirmPassword}
            />

            {/* Términos y condiciones */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground flex-1">
                  Acepto los{' '}
                  <button type="button" className="text-primary hover:underline font-medium">
                    términos y condiciones
                  </button>{' '}
                  y la{' '}
                  <button type="button" className="text-primary hover:underline font-medium">
                    política de privacidad
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1.5 text-sm text-destructive">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Enviar */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Crear cuenta
            </Button>

            {/* Volver al login */}
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
