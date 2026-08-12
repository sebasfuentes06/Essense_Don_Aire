import { useEffect, useRef } from 'react';

/**
 * Ejecuta un callback cuando se hace clic FUERA del elemento referenciado.
 * Úsalo para cerrar dropdowns, menús y popovers.
 *
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 * <div ref={ref}>...</div>
 */
export function useClickOutside<T extends HTMLElement>(onOutsideClick: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOutsideClick]);

  return ref;
}
