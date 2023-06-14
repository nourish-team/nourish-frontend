import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
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
      <Text style={styles.titleText}>nourish.</Text>
      <Image
        style={styles.tinyLogo}
        source={require("../../assets/images/nourish_logo.png")}
      />
      <Text style={styles.copyrightText}>© 2023</Text>
      <Text style={styles.infoText}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
        quo, culpa commodi, placeat quidem quaerat omnis itaque nulla hic porro
        animi non?
      </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#FFFDD0",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  titleText: {
    textAlign: "center",
    fontSize: 50,
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
    marginBottom: 20,
  },
  infoText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    lineHeight: 25,
    width: 250,
    marginBottom: 30,
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
});

export default WelcomeScreen;
