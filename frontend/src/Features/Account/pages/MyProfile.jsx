import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/Badge";
import { useAuth } from "../../../shared/auth";

/**
 * "Mi perfil": la comparten los tres roles.
 *
 * Story mapping:
 *  - Vendedor > Modulo Usuario: "Ver su propio perfil / Editar sus datos basicos".
 *  - Cliente  > Modulo Cliente: "Ver sus propios datos / Editar sus datos".
 * Por eso el rol se muestra pero NO se puede cambiar desde aqui.
 */
/** Input + mensaje de error (el Input compartido solo marca aria-invalid). */
function Field({ error, children }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function MyProfile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? ""
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "El nombre es obligatorio.";
    if (!form.email.trim()) {
      nextErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "El correo electrónico no tiene un formato válido.";
    }
    if (form.phone.trim() && !/^[+()\d\s-]{7,}$/.test(form.phone.trim())) {
      nextErrors.phone = "El teléfono solo puede incluir números, espacios y signos básicos.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateProfile({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim()
    });
    setSaved(true);
  };

  const initials = (form.name || "?")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
        <p className="text-muted-foreground mt-1">Consulta y actualiza tus datos de cuenta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent>
            <div className="flex flex-col items-center text-center py-4">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-primary-foreground">{initials}</span>
              </div>
              <p className="font-semibold text-foreground">{form.name || "Sin nombre"}</p>
              <p className="text-sm text-muted-foreground break-all">{form.email}</p>
              <div className="mt-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <Badge variant="info">{user?.role ?? "Sin rol"}</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                El perfil lo asigna un administrador y no puede cambiarse desde aquí.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Datos personales</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field error={errors.name}>
                <Input
                  label="Nombre completo"
                  name="name"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  error={errors.name}
                  required
                />
              </Field>
              <Field error={errors.email}>
                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  error={errors.email}
                  required
                />
              </Field>
              <Field error={errors.phone}>
                <Input
                  label="Teléfono"
                  name="phone"
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  error={errors.phone}
                  placeholder="+57 300 000 0000"
                />
              </Field>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Guardar cambios</Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-success">
                    <Check className="h-4 w-4" />
                    Cambios guardados
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { MyProfile };
