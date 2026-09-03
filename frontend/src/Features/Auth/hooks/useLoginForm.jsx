import { useState } from "react";
function useLoginForm({ onLogin } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.();
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleSubmit
  };
}
export {
  useLoginForm
};
