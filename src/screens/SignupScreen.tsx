import React, { useContext, useState } from "react";
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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import UserContext from "../contexts/UserContext";

const auth = getAuth();

const SignupScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const {setUserId, setUserName} = useContext(UserContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("WelcomeScreen");
  };

  const handleTestSignupButtonPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleSignupButtonPress = async () => {
    if (name === "" || email === "" || password === "") {
      setError(true);
      return;
    } 

    setError(false);

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const response = await fetch('http://10.0.2.2:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
          uid: user.uid,
        }),
      });

      if (response.ok) {
        const {id, username} = await response.json();
        console.log("username ", username);
        setUserId(id);
        setUserName(username);
        alert("Sign Up successful!")
      }

    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setEmail("");
      setPassword("");
    }
  }

  return (
    <View style={styles.container}>
      <Text>sign up</Text>
      <Text style={styles.signupText}>name</Text>
      <TextInput
        style={styles.inputContainer}
        value={name}
        onChangeText={(input) => setName(input)}
      />
      <Text style={styles.signupText}>email</Text>
      <TextInput
        style={styles.inputContainer}
        value={email}
        onChangeText={(input) => setEmail(input)}
      />
      <Text>password</Text>
      <TextInput
        style={styles.inputContainer}
        value={password}
        onChangeText={(input) => setPassword(input)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignupButtonPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {error ? <Text>Oops, something went wrong</Text>: null}

      <Button title="Submit" onPress={handleTestSignupButtonPress}></Button>
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

export default SignupScreen;
