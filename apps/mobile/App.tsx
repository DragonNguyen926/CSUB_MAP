import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { NavBar } from "./SCREENS/NAV/NavBar";
import { ThemeProvider } from "./SCREENS/NAV/ThemeProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <NavBar />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}