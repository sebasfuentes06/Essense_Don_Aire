import { useState, useCallback } from "react";
function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((prev) => !prev), []);
  return { collapsed, toggle };
}
export {
  useSidebar
};
