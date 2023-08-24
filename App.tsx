// Library and package imports
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

// Authentication
import "./config/firebase";

// Nav
import RootNav from "./src/navigation/root";

// Context
import { UserProvider } from "./src/contexts/UserContext";

// Font
import { loadFonts } from "./utils/fontLoader";

export default function App() {
  useEffect(() => {
    const fontSetup = async () => {
      try {
        await loadFonts();
      } catch (error) {
        console.error("Error loading fonts: ", error);
      }
    };
    fontSetup();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#B7C4CF" />
      <UserProvider>
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
      </UserProvider>
    </>
  );
}
