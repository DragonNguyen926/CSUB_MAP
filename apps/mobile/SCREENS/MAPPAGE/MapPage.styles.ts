import { StyleSheet } from "react-native"
import type { AppTheme } from "../NAV/ThemeProvider"

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.bg,
    },

    mapWrap: {
      flex: 1,
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.25)",
    },

    topWrap: {
      position: "absolute",
      left: 12,
      right: 12,
      top: 0,
    },

    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 12,
      height: 52,
      borderRadius: 18,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },

    searchIcon: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text,
    },

    searchInput: {
      flex: 1,
      height: 52,
      color: theme.text,
      fontWeight: "700",
    },

    clearBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.iconBoxBg,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    clearText: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.text,
      marginTop: -1,
    },

    goBtn: {
      paddingHorizontal: 12,
      height: 36,
      borderRadius: 14,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    goText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 12,
    },

    sheet: {
      marginTop: 10,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      maxHeight: 340,
    },

    sheetHeader: {
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },

    sheetTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: theme.text,
    },

    sheetSub: {
      marginTop: 2,
      fontSize: 11,
      color: theme.muted,
      fontWeight: "700",
    },

    empty: {
      padding: 14,
    },

    emptyText: {
      fontWeight: "900",
      color: theme.text,
    },

    emptySub: {
      marginTop: 4,
      fontSize: 11,
      color: theme.muted,
      fontWeight: "700",
    },

    list: {
      paddingVertical: 6,
    },

    item: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },

    itemSelected: {
      backgroundColor: theme.iconBoxBg,
    },

    itemTitle: {
      fontSize: 12,
      color: theme.text,
      fontWeight: "800",
    },

    itemMeta: {
      marginTop: 3,
      fontSize: 10,
      color: theme.muted,
      fontWeight: "700",
    },

    routeChip: {
      alignSelf: "flex-start",
      margin: 12,
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    routeChipText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.text,
    },
  })