import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onScanned: (data: string) => void;
  theme: any; 
};

export default function QRScannerModal({
  visible,
  onClose,
  onScanned,
  theme,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Reset state whenever the modal opens
  useEffect(() => {
    if (visible) setScanned(false);
  }, [visible]);

  const canScan = !!permission?.granted && visible && !scanned;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme?.bg ?? "#000" }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.headerBtn}>
            <MaterialCommunityIcons
              name="close"
              size={26}
              color={theme?.text ?? "#fff"}
            />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme?.text ?? "#fff" }]}>
            Scan QR
          </Text>

          <View style={styles.headerBtn} />
        </View>

        {/* Permission states */}
        {!permission && (
          <View style={styles.center}>
            <Text style={[styles.text, { color: theme?.text ?? "#fff" }]}>
              Loading camera permission…
            </Text>
          </View>
        )}

        {permission && !permission.granted && (
          <View style={styles.center}>
            <Text style={[styles.text, { color: theme?.text ?? "#fff" }]}>
              Camera permission is required to scan a QR code.
            </Text>
            <Pressable
              onPress={requestPermission}
              style={[styles.primaryBtn, { borderColor: theme?.text ?? "#fff" }]}
            >
              <Text style={[styles.primaryBtnText, { color: theme?.text ?? "#fff" }]}>
                Grant Permission
              </Text>
            </Pressable>
          </View>
        )}

        {/* Camera */}
        {permission?.granted && (
          <View style={styles.cameraWrap}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={
                canScan
                  ? ({ data }) => {
                      setScanned(true);
                      onScanned(String(data));
                    }
                  : undefined
              }
            />

            {/* Simple scan frame */}
            <View style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={[styles.hint, { color: theme?.text ?? "#fff" }]}>
                Align the QR code inside the frame
              </Text>

              {scanned && (
                <Pressable
                  onPress={() => setScanned(false)}
                  style={[styles.primaryBtn, { borderColor: theme?.text ?? "#fff" }]}
                >
                  <Text style={[styles.primaryBtnText, { color: theme?.text ?? "#fff" }]}>
                    Scan Again
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  text: { fontSize: 16, textAlign: "center", marginBottom: 16 },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600" },
  cameraWrap: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  frame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  hint: { fontSize: 14, opacity: 0.9 },
});
