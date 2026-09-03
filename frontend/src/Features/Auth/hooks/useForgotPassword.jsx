import { useState } from "react";
function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };
  const reset = () => {
    setIsSubmitted(false);
    setEmail("");
  };
  return {
    email,
    setEmail,
    isSubmitted,
    isLoading,
    handleSubmit,
    reset
  };
}
export {
  useForgotPassword
};
