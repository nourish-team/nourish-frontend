import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import UserContext from "../contexts/UserContext";

const auth = getAuth();

const SignupScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { setUserId, setUserName } = useContext(UserContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("WelcomeScreen");
  };

  const handleSignupButtonPress = async () => {
    if (name === "" || email === "" || password === "") {
      setError(true);
      return;
    }

    setError(false);

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      const response = await fetch("https://nourishskin.herokuapp.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          uid: user.uid,
        }),
      });

      if (response.ok) {
        const { id, username } = await response.json();
        console.log("username ", username);
        setUserId(id);
        setUserName(username);
        alert("Sign Up successful!");
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.formTop}>
          <Text style={styles.signupText}>sign up</Text>
          <Text style={styles.signupText} onPress={handleBackPress}>
            ✖︎
          </Text>
        </View>
        <View style={styles.formBottom}>
          <View style={styles.textBubbleContainer}>
            <Image
              source={require("../../assets/images/nourish_logo.png")}
              style={styles.tinyLogo}
            />
            <View style={styles.leftArrow} />
            <View style={styles.textBubble}>
              <Text style={styles.textBubbleText}>join nourish?</Text>
            </View>
          </View>
          {error ? (
            <View style={styles.textBubbleContainer}>
              <Image
                source={require("../../assets/images/nourish_logo.png")}
                style={styles.tinyLogo}
              />
              <View style={styles.leftArrow} />
              <View style={styles.textBubble}>
                <Text style={styles.textBubbleText}>
                  oops... something {"\n"} went wrong
                </Text>
              </View>
            </View>
          ) : null}
          <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
          <Text style={styles.containerText}>name</Text>
          <TextInput
            style={styles.inputContainer}
            value={name}
            onChangeText={(input) => setName(input)}
          />
          <Text style={styles.containerText}>email</Text>
          <TextInput
            style={styles.inputContainer}
            value={email}
            onChangeText={(input) => setEmail(input)}
          />
          <Text style={styles.containerText}>password</Text>
          <TextInput
            style={styles.inputContainer}
            value={password}
            onChangeText={(input) => setPassword(input)}
            secureTextEntry
          />

          <View style={styles.buttonParentContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSignupButtonPress}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#B7C4CF",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 60,
    height: 60,
    marginLeft: -20,
  },
  formTop: {
    height: 50,
    borderColor: "rgba(1,90,131,255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    backgroundColor: "#EEE3CB",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  formBottom: {
    backgroundColor: "white",
    padding: 40,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
  },
  backButton: {
    backgroundColor: "#EEE3CB",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    height: 40,
    width: 100,
    marginTop: 16,
  },
  backButtonText: {
    color: "rgba(1,90,131,255)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  buttonContainer: {
    backgroundColor: "rgba(1,90,131,255)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    height: 40,
    width: 100,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  inputContainer: {
    width: 210,
    height: 50,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
  },
  containerText: {
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    fontSize: 18,
    marginBottom: 5,
  },
  signupText: {
    fontFamily: "Lato-Bold",
    padding: 10,
    color: "rgba(1,90,131,255)",
    fontSize: 20,
  },
  textBubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -15,
    marginBottom: 20,
  },
  leftArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: "#D0D0D0",
    transform: [{ rotate: "-270deg" }],
  },
  textBubble: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 10,
    maxWidth: "80%",
  },
  textBubbleText: {
    fontSize: 16,
  },
  buttonParentContainer: {
    flexDirection: "row",
    gap: 15,
  },
  separator: {
    color: "rgba(1,90,131,255)",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default SignupScreen;
