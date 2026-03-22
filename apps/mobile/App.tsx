import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider, useTheme } from "./SCREENS/NAV/ThemeProvider"
import { NavBar } from "./SCREENS/NAV/NavBar"
import { AuthProvider } from "./SCREENS/SETTINGPAGE/AUTH/AuthContext"

function AppNavigator() {
  const { navTheme } = useTheme()

  return (
    <NavigationContainer theme={navTheme}>
      <NavBar />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}