import { useState, useCallback } from 'react';
import { useClickOutside } from './useClickOutside';

export interface Notification {
  id: number;
  title: string;
  description: string;
}

/**
 * Datos de ejemplo — reemplazar por notificaciones reales del backend.
 */
const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Stock bajo detectado', description: '3 productos necesitan reabastecimiento' },
  { id: 2, title: 'Nueva venta registrada', description: 'Venta #1234 - $150.00' },
];

/**
 * Estado del dropdown de notificaciones:
 * abierto/cerrado, cierre al hacer clic afuera y la lista de notificaciones.
 */
export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const containerRef = useClickOutside<HTMLDivElement>(close);

  const hasUnread = notifications.length > 0;

  return { isOpen, toggle, close, containerRef, notifications, hasUnread };
}
