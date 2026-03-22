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
      paddingBottom: 60,
      paddingTop: 12,
    },

    header: {
      paddingTop: 8,
      paddingBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 2 },
      }),
    },

    headerTitleWrap: {
      flex: 1,
      marginLeft: 10,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.text,
      letterSpacing: 0.2,
    },

    headerSub: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
    },

    card: {
      borderRadius: 18,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      padding: 14,
      marginBottom: 14,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.07,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        android: { elevation: 2 },
      }),
    },

    cardTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 10,
    },

    fieldLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    fieldLabel: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.muted,
      letterSpacing: 0.2,
    },

    required: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.accent,
    },

    input: {
      width: "100%",
      borderRadius: 14,
      backgroundColor: theme.iconBoxBg,
      borderWidth: 1,
      borderColor: theme.divider,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
    },

    inputFocusedHint: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
    },

    inputError: {
      borderColor: "rgba(239, 68, 68, 0.55)",
      backgroundColor: "rgba(239, 68, 68, 0.06)",
    },

    errorText: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: "800",
      color: "rgba(220, 38, 38, 0.95)",
    },

    textarea: {
      minHeight: 104,
      textAlignVertical: "top",
      paddingTop: 12,
    },

    row: {
      flexDirection: "row",
      gap: 10,
    },

    col: {
      flex: 1,
    },

    dayPillsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 6,
    },

    dayPill: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
    },

    dayPillActive: {
      backgroundColor: theme.iconBoxBg,
      borderColor: theme.accent,
    },

    dayPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.muted,
    },

    dayPillTextActive: {
      color: theme.accent,
    },

    selectBtn: {
      width: "100%",
      borderRadius: 14,
      backgroundColor: theme.iconBoxBg,
      borderWidth: 1,
      borderColor: theme.divider,
      paddingHorizontal: 12,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    selectText: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.text,
    },

    selectPlaceholder: {
      color: theme.muted,
      fontWeight: "800",
    },

    selectRightHint: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.muted,
    },

    flyerBox: {
      width: "100%",
      height: 160,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: theme.iconBoxBg,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },

    flyerTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 6,
      textAlign: "center",
    },

    flyerSub: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
      textAlign: "center",
      lineHeight: 16,
    },

    uploadBtn: {
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: theme.accent,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    uploadBtnText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    bottomBar: {
      marginTop: 6,
      paddingTop: 10,
      gap: 10,
    },

    submitBtn: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        },
        android: { elevation: 3 },
      }),
    },

    submitBtnDisabled: {
      backgroundColor: "rgba(37, 99, 235, 0.35)",
    },

    submitBtnText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 0.2,
    },

    helperText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.muted,
      textAlign: "center",
      lineHeight: 16,
    },

    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },

    chip: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    chipText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.muted,
    },

    backBtnWrap: {
      marginTop: 16,
    },

    backButton: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.accent,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    backButtonText: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "800",
    },
  })