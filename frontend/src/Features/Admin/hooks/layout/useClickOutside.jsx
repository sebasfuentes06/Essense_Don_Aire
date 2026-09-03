import { useEffect, useRef } from "react";
function useClickOutside(onOutsideClick) {
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutsideClick]);
  return ref;
}
export {
  useClickOutside
};
