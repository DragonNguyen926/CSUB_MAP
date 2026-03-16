import { Platform, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  mapWrap: { flex: 1 },

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
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(229,231,235,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  searchIcon: { fontSize: 16, fontWeight: "900", color: "#111827" },
  searchInput: {
    flex: 1,
    height: 52,
    color: "#111827",
    fontWeight: "700",
  },

  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  clearText: { fontSize: 18, fontWeight: "900", color: "#111827", marginTop: -1 },

  goBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  goText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  sheet: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(229,231,235,0.95)",
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
    borderBottomColor: "rgba(229,231,235,0.9)",
  },
  sheetTitle: { fontSize: 13, fontWeight: "900", color: "#111827" },
  sheetSub: { marginTop: 2, fontSize: 11, color: "#6B7280", fontWeight: "700" },

  empty: { padding: 14 },
  emptyText: { fontWeight: "900", color: "#111827" },
  emptySub: { marginTop: 4, fontSize: 11, color: "#6B7280", fontWeight: "700" },

  list: { paddingVertical: 6 },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(243,244,246,1)",
  },
  itemSelected: { backgroundColor: "rgba(17,24,39,0.06)" },
  itemTitle: { fontSize: 12, color: "#111827", fontWeight: "800" },
  itemMeta: { marginTop: 3, fontSize: 10, color: "#6B7280", fontWeight: "700" },

  routeChip: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(229,231,235,0.9)",
  },
  routeChipText: { fontSize: 12, fontWeight: "900", color: "#111827" },
})