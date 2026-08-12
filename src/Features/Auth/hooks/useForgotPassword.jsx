import { useState } from 'react';

/**
 * Estado y envío del flujo "olvidé mi contraseña".
 * Maneja email, loading y el cambio a la vista de éxito.
 */
export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula la llamada a la API — reemplazar por la llamada real al backend
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const reset = () => {
    setIsSubmitted(false);
    setEmail('');
  };

  return {
    email,
    setEmail,
    isSubmitted,
    isLoading,
    handleSubmit,
    reset,
  };
}
