import { useCallback, useState } from "react";

function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => setCollapsed((prev) => !prev), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return { collapsed, mobileOpen, toggle, toggleMobile, closeMobile };
}

export { useSidebar };
