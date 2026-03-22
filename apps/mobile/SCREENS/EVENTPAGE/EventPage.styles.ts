import { StyleSheet, Platform } from "react-native"
import type { AppTheme } from "../NAV/ThemeProvider"

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.bg,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 0,
    },

    header: {
      paddingTop: 8,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    avatar: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.5,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: 0.2,
    },

    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    createBtn: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 3 },
      }),
    },

    createBtnText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 13,
    },

    weekRow: {
      marginTop: 8,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    weekTitleWrap: {
      flexDirection: "column",
      gap: 3,
    },

    weekTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: theme.text,
    },

    weekSub: {
      fontSize: 12,
      color: theme.muted,
      fontWeight: "600",
    },

    weekNavWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    weekNavBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
    },

    tabsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
    },

    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
    },

    tabActive: {
      backgroundColor: theme.iconBoxBg,
      borderColor: theme.accent,
    },

    tabText: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.muted,
      letterSpacing: 0.2,
    },

    tabTextActive: {
      color: theme.accent,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text,
    },

    countPill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    countPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.muted,
    },

    card: {
      borderRadius: 18,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      overflow: "hidden",
      marginBottom: 14,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        android: { elevation: 2 },
      }),
    },

    flyer: {
      width: "100%",
      height: 160,
      backgroundColor: theme.iconBoxBg,
    },

    flyerPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
      gap: 10,
    },

    flyerPlaceholderTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: theme.text,
    },

    flyerPlaceholderSub: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
      textAlign: "center",
    },

    cardBody: {
      padding: 14,
      gap: 10,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
    },

    title: {
      flex: 1,
      fontSize: 15,
      fontWeight: "900",
      color: theme.text,
      lineHeight: 20,
    },

    orgText: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "800",
      color: theme.muted,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10,
    },

    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.iconBoxBg,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    metaText: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.muted,
    },

    addressText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
      lineHeight: 16,
    },

    footerRow: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    timePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.pillBg,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    timeText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.accent,
    },

    navBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: theme.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    navBtnText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    emptyWrap: {
      marginTop: 22,
      padding: 18,
      borderRadius: 18,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      gap: 8,
    },

    emptyTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: theme.text,
    },

    emptySub: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
      textAlign: "center",
      lineHeight: 16,
    },

    createBtnWrap: {
      marginTop: 16,
      marginBottom: 0,
    },

    createButton: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    createButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  })