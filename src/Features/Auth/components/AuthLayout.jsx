import { Sparkles } from 'lucide-react';

/**
 * Layout compartido por Register y ForgotPassword:
 * fondo con degradado y blobs decorativos, encabezado de marca y footer.
 */
export function AuthLayout({ tagline, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo y marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Essence Don Aire
          </h1>
          <p className="text-muted-foreground">{tagline}</p>
        </div>

        {children}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2026 Essence Don Aire. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
