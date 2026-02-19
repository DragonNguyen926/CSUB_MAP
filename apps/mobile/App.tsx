import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { NavBar } from "./SCREENS/NAV/NavBar";

export default function App() {
  useEffect(() => {
    console.log("SUPABASE URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log(
      "SUPABASE KEY (first 6):",
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 6)
    );
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

