/**
 * Input con ícono a la izquierda y mensaje de error debajo.
 * Usa los tokens de diseño (input-background, primary, destructive...).
 * `children` permite inyectar un botón al final (ej. mostrar contraseña).
 */
export function FormField({
  icon: Icon,
  error,
  hasTrailingButton = false,
  children,
  ...inputProps
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <input
          {...inputProps}
          className={`w-full h-12 pl-11 ${hasTrailingButton ? 'pr-11' : 'pr-4'} rounded-xl bg-input-background border ${
            error ? 'border-destructive' : 'border-input'
          } text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {children}
      </div>
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
