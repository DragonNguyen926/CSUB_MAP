import { StyleSheet, Platform } from "react-native"
import type { AppTheme } from "../NAV/ThemeProvider"

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.bg,
    },

    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },

    header: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.bg,
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    avatarText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
    },

    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },

    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.iconBoxBg,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginRight: 10,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#EF4444",
      position: "absolute",
      top: 8,
      right: 9,
    },

    pill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.pillBg,
    },

    pillText: {
      color: theme.accent,
      fontWeight: "700",
      fontSize: 12,
    },

    locationBanner: {
      marginBottom: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.iconBoxBg,
      flexDirection: "row",
      alignItems: "center",
    },

    locationIcon: {
      marginRight: 8,
    },

    locationText: {
      color: theme.text,
      fontWeight: "600",
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      backgroundColor: theme.bg,
    },

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    searchBox: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: theme.card,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.divider,
    },

    searchIcon: {
      marginRight: 8,
    },

    searchInput: {
      flex: 1,
      height: 56,
      fontSize: 16,
      color: theme.text,
    },

    goBtn: {
      marginLeft: 10,
      height: 56,
      minWidth: 68,
      paddingHorizontal: 18,
      borderRadius: 18,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },

    goBtnDisabled: {
      opacity: 0.55,
    },

    goBtnText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 16,
    },

    suggestionsWrap: {
      paddingHorizontal: 16,
      marginTop: 8,
    },

    suggestionsCard: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.divider,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.06 : 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },

    suggestionsHeader: {
      padding: 12,
    },

    suggestionsTitle: {
      fontWeight: "700",
      color: theme.text,
    },

    suggestionsSubtitle: {
      marginTop: 4,
      opacity: 0.7,
      color: theme.muted,
    },

    suggestionItem: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      backgroundColor: theme.card,
    },

    suggestionItemSelected: {
      backgroundColor: theme.iconBoxBg,
    },

    suggestionName: {
      fontWeight: "600",
      color: theme.text,
    },

    suggestionMeta: {
      marginTop: 4,
      opacity: 0.7,
      color: theme.muted,
    },

    chipsRow: {
      paddingVertical: 12,
      paddingLeft: 0,
      paddingRight: 0,
    },

    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.iconBoxBg,
      marginRight: 10,
      alignSelf: "flex-start",
    },

    chipActive: {
      backgroundColor: theme.accent,
    },

    chipText: {
      color: theme.muted,
      fontWeight: "700",
      fontSize: 13,
    },

    chipTextActive: {
      color: "#FFFFFF",
    },

    quickRow: {
      marginTop: 6,
    },

    primaryCard: {
      width: "100%",
      height: 180,
      borderRadius: 20,
      backgroundColor: theme.accent,
      position: "relative",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    miniMap: {
      flex: 1,
    },

    miniMapFallback: {
      flex: 1,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    miniMapFallbackTitle: {
      color: "#FFFFFF",
      marginTop: 8,
      fontWeight: "700",
    },

    miniMapNote: {
      position: "absolute",
      top: 10,
      left: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      maxWidth: "75%",
    },

    miniMapNoteText: {
      marginLeft: 6,
      color: theme.text,
      fontSize: 12,
      fontWeight: "700",
    },

    sectionHeader: {
      marginTop: 18,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text,
      marginRight: 10,
    },

    livePill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: theme.iconBoxBg,
    },

    livePillText: {
      color: theme.accent,
      fontWeight: "900",
      fontSize: 11,
    },

    viewAllBtn: {
      marginLeft: "auto",
    },

    viewAllText: {
      color: theme.accent,
      fontWeight: "800",
    },

    eventsRow: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 10,
      paddingBottom: 20,
    },

    eventCard: {
      width: 270,
      borderRadius: 20,
      backgroundColor: theme.card,
      padding: 16,
      marginRight: 14,
      borderWidth: 1,
      borderColor: theme.divider,
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    eventTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },

    eventTopLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 10,
    },

    eventTopText: {
      flex: 1,
    },

    eventIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.iconBoxBg,
    },

    eventIconEmoji: {
      fontSize: 16,
    },

    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    badgeLive: {
      backgroundColor: theme.iconBoxBg,
    },

    badgeNow: {
      backgroundColor: theme.pillBg,
    },

    badgeText: {
      fontSize: 11,
      fontWeight: "900",
      color: theme.text,
    },

    eventTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text,
    },

    eventSubtitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.muted,
      marginTop: 4,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },

    metaIcon: {
      marginRight: 8,
    },

    metaText: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
    },

    eventBtn: {
      marginTop: 16,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    eventBtnText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 14,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    buildingCard: {
      width: "48%",
      borderRadius: 18,
      backgroundColor: theme.card,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.divider,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: Platform.OS === "ios" ? 0.06 : 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },

    buildingTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    buildingIcon: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: theme.iconBoxBg,
      alignItems: "center",
      justifyContent: "center",
    },

    buildingEmoji: {
      fontSize: 16,
    },

    distancePill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.pillBg,
    },

    buildingDistance: {
      color: theme.accent,
      fontWeight: "900",
      fontSize: 11,
    },

    buildingName: {
      marginTop: 10,
      fontWeight: "900",
      color: theme.text,
      fontSize: 13,
    },

    buildingMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },

    buildingMetaIcon: {
      marginRight: 6,
    },

    buildingSubtitle: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: "600",
    },

    buildingNote: {
      marginTop: 6,
      color: "#EF4444",
      fontSize: 11,
      fontWeight: "800",
    },

    fab: {
      position: "absolute",
      right: 16,
      bottom: 18,
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
  })