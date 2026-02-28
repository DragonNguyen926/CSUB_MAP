import { useTheme } from "../NAV/ThemeProvider"; 
import React from "react"
import { View, Text } from "react-native"

export function MapPage() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.bg }}>
      <Text style={{ color: theme.text}}>Map Page</Text>
    </View>
  )
};