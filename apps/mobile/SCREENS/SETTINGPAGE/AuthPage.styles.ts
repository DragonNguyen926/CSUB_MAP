import { Platform, StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  brandPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },

  brandPillText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "800",
  },

  hero: {
    alignItems: "center",
    marginBottom: 24,
  },

  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  heroIconText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#4F46E5",
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  heroDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 320,
  },

  segmentWrap: {
    flexDirection: "row",
    backgroundColor: "#EEF2F7",
    borderRadius: 18,
    padding: 4,
    marginBottom: 18,
  },

  segmentBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentBtnActive: {
    backgroundColor: "#6366F1",
    shadowColor: "#4F46E5",
    shadowOpacity: Platform.OS === "ios" ? 0.18 : 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  segmentBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6B7280",
  },

  segmentBtnTextActive: {
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#111827",
    shadowOpacity: Platform.OS === "ios" ? 0.06 : 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputGroup: {
    marginBottom: 14,
  },

  halfInput: {
    width: "48%",
  },

  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },

  helperRow: {
    alignSelf: "flex-end",
    marginBottom: 16,
    marginTop: 2,
  },

  helperText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },

  helperBlock: {
    marginBottom: 16,
    marginTop: 2,
  },

  helperNote: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },

  submitBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: Platform.OS === "ios" ? 0.2 : 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  bottomTextWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 0,
    paddingBottom: 0,
    flexWrap: "wrap",
  },

  bottomText: {
    color: "#6B7280",
    fontSize: 14,
  },

  bottomLink: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "800",
  },
})