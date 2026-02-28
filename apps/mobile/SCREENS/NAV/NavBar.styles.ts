import { Platform } from "react-native";

const SPACING = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 18,
};

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;

type Theme = {
  accent: string;
  muted: string;
  divider: string;
  card: string;
};

export default function makeNavBarStyles(theme: Theme) {
  return {
    tab: {
      activeTintColor: theme.accent,
      inactiveTintColor: theme.muted,

      bar: {
        height: TAB_BAR_HEIGHT,
        paddingTop: SPACING.sm,
        paddingBottom: Platform.OS === "ios" ? SPACING.lg : SPACING.md,
        borderTopWidth: 1,
        borderTopColor: theme.divider,
        backgroundColor: theme.card,

        shadowColor: "#000",
        shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: Platform.OS === "android" ? 8 : 0,
      } as const,

      label: {
        fontSize: 12,
        fontWeight: "700",
        marginTop: SPACING.xs,
      } as const,
    },
  };
}