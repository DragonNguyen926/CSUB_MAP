import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { EventsStack } from "./EventsStack";
import makeNavBarStyles from "./NavBar.styles";
import { HomePage } from "../HOMEPAGE/HomePage";
import { MapPage } from "../MAPPAGE/MapPage";
import { SettingPage } from "../SETTINGPAGE/SettingPage";
import { useTheme } from "../NAV/ThemeProvider";

export type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  Events: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function getIconName(routeName: keyof RootTabParamList, focused: boolean) {
  switch (routeName) {
    case "Home":
      return focused ? "home" : "home-outline";
    case "Map":
      return focused ? "map" : "map-outline";
    case "Events":
      return focused ? "calendar" : "calendar-outline";
    case "Settings":
      return focused ? "settings" : "settings-outline";
    default:
      return "ellipse";
  }
}

export function NavBar() {
  const { theme } = useTheme();

  // ✅ create themed styles once per theme change
  const styles = useMemo(() => makeNavBarStyles(theme), [theme]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, size, color }) => {
          const iconName = getIconName(route.name as keyof RootTabParamList, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: styles.tab.activeTintColor,
        tabBarInactiveTintColor: styles.tab.inactiveTintColor,
        tabBarStyle: styles.tab.bar,
        tabBarLabelStyle: styles.tab.label,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Map" component={MapPage} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Settings" component={SettingPage} />
    </Tab.Navigator>
  );
}