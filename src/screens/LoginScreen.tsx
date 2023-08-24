// React imports
import { useState } from "react";

// React Native imports
import {
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";

// Local imports
import StyledTextInput from "../components/TextInput";
import { useLogin } from "../../utils/useLogin";

const LoginScreen = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const { handleLogin, showError } = useLogin();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
        <Text testID="login">Login</Text>
        {showError && (
          <Text testID="login-error-message">
            There was a problem logging in. Please try again.
          </Text>
        )}
        <StyledTextInput
          value={emailInput}
          onChangeText={setEmailInput}
          placeholder="Email"
          testID="email-input"
        />
        <StyledTextInput
          value={passwordInput}
          onChangeText={setPasswordInput}
          placeholder="Password"
          secureTextEntry
          testID="password-input"
        />
        <Button
          testID="login-button"
          title="Enter"
          onPress={() => handleLogin(emailInput, passwordInput)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
