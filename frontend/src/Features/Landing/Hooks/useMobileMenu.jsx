import { useState, useCallback } from "react";
function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, toggle, close };
}
export {
  useMobileMenu
};
