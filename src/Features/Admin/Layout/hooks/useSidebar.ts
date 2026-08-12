import { useState, useCallback } from 'react';

/**
 * Estado colapsado/expandido del sidebar del panel admin.
 */
export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setCollapsed(prev => !prev), []);

  return { collapsed, toggle };
}
