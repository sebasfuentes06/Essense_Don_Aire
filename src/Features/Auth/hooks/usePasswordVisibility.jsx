import { useState, useCallback } from 'react';

/**
 * Hook para mostrar/ocultar una contraseña.
 * Usado en Login (1 vez) y Register (2 veces: contraseña y confirmación).
 */
export function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = useCallback(() => setIsVisible(prev => !prev), []);

  return {
    isVisible,
    toggle,
    /** Tipo listo para pasar al <input type={...}> */
    inputType: isVisible ? 'text' : 'password'
  };
}
