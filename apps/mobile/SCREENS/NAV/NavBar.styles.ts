import { Platform } from "react-native";

const COLORS = {
  active: "#6366F1",
  inactive: "#9CA3AF",
  border: "#EEF2FF",
  background: "#FFFFFF",
};

const SPACING = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 18,
};

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;

const styles = {
  tab: {
    // icon colors
    activeTintColor: COLORS.active,
    inactiveTintColor: COLORS.inactive,

    // bottom tab bar container
    bar: {
      height: TAB_BAR_HEIGHT,
      paddingTop: SPACING.sm,
      paddingBottom: Platform.OS === "ios" ? SPACING.lg : SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.background,

      // shadow (iOS) + elevation (Android)
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: Platform.OS === "android" ? 8 : 0,
    } as const,

    // label style
    label: {
      fontSize: 12,
      fontWeight: "700",
      marginTop: SPACING.xs,
    } as const,
  },
};

export default styles;
