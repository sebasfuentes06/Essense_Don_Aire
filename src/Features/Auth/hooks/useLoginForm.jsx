import { useState } from 'react';

/**
 * Estado y envío del formulario de inicio de sesión.
 * Cuando conecten el backend, la llamada a la API vive aquí.
 */
export function useLoginForm({ onLogin } = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: aquí irá la llamada real al backend de autenticación
    onLogin?.();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
  };
}
