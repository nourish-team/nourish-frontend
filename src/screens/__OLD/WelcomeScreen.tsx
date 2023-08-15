import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSignUpPress = () => {
    navigation.navigate("Signup");
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>nourish.</Text>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/nourish-logo-sparkles.png")}
        />
      </View>
      <View>
        <View style={styles.infoContainerTop}>
          <Text style={styles.infoHeaderText}>⊹⊹⊹</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Start your personalized skincare journey today!
          </Text>
          <View style={styles.buttonParentContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSignUpPress}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLoginPress}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.copyrightText}>© 2023</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  titleContainer: {
    marginTop: 70,
    alignItems: "center",
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  titleText: {
    textAlign: "center",
    fontSize: 65,
    fontFamily: "PlayfairDisplay-Bold",
    color: "rgba(1,90,131,255)",
    marginBottom: 20,
    marginTop: -20,
  },
  copyrightText: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "PlayfairDisplay-Bold",
    color: "rgba(1,90,131,255)",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#EEE3CB",
    padding: 10,
    borderRadius: 50,
  },
  infoContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
  },
  infoContainerTop: {
    borderColor: "rgba(1,90,131,255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    height: 30,
    backgroundColor: "#EEE3CB",
  },
  infoHeaderText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    textAlign: "right",
    paddingRight: 10,
  },
  infoText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Lato-BoldItalic",
    color: "rgba(1,90,131,255)",
    lineHeight: 25,
    width: 250,
    marginTop: 30,
    marginBottom: 30,
    padding: 10,
  },
  buttonParentContainer: {
    flexDirection: "row",
    gap: 15,
  },
  buttonContainer: {
    width: 130,
    height: 50,
    backgroundColor: "white",
    borderColor: "rgba(1,90,131,255)",
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "rgba(1,90,131,255)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
});

export default WelcomeScreen;
