// EventPage.styles.ts
import { StyleSheet, Platform } from "react-native"

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },

  // ===== Header =====
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
    backgroundColor: "#111827",
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
    color: "#0F172A",
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
    backgroundColor: "#2563EB",
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

  // ===== Week selector =====
  weekRow: {
    marginTop: 8,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
  },

  weekTitleWrap: {
    flexDirection: "column",
    gap: 3,
  },

  weekTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },

  weekSub: {
    fontSize: 12,
    color: "rgba(15, 23, 42, 0.65)",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ===== Day tabs (Mon–Fri) =====
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  tabActive: {
    backgroundColor: "rgba(37, 99, 235, 0.10)",
    borderColor: "rgba(37, 99, 235, 0.35)",
  },

  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(15, 23, 42, 0.70)",
    letterSpacing: 0.2,
  },

  tabTextActive: {
    color: "#2563EB",
  },

  // ===== Section label (optional) =====
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
    color: "#0F172A",
  },

  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },

  countPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.70)",
  },

  // ===== Event card =====
  card: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
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
    backgroundColor: "rgba(15, 23, 42, 0.06)",
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
    color: "rgba(15, 23, 42, 0.70)",
  },

  flyerPlaceholderSub: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.45)",
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
    color: "#0F172A",
    lineHeight: 20,
  },

  orgText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(15, 23, 42, 0.60)",
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
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
  },

  metaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(15, 23, 42, 0.70)",
  },

  addressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.55)",
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
    backgroundColor: "rgba(37, 99, 235, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.22)",
  },

  timeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#2563EB",
  },

  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  navBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  // ===== Empty state =====
  emptyWrap: {
    marginTop: 22,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    alignItems: "center",
    gap: 8,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },

  emptySub: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.55)",
    textAlign: "center",
    lineHeight: 16,
  },

  createBtnWrap: {
    marginTop: 16,
  },
  
  createButton: {
    backgroundColor: "#2563EB",
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

