import React, {useState, useContext} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import UserContext from "../contexts/UserContext";

const auth = getAuth();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const {setUserId, setUserName} = useContext(UserContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("WelcomeScreen");
  };

  const handleTestLoginButtonPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleLoginButtonPress = async () => {
    if (email === "" || password === "") {
      setError(true);
      return;
    }

    setError(false);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      if (user !== null) {
        const response = await fetch('http://10.0.2.2:8080/login/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      if (response.ok) {
        const {id, username} = await response.json();
        console.log("USERNAME ", username);
        setUserId(id);
        setUserName(username);
        alert("Login successful!");
        setEmail("");
        setPassword("");
      }
      } else {
        setError(true);
      }
    } catch (error) {
      // console.error(error);
      setError(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text>login</Text>
      <Text style={styles.signupText}>email</Text>
      <TextInput style={styles.inputContainer} value={email} onChangeText={(input) => setEmail(input)}></TextInput>
      <Text>password</Text>
      <TextInput style={styles.inputContainer} value={password} onChangeText={(input) => setPassword(input)} secureTextEntry></TextInput>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLoginButtonPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text>Oops, something went wrong</Text>: null}
      
      <Button title="Submit" onPress={handleTestLoginButtonPress}></Button>
      <Button title="Back" onPress={handleBackPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#FFFDD0",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 200,
    height: 50,
    backgroundColor: "rgba(1,90,131,255)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  inputContainer: {
    width: 200,
    height: 50,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 1,
    padding: 10,
  },
  signupText: {
    textAlign: "left",
  },
});

export default LoginScreen;
