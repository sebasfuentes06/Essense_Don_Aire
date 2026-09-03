import { useState, useCallback } from "react";
import { useClickOutside } from "./useClickOutside";
const SAMPLE_NOTIFICATIONS = [
  { id: 1, description: "3 productos necesitan reabastecimiento" },
  { id: 2, description: "Venta #1234 - $150.00" }
];
function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState(SAMPLE_NOTIFICATIONS);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const containerRef = useClickOutside(close);
  const hasUnread = notifications.length > 0;
  return { isOpen, toggle, close, containerRef, notifications, hasUnread };
}
export {
  useNotifications
};
