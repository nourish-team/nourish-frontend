// React imports
import { useState } from "react";

// Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Local imports
import { useUser } from "../src/contexts/UserContext";

export const useLogin = () => {
  const auth = getAuth();
  const { saveUsername } = useUser();
  const [showError, setShowError] = useState(false);

  const handleLogin = async (emailInput: string, passwordInput: string) => {
    if (emailInput.length < 1 && passwordInput.length < 1) {
      setShowError(true);
      return;
    }
    try {
      setShowError(false);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );

      if (userCredentials.user) {
        const email = userCredentials.user.email;
        if (email) {
          saveUsername(email);
        }
      }
    } catch (error) {
      console.error(error);
      setShowError(true);
    }
  };

  return {
    handleLogin,
    showError,
    setShowError,
  };
};
