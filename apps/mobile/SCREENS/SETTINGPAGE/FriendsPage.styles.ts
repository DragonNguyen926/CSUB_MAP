import { StyleSheet } from "react-native"
import type { AppTheme } from "../NAV/ThemeProvider"

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 40,
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 15,
      color: theme.muted,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
    },

    headerCenter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
    },

    headerIconBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.surface ?? theme.card,
      alignItems: "center",
      justifyContent: "center",
    },

    headerSpacer: {
      width: 42,
      height: 42,
    },

    pageSubtext: {
      marginTop: 8,
      marginBottom: 14,
      fontSize: 14,
      lineHeight: 20,
      color: theme.muted,
    },

    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 14,
    },

    statCard: {
      flex: 1,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    statValue: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text,
    },

    statLabel: {
      marginTop: 4,
      fontSize: 13,
      color: theme.muted,
    },

    sectionHeader: {
      marginTop: 4,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionHeaderTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },

    countBadge: {
      minWidth: 28,
      height: 28,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: theme.surface ?? theme.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.divider,
    },

    countBadgeText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.text,
    },

    section: {
      marginBottom: 16,
      padding: 14,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
    },

    sectionSub: {
      marginTop: 4,
      marginBottom: 12,
      fontSize: 13,
      lineHeight: 19,
      color: theme.muted,
    },

    sharingSummaryBox: {
      borderRadius: 16,
      padding: 14,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    sharingSummaryTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.text,
    },

    sharingSummarySub: {
      marginTop: 4,
      fontSize: 12,
      color: theme.muted,
    },

    

    inputWrap: {
      height: 52,
      borderWidth: 1,
      borderColor: theme.divider,
      borderRadius: 16,
      backgroundColor: theme.card,
      paddingHorizontal: 14,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    input: {
      flex: 1,
      fontSize: 15,
      color: theme.text,
    },

    searchWrap: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.divider,
      borderRadius: 14,
      backgroundColor: theme.card,
      paddingHorizontal: 14,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
    },

    primaryBtn: {
      height: 50,
      borderRadius: 16,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    disabledBtn: {
      opacity: 0.6,
    },

    card: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      marginBottom: 10,
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatarCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    avatarLetter: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.accent,
    },

    cardInfo: {
      flex: 1,
    },

    cardName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },

    cardEmail: {
      marginTop: 2,
      fontSize: 13,
      color: theme.muted,
    },

    actionRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
    },

    actionBtn: {
      height: 40,
      borderRadius: 12,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    acceptBtn: {
      backgroundColor: "#16A34A",
    },

    rejectBtn: {
      backgroundColor: "#DC2626",
    },

    removeBtn: {
      backgroundColor: theme.text,
    },

    actionBtnText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
    },

    pendingBadge: {
      marginTop: 12,
      alignSelf: "flex-start",
      backgroundColor: theme.surface ?? theme.card,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    pendingText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.text,
    },

    friendRow: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      marginBottom: 10,
    },

    friendTopRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    friendBottomRow: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sharingTextWrap: {
      flex: 1,
      marginRight: 12,
    },

    sharingLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
    },

    sharingState: {
      marginTop: 3,
      fontSize: 12,
      color: theme.muted,
    },

    friendActionsRow: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "flex-start",
    },

    removeGhostBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: theme.surface ?? theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },

    removeGhostText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.accent,
    },

    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 18,
      gap: 8,
    },

    emptyText: {
      fontSize: 14,
      color: theme.muted,
      textAlign: "center",
    },
    turnOffAllBtn: {
        marginTop: 12,
        height: 42,
        borderRadius: 12,
        backgroundColor: theme.accent,
        alignItems: "center",
        justifyContent: "center",
      },
      
      turnOffAllBtnDisabled: {
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.divider,
      },
      
      turnOffAllBtnText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
      },
      
      turnOffAllBtnTextDisabled: {
        color: theme.muted,
      },
  })