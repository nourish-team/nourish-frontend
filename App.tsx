// Library and package imports
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";

// Authentication
import { useAuthentication } from "./utils/hooks/useAuthentication";
import "./config/firebase";

// Components
import RootNavigation from "./src/navigation";
import LoadingScreen from "./src/screens/LoadingScreen";

// Context
import { AppContext } from "./src/contexts/AppContext";
import UserContext from "./src/contexts/UserContext";

export default function App() {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Use Effects
  // Loading Delay for the looks
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
    };
    loadFonts();
  }, []);

  // Helpers
  const fetchFonts = () => {
    return Font.loadAsync({
      "PlayfairDisplay-Bold": require("./assets/fonts/PlayfairDisplay-Bold.ttf"),
      "PlayfairDisplay-BoldItalic": require("./assets/fonts/PlayfairDisplay-BoldItalic.ttf"),
      "PlayfairDisplay-Medium": require("./assets/fonts/PlayfairDisplay-Medium.ttf"),
      "PlayfairDisplay-Regular": require("./assets/fonts/PlayfairDisplay-Regular.ttf"),
      "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
      "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    });
  };

  // Loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#B7C4CF" />
      <UserContext.Provider
        value={{ userId, setUserId, userName, setUserName }}
      >
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </UserContext.Provider>
    </>
  );
}
