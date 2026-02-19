// HomePage.styles.ts
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // =============== HEADER ===============
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10, // thay cho gap
  },

  avatarText: { color: "#FFFFFF", fontWeight: "700" },

  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 10, // thay cho gap
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
    backgroundColor: "#EEF2FF",
  },

  pillText: { color: "#3730A3", fontWeight: "700", fontSize: 12 },

  // =============== LOCATION BANNER ===============
  locationBanner: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#E9F2FF",
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    marginRight: 8,
  },

  locationText: { color: "#1D4ED8", fontWeight: "600" },

  // =============== SCROLL / CONTENT ===============
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // =============== SEARCH ===============
  searchRow: {marginHorizontal: 16},

  searchBox: {
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: { marginRight: 8 },

  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#111827",
  },

  // =============== CHIPS ===============
  chipsRow: {
    paddingVertical: 12,
    paddingLeft: 16, 
    paddingRight: 16
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
    alignSelf: "flex-start"
  },

  chipActive: { backgroundColor: "#6366F1" },

  chipText: { color: "#374151", fontWeight: "700", fontSize: 13 },

  chipTextActive: { color: "#FFFFFF" },

  // =============== QUICK ACTIONS ===============
  quickRow: {
    flexDirection: "row",
    marginTop: 2,
  },

  primaryCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#6366F1",
    padding: 14,
    position: "relative",
    overflow: "hidden",
    marginRight: 12,
  },

  primaryCardTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },

  primaryCardSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
  },

  primaryCardIcon: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryCard: {
    width: 110,
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryCardTitle: { fontWeight: "800", color: "#111827", fontSize: 12 },

  // =============== SECTION HEADER ===============
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginRight: 10,
  },

  livePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },

  livePillText: { color: "#DC2626", fontWeight: "900", fontSize: 11 },

  viewAllBtn: { marginLeft: "auto" },

  viewAllText: { color: "#4F46E5", fontWeight: "800" },

  // =============== EVENTS ===============
  eventsRow: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 20, // để shadow không bị cắt
  },
  eventCard: {
    width: 270,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginRight: 14,
  
    borderWidth: 1,
    borderColor: "#EEF2FF",
  
    shadowColor: "#111827",
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
    backgroundColor: "#F3F4F6", // xám nhạt như ảnh
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
    backgroundColor: "#FEE2E2", // đỏ nhạt
  },
  badgeNow: {
    backgroundColor: "#FEF3C7", // vàng/beige giống ảnh
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#111827",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  eventSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
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
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  eventBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  eventBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  
  // =============== BUILDINGS GRID ===============
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  buildingCard: {
    width: "48%",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  buildingEmoji: { fontSize: 16 },

  distancePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },

  buildingDistance: { color: "#3730A3", fontWeight: "900", fontSize: 11 },

  buildingName: {
    marginTop: 10,
    fontWeight: "900",
    color: "#111827",
    fontSize: 13,
  },

  buildingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  buildingMetaIcon: { marginRight: 6 },

  buildingSubtitle: { color: "#6B7280", fontSize: 12, fontWeight: "600" },

  buildingNote: { marginTop: 6, color: "#EF4444", fontSize: 11, fontWeight: "800" },

  // =============== FAB ===============
  fab: {
    position: "absolute",
    right: 16,
    bottom: 18,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
