import { Lock, Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';

/**
 * Campo de contraseña con ícono de candado y botón para
 * mostrar/ocultar. Cada instancia maneja su propia visibilidad.
 */
export function PasswordField({ placeholder, value, onChange, error }) {
  const { isVisible, toggle, inputType } = usePasswordVisibility();

  return (
    <FormField
      icon={Lock}
      type={inputType}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      hasTrailingButton
    >
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </FormField>
  );
}
