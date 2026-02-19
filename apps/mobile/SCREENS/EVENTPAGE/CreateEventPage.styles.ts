// CreateEventPage.styles.ts
import { StyleSheet, Platform } from "react-native"

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 12, 
  },

  // ===== Header =====
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
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
    color: "#0F172A",
    letterSpacing: 0.2,
  },

  headerSub: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.55)",
  },

  // ===== Section Card =====
  card: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
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
    color: "#0F172A",
    marginBottom: 10,
  },

  // ===== Inputs =====
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.70)",
    letterSpacing: 0.2,
  },

  required: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(37, 99, 235, 0.95)",
  },

  input: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  inputFocusedHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.55)",
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

  // Multi-line
  textarea: {
    minHeight: 104,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  // ===== Two-column row =====
  row: {
    flexDirection: "row",
    gap: 10,
  },

  col: {
    flex: 1,
  },

  // ===== Day pills (Mon–Fri) =====
  dayPillsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  dayPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  dayPillActive: {
    backgroundColor: "rgba(37, 99, 235, 0.10)",
    borderColor: "rgba(37, 99, 235, 0.35)",
  },

  dayPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.70)",
  },

  dayPillTextActive: {
    color: "#2563EB",
  },

  // ===== Location select / dropdown-like button =====
  selectBtn: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  selectPlaceholder: {
    color: "rgba(15, 23, 42, 0.45)",
    fontWeight: "800",
  },

  selectRightHint: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.45)",
  },

  // ===== Flyer upload =====
  flyerBox: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  flyerTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.70)",
    marginBottom: 6,
    textAlign: "center",
  },

  flyerSub: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.50)",
    textAlign: "center",
    lineHeight: 16,
  },

  uploadBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#0F172A",
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

  // ===== Bottom submit =====
  bottomBar: {
    marginTop: 6,
    paddingTop: 10,
    gap: 10,
  },

  submitBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#2563EB",
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
    color: "rgba(15, 23, 42, 0.55)",
    textAlign: "center",
    lineHeight: 16,
  },

  // ===== Small chips/pills =====
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
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },

  chipText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(15, 23, 42, 0.70)",
  },
  backBtnWrap: {
    marginTop: 16,
  },
  
  backButton: {
    backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "rgba(37, 99, 235, 0.35)",
  paddingVertical: 12,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  },
  
  backButtonText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "800",
  },
})
