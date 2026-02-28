import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../NAV/ThemeProvider"; 
import QRScannerScreen from "../SETTINGPAGE/QRScanner";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

export function SettingPage() {
  const { darkMode, setDarkMode, theme } = useTheme(); 
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [liveEvents, setLiveEvents] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const switchColors = useMemo(
    () => ({
      trackColor: {
        false: darkMode ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.12)",
        true: darkMode ? "rgba(139,141,255,0.70)" : "rgba(95,98,230,0.65)",
      },
      thumbColor: Platform.OS === "android" ? "#FFFFFF" : undefined,
      ios_backgroundColor: darkMode ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.12)",
    }),
    [darkMode]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={[styles.avatar, { backgroundColor: theme.avatarBg }]}>
              <Text style={[styles.avatarText, { color: theme.accent }]}>R</Text>
            </View>

            <View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>CSUB</Text>
              <Text style={[styles.brandSub, { color: theme.muted }]}>System & preferences</Text>
            </View>
          </View>

          <View style={[styles.pill, { backgroundColor: theme.pillBg }]}>
            <Text style={[styles.pillText, { color: theme.accent }]}>RAMP</Text>
          </View>
        </View>

        {/* Account card */}
        <Card theme={theme}>
          <View style={styles.row}>
            <IconBox emoji="👤" theme={theme} />
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Username</Text>
              <Text style={[styles.rowSub, { color: theme.muted }]}>Student</Text>
            </View>

            <ChevronButton onPress={() => {}} theme={theme} />
          </View>
        </Card>

        {/* Quick tiles */}
        <View style={styles.tileGrid}>
          <Tile
            emoji="❓"
            title="Help & Support"
            subtitle="FAQs, contact"
            onPress={() => {}}
            theme={theme}
          />
          <Tile
            icon={ <MaterialCommunityIcons name="qrcode-scan" size={24} color={theme.text} />}
            title="Scan QR"
            subtitle="Scan a QR code"
            //onPress={() => setQrOpen(true)}
            onPress={() => {
            console.log("Scan QR pressed");
            setQrOpen(true); 
            }}
            theme={theme}
          />
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
        <Card theme={theme}>
          <ToggleRow
            emoji="🔔"
            title="Notifications"
            subtitle="Event reminders & alerts"
            value={notifications}
            onValueChange={setNotifications}
            switchColors={switchColors}
            theme={theme}
          />
          <Divider theme={theme} />
          <ToggleRow
            emoji="📍"
            title="Location Services"
            subtitle="Nearby places & routing"
            value={locationServices}
            onValueChange={setLocationServices}
            switchColors={switchColors}
            theme={theme}
          />
          <Divider theme={theme} />
          <ToggleRow
            emoji="📡"
            title="Live Events"
            subtitle="Show LIVE badge content"
            value={liveEvents}
            onValueChange={setLiveEvents}
            switchColors={switchColors}
            theme={theme}
          />
          <Divider theme={theme} />
          <ToggleRow
            emoji="🌙"
            title="Dark Mode"
            subtitle="Use darker appearance"
            value={darkMode}
            onValueChange={setDarkMode} 
            switchColors={switchColors}
            theme={theme}
          />
        </Card>

        {/* System */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>System</Text>
        <Card theme={theme}>
          <NavRow
            emoji="🛡️"
            title="Privacy"
            subtitle="Permissions & data"
            onPress={() => {}}
            theme={theme}
          />
          <Divider theme={theme} />
          <NavRow
            emoji="🗺️"
            title="Map Preferences"
            subtitle="Routing & accessibility"
            onPress={() => {}}
            theme={theme}
          />
          <Divider theme={theme} />
          <NavRow
            emoji="💾"
            title="Cache & Storage"
            subtitle="Clear downloaded data"
            onPress={() => {}}
            theme={theme}
          />
        </Card>

        {/* Sign out */}
        <TouchableOpacity
          style={[
            styles.dangerBtn,
            { backgroundColor: theme.card, borderColor: theme.divider },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.dangerText}>Sign Out</Text>
        </TouchableOpacity>

        <QRScannerScreen
          visible={qrOpen}
          onClose={() => setQrOpen(false)}
          theme={theme.text}
          onScanned={(data) => {
          // do something with QR result
          console.log("Scanned:", data);
          setQrOpen(false);
          }} 
          />
          
        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Types ---------- */
type ThemeType = {
  accent: string;
  bg: string;
  card: string;
  text: string;
  muted: string;
  divider: string;
  iconBoxBg: string;
  avatarBg: string;
  pillBg: string;
  chevBg: string;
  chevText: string;
  tileChev: string;
};

/* ---------- Components ---------- */

function Card({ children, theme }: { children: React.ReactNode; theme: ThemeType }) {
  return <View style={[styles.card, { backgroundColor: theme.card }]}>{children}</View>;
}

function Divider({ theme }: { theme: ThemeType }) {
  return <View style={[styles.divider, { backgroundColor: theme.divider }]} />;
}

function IconBox({ emoji, theme }: { emoji: string; theme: ThemeType }) {
  return (
    <View style={[styles.iconBox, { backgroundColor: theme.iconBoxBg }]}>
      <Text style={styles.iconText}>{emoji}</Text>
    </View>
  );
}

function ChevronButton({ onPress, theme }: { onPress: () => void; theme: ThemeType }) {
  return (
    <TouchableOpacity
      style={[styles.chevBtn, { backgroundColor: theme.chevBg }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={[styles.chevText, { color: theme.chevText }]}>›</Text>
    </TouchableOpacity>
  );
}

type TileProps = {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  theme: ThemeType;
};

function Tile({ emoji, icon, title, subtitle, onPress, theme }: TileProps) {
  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: theme.card }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={[styles.tileLeft, { backgroundColor: theme.iconBoxBg }]}>
        {icon ? (
          icon
        ) : (
            <Text style={styles.tileEmoji}>{emoji}</Text>
        )}
     
      </View>

      <View style={styles.tileText}>
        <Text style={[styles.tileTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.tileSub, { color: theme.muted }]}>{subtitle}</Text>
      </View>

      <Text style={[styles.tileChev, { color: theme.tileChev }]}>›</Text>
    </TouchableOpacity>
  );
}

type ToggleRowProps = {
  emoji: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  switchColors: {
    trackColor: { false: string; true: string };
    thumbColor?: string;
    ios_backgroundColor?: string;
  };
  theme: ThemeType;
};

function ToggleRow({
  emoji,
  title,
  subtitle,
  value,
  onValueChange,
  switchColors,
  theme,
}: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <IconBox emoji={emoji} theme={theme} />

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: theme.muted }]}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={switchColors.trackColor}
        thumbColor={switchColors.thumbColor}
        ios_backgroundColor={switchColors.ios_backgroundColor}
        style={{
          transform: [{ scaleX: 0.9 }, { scaleY: 1.09 }],
          marginTop: 8,
        }}
      />
    </View>
  );
}

type NavRowProps = {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  theme: ThemeType;
};

function NavRow({ emoji, title, subtitle, onPress, theme }: NavRowProps) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} accessibilityRole="button">
      <IconBox emoji={emoji} theme={theme} />

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: theme.muted }]}>{subtitle}</Text>
      </View>

      <Text style={[styles.tileChev, { color: theme.tileChev }]}>›</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
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

