import { StyleSheet} from "react-native";
const THEME = {
    accent: "#5F62E6",
    bg: "#F3F5F8",
    card: "#FFFFFF",
    muted: "rgba(20,20,20,0.55)",
    divider: "rgba(20,20,20,0.08)",
  };
export const styles = StyleSheet.create({
    safe: { flex: 1 },
  
    page: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 24,
    },
  
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 2,
      paddingBottom: 10,
    },
  
    brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontWeight: "800", fontSize: 18 },
  
    brandTitle: { fontSize: 22, fontWeight: "900", letterSpacing: 0.2 },
    brandSub: { marginTop: 2, fontSize: 13 },
  
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
    },
    pillText: { fontWeight: "800" },
  
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
  
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
  
    rowText: { flex: 1, minWidth: 0 },
  
    rowTitle: { fontSize: 15, fontWeight: "900" },
    rowSub: { marginTop: 2, fontSize: 13 },
  
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    iconText: { fontSize: 25 },
  
    chevBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },
    chevText: { fontSize: 22, marginTop: -2 },
  
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
    tileEmoji: { fontSize: 18 },
    tileText: { flex: 1 },
    tileTitle: { fontSize: 14, fontWeight: "900" },
    tileSub: { marginTop: 2, fontSize: 12.5 },
    tileChev: { fontSize: 22, marginTop: -2 },
  
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
    dangerText: { color: "#D12B2B", fontWeight: "900", fontSize: 15 },
  
  });