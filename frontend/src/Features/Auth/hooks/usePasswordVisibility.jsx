import { useState, useCallback } from "react";
function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = useCallback(() => setIsVisible((prev) => !prev), []);
  return {
    isVisible,
    toggle,
    /** Tipo listo para pasar al <input type={...}> */
    inputType: isVisible ? "text" : "password"
  };
}
export {
  usePasswordVisibility
};
