import { useState, useCallback } from 'react';

/**
 * Hook que encapsula el estado del menú móvil de la navbar.
 * Expone el estado y acciones semánticas (toggle / close).
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, close };
}
