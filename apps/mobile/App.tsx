import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { NavBar } from "./SCREENS/NAV/NavBar";

export default function App() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}