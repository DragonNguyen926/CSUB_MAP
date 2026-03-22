import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  page: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    paddingBottom: 10,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontWeight: "800",
    fontSize: 18,
  },

  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  brandSub: {
    marginTop: 2,
    fontSize: 13,
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },

  pillText: {
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 6,
    fontSize: 18,
    fontWeight: "900",
  },

  card: {
    borderRadius: 22,
    padding: 14,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    flex: 1,
    minWidth: 0,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  rowSub: {
    marginTop: 2,
    fontSize: 13,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 25,
  },

  chevBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  chevText: {
    fontSize: 22,
    marginTop: -2,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  tileGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  tile: {
    flex: 1,
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  tileLeft: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  tileEmoji: {
    fontSize: 18,
  },

  tileText: {
    flex: 1,
  },

  tileTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  tileSub: {
    marginTop: 2,
    fontSize: 12.5,
  },

  tileChev: {
    fontSize: 22,
    marginTop: -2,
  },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },

  dangerBtn: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  dangerText: {
    color: "#D12B2B",
    fontWeight: "900",
    fontSize: 15,
  },

  emptyWrap: {
    marginTop: 80,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    borderWidth: 1,
  },

  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
  },

  loginBtn: {
    marginTop: 22,
    minWidth: 190,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
})