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

const THEME = {
  accent: "#5F62E6",
  bg: "#F3F5F8",
  card: "#FFFFFF",
  muted: "rgba(20,20,20,0.55)",
  divider: "rgba(20,20,20,0.08)",
};

export function SettingPage() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [liveEvents, setLiveEvents] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  
  const switchColors = useMemo(
  () => ({
    trackColor: { false: "rgba(20,20,20,0.12)", true: "rgba(95,98,230,0.65)" },
    thumbColor: Platform.OS === "android" ? "#FFFFFF" : undefined,
    ios_backgroundColor: "rgba(20,20,20,0.12)",
  }),
  []
  ); 

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>R</Text>
            </View>

            <View>
              <Text style={styles.brandTitle}>CSUB</Text>
              <Text style={styles.brandSub}>System & preferences</Text>
            </View>
          </View>

          <View style={styles.pill}>
            <Text style={styles.pillText}>RAMP</Text>
          </View>
        </View>

        {/* Account card */}
        <Card>
          <View style={styles.row}>
            <IconBox emoji="👤" />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Username</Text>
              <Text style={styles.rowSub}>Student</Text>
            </View>

            <ChevronButton onPress={() => {}} />
          </View>
        </Card>

        {/* Quick tiles */}
        <View style={styles.tileGrid}>
          <Tile
            emoji="❓"
            title="Help & Support"
            subtitle="FAQs, contact"
            onPress={() => {}}
          />
          <Tile
            emoji="ℹ️"
            title="About App"
            subtitle="Version info"
            onPress={() => {}}
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card>
          <ToggleRow
            emoji="🔔"
            title="Notifications"
            subtitle="Event reminders & alerts"
            value={notifications}
            onValueChange={setNotifications}
            switchColors={switchColors}
          />
          <Divider />
          <ToggleRow
            emoji="📍"
            title="Location Services"
            subtitle="Nearby places & routing"
            value={locationServices}
            onValueChange={setLocationServices}
            switchColors={switchColors}
          />
          <Divider />
          <ToggleRow
            emoji="📡"
            title="Live Events"
            subtitle="Show LIVE badge content"
            value={liveEvents}
            onValueChange={setLiveEvents}
            switchColors={switchColors}
          />
          <Divider />
          <ToggleRow
            emoji="🌙"
            title="Dark Mode"
            subtitle="Use darker appearance"
            value={darkMode}
            onValueChange={setDarkMode}
            switchColors={switchColors}
          />
        </Card>

        {/* System */}
        <Text style={styles.sectionTitle}>System</Text>
        <Card>
          <NavRow emoji="🛡️" title="Privacy" subtitle="Permissions & data" onPress={() => {}} />
          <Divider />
          <NavRow
            emoji="🗺️"
            title="Map Preferences"
            subtitle="Routing & accessibility"
            onPress={() => {}}
          />
          <Divider />
          <NavRow
            emoji="💾"
            title="Cache & Storage"
            subtitle="Clear downloaded data"
            onPress={() => {}}
          />
        </Card>

        {/* Sign out */}
        <TouchableOpacity style={styles.dangerBtn} onPress={() => {}}>
          <Text style={styles.dangerText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function IconBox({ emoji }: { emoji: string }) {
  return (
    <View style={styles.iconBox}>
      <Text style={styles.iconText}>{emoji}</Text>
    </View>
  );
}

function ChevronButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.chevBtn} onPress={onPress} accessibilityRole="button">
      <Text style={styles.chevText}>›</Text>
    </TouchableOpacity>
  );
}

type TileProps = {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function Tile({ emoji, title, subtitle, onPress }: TileProps) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} accessibilityRole="button">
      <View style={styles.tileLeft}>
        <Text style={styles.tileEmoji}>{emoji}</Text>
      </View>

      <View style={styles.tileText}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileSub}>{subtitle}</Text>
      </View>

      <Text style={styles.tileChev}>›</Text>
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
};

function ToggleRow({
  emoji,
  title,
  subtitle,
  value,
  onValueChange,
  switchColors,
}: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <IconBox emoji={emoji} />

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={switchColors.trackColor}
        thumbColor={switchColors.thumbColor}
        ios_backgroundColor={switchColors.ios_backgroundColor}
        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 1.09 }],
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
};

function NavRow({ emoji, title, subtitle, onPress }: NavRowProps) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} accessibilityRole="button">
      <IconBox emoji={emoji} />

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>

      <Text style={styles.tileChev}>›</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.bg },

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
    backgroundColor: "rgba(95,98,230,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: THEME.accent, fontWeight: "800", fontSize: 18 },

  brandTitle: { fontSize: 22, fontWeight: "900", letterSpacing: 0.2, color: "#111" },
  brandSub: { marginTop: 2, fontSize: 13, color: THEME.muted },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(95,98,230,0.12)",
  },
  pillText: { color: THEME.accent, fontWeight: "800" },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 6,
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },

  card: {
    backgroundColor: THEME.card,
    borderRadius: 22,
    padding: 14,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3, // Android shadow
  },

  row: { flexDirection: "row", alignItems: "center", gap: 12 },

  rowText: { flex: 1, minWidth: 0 },

  rowTitle: { fontSize: 15, fontWeight: "900", color: "#111" },
  rowSub: { marginTop: 2, fontSize: 13, color: THEME.muted },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(95,98,230,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 25 },

  chevBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  chevText: { fontSize: 22, color: "rgba(20,20,20,0.45)", marginTop: -2 },

  divider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 12,
  },

  tileGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  tile: {
    flex: 1,
    backgroundColor: THEME.card,
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
    backgroundColor: "rgba(95,98,230,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  tileEmoji: { fontSize: 18 },
  tileText: { flex: 1 },
  tileTitle: { fontSize: 14, fontWeight: "900", color: "#111" },
  tileSub: { marginTop: 2, fontSize: 12.5, color: THEME.muted },
  tileChev: { fontSize: 22, color: "rgba(20,20,20,0.35)", marginTop: -2 },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },

  dangerBtn: {
    marginTop: 14,
    backgroundColor: THEME.card,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.divider,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  dangerText: { color: "#D12B2B", fontWeight: "900", fontSize: 15 },
});
