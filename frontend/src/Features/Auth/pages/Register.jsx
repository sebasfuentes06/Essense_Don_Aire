import { Mail, User, Phone, ArrowLeft, ShoppingBag, Briefcase } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { AuthLayout, FormField, PasswordField } from "../components/auth";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { ROLES } from "../../../shared/auth";

/** Perfiles que una persona puede elegir al registrarse por su cuenta. */
const SELF_SERVICE_ROLES = [
  {
    value: ROLES.CLIENT,
    label: "Cliente",
    description: "Quiero explorar el catálogo y comprar fragancias",
    icon: ShoppingBag
  },
  {
    value: ROLES.SELLER,
    label: "Vendedor",
    description: "Trabajo en Essence Don Aire y registro ventas",
    icon: Briefcase
  }
];

function Register({ onBack }) {
  const { formData, errors, isLoading, handleChange, handleSubmit } = useRegisterForm();

  return (
    <AuthLayout tagline="Crea tu cuenta y descubre nuestras fragancias">
      <Card>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Crear cuenta nueva</h2>
              <p className="text-sm text-muted-foreground">Completa el formulario para registrarte</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
              <FormField
                icon={User}
                name="fullName"
                placeholder="Ej. Laura Gómez"
                value={formData.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                error={errors.fullName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico</label>
              <FormField
                icon={Mail}
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <FormField
                icon={Phone}
                name="phone"
                placeholder="+57 300 000 0000"
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                error={errors.phone}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
              <PasswordField
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                error={errors.password}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmar contraseña</label>
              <PasswordField
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(value) => handleChange("confirmPassword", value)}
                error={errors.confirmPassword}
              />
            </div>

            {/* El perfil elegido define las vistas a las que entra la persona. */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">¿Cómo vas a usar la plataforma?</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {SELF_SERVICE_ROLES.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("role", option.value)}
                      aria-pressed={isSelected}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-input bg-input-background hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-semibold text-foreground">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="mt-1.5 text-sm text-destructive">{errors.role}</p>}
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
                  Acepto los{" "}
                  <button type="button" className="text-primary hover:underline font-medium">
                    términos y condiciones
                  </button>{" "}
                  y la{" "}
                  <button type="button" className="text-primary hover:underline font-medium">
                    política de privacidad
                  </button>
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1.5 text-sm text-destructive">{errors.acceptTerms}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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
