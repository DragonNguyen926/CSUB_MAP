import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SettingPage } from "../SETTINGPAGE/SettingPage"
import { AuthPage } from "../SETTINGPAGE/AuthPage"
import {FriendsPage} from  "../SETTINGPAGE/FriendsPage" // đổi path đúng theo project của bạn
import { ProfileSettingsPage } from "../SETTINGPAGE/ProfileSettingsPage"
export type SettingsStackParamList = {
  SettingsHome: undefined
  Auth: undefined
  Friends: undefined
  ProfileSettings: undefined
}

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingPage} />
      <Stack.Screen name="Auth" component={AuthPage} />
      <Stack.Screen name="Friends" component={FriendsPage} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsPage} />
    </Stack.Navigator>
  )
}