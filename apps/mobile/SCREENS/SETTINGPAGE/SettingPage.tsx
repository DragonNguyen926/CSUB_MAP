import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme, type AppTheme } from "../NAV/ThemeProvider"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Linking,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useAuth } from "./AUTH/AuthContext"
import { styles } from "./SettingPage.style"
import * as Location from "expo-location"

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

export function SettingPage() {
  const navigation = useNavigation<any>()
  const { darkMode, setDarkMode, theme } = useTheme()
  const { user, token, isAuthenticated, logout } = useAuth()

  const [notifications, setNotifications] = useState(false)
  const [locationServices, setLocationServices] = useState(false)
  const [incomingCount, setIncomingCount] = useState(0)

  const switchColors = useMemo(
    () => ({
      trackColor: {
        false: darkMode ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.12)",
        true: darkMode ? "rgba(139,141,255,0.70)" : "rgba(95,98,230,0.65)",
      },
      thumbColor: Platform.OS === "android" ? "#FFFFFF" : undefined,
      ios_backgroundColor: darkMode
        ? "rgba(255,255,255,0.18)"
        : "rgba(20,20,20,0.12)",
    }),
    [darkMode]
  )

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Username"
  const roleLabel = user?.role === "admin" ? "Admin" : "Student"
  const emailLabel = user?.email || "Not available"

  const fetchIncomingCount = useCallback(async () => {
    if (!token) {
      setIncomingCount(0)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/friends/requests/incoming`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const text = await response.text()
      let data: any = null

      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = null
      }

      if (!response.ok) {
        setIncomingCount(0)
        return
      }

      setIncomingCount(data?.requests?.length || 0)
    } catch (error) {
      console.log("fetchIncomingCount error:", error)
      setIncomingCount(0)
    }
  }, [token])

  const syncLocationPermission = useCallback(async () => {
    try {
      const locationPerm = await Location.getForegroundPermissionsAsync()
      setLocationServices(locationPerm.granted)
    } catch (error) {
      console.log("syncLocationPermission error:", error)
    }
  }, [])

  useEffect(() => {
    syncLocationPermission()
  }, [syncLocationPermission])

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && token) {
        fetchIncomingCount()
      }
      syncLocationPermission()
    }, [isAuthenticated, token, fetchIncomingCount, syncLocationPermission])
  )

  const openAppSettings = async () => {
    try {
      await Linking.openSettings()
    } catch {
      Alert.alert(
        "Unable to open settings",
        "Please open your device settings manually."
      )
    }
  }

  const handleNotificationToggle = async (nextValue: boolean) => {
    setNotifications(nextValue)

    Alert.alert(
      "Notification Settings",
      nextValue
        ? "To fully enable notifications, please allow them in your device settings."
        : "To fully disable notifications, please turn them off in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openAppSettings },
      ]
    )
  }

  const handleLocationToggle = async (nextValue: boolean) => {
    if (nextValue) {
      try {
        const current = await Location.getForegroundPermissionsAsync()

        if (current.granted) {
          setLocationServices(true)
          return
        }

        const requested = await Location.requestForegroundPermissionsAsync()
        const granted = requested.granted

        setLocationServices(granted)

        if (!granted) {
          Alert.alert("Location disabled", "Location permission was not granted.")
        }
      } catch (error) {
        console.log("handleLocationToggle error:", error)
        Alert.alert("Error", "Could not update location permission.")
      }
      return
    }

    setLocationServices(false)
    Alert.alert(
      "Turn off location access",
      "To fully disable location access for the app, open device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openAppSettings },
      ]
    )
  }

  const handleLogout = async () => {
    try {
      setDarkMode(false)
      setNotifications(false)
      setLocationServices(false)
      setIncomingCount(0)
      await logout()
    } catch {
      Alert.alert("Logout failed", "Please try again.")
    }
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[styles.safe, { backgroundColor: theme.bg }]}
      >
        <ScrollView
          contentContainerStyle={[styles.page, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <View style={[styles.avatar, { backgroundColor: theme.avatarBg }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>R</Text>
              </View>

              <View>
                <Text style={[styles.brandTitle, { color: theme.text }]}>CSUB</Text>
                <Text style={[styles.brandSub, { color: theme.muted }]}>
                  Preferences
                </Text>
              </View>
            </View>

            <View style={[styles.pill, { backgroundColor: theme.pillBg }]}>
              <Text style={[styles.pillText, { color: theme.accent }]}>RAMP</Text>
            </View>
          </View>

          <View
            style={[
              styles.emptyWrap,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: theme.iconBoxBg },
              ]}
            >
              <MaterialCommunityIcons
                name="account-lock-outline"
                size={36}
                color={theme.accent}
              />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Log in to access settings
            </Text>

            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              Sign in or create an account to manage preferences and your account.
            </Text>

            <TouchableOpacity
              style={[styles.loginBtn, { backgroundColor: theme.accent }]}
              onPress={() => navigation.navigate("Auth")}
              activeOpacity={0.9}
            >
              <Text style={styles.loginBtnText}>Log In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safe, { backgroundColor: theme.bg }]}
    >
      <ScrollView
        contentContainerStyle={[styles.page, { flexGrow: 1, paddingBottom: 36 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={[styles.avatar, { backgroundColor: theme.avatarBg }]}>
              <Text style={[styles.avatarText, { color: theme.accent }]}>R</Text>
            </View>

            <View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>CSUB</Text>
              <Text style={[styles.brandSub, { color: theme.muted }]}>
                Preferences
              </Text>
            </View>
          </View>

          <View style={[styles.pill, { backgroundColor: theme.pillBg }]}>
            <Text style={[styles.pillText, { color: theme.accent }]}>RAMP</Text>
          </View>
        </View>

        <Card theme={theme}>
          <NavRow
            emoji="👤"
            title={fullName}
            subtitle={`${roleLabel} • ${emailLabel}`}
            onPress={() => navigation.navigate("ProfileSettings")}
            theme={theme}
          />
        </Card>

        <Card theme={theme}>
          <NavRow
            emoji="👥"
            title="Friends"
            subtitle="Manage your connections"
            onPress={() => navigation.navigate("Friends")}
            theme={theme}
            badge={incomingCount}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Preferences
        </Text>

        <Card theme={theme}>
          <ToggleRow
            emoji="🔔"
            title="Notifications"
            subtitle="Open device notification settings"
            value={notifications}
            onValueChange={handleNotificationToggle}
            switchColors={switchColors}
            theme={theme}
          />
          <Divider theme={theme} />

          <ToggleRow
            emoji="📍"
            title="Location Services"
            subtitle="Allow nearby places & routing"
            value={locationServices}
            onValueChange={handleLocationToggle}
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

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Account
        </Text>

        <Card theme={theme}>
          <InfoRow
            emoji="✉️"
            title="Campus Email"
            value={emailLabel}
            theme={theme}
          />
          <Divider theme={theme} />
          <InfoRow
            emoji="🪪"
            title="Role"
            value={roleLabel}
            theme={theme}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Support
        </Text>

        <Card theme={theme}>
          <NavRow
            emoji="❓"
            title="Help"
            subtitle="Get support using the app"
            onPress={() => Alert.alert("Help", "Help center coming soon.")}
            theme={theme}
          />
          <Divider theme={theme} />
          <NavRow
            emoji="ℹ️"
            title="About Ramp"
            subtitle="Version and app information"
            onPress={() => Alert.alert("About Ramp", "Ramp at CSUB")}
            theme={theme}
          />
        </Card>

        <TouchableOpacity
          style={[
            styles.dangerBtn,
            {
              backgroundColor: theme.card,
              borderColor: theme.divider,
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <Text style={styles.dangerText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function Card({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: AppTheme
}) {
  return <View style={[styles.card, { backgroundColor: theme.card }]}>{children}</View>
}

function Divider({ theme }: { theme: AppTheme }) {
  return <View style={[styles.divider, { backgroundColor: theme.divider }]} />
}

function IconBox({ emoji, theme }: { emoji: string; theme: AppTheme }) {
  return (
    <View style={[styles.iconBox, { backgroundColor: theme.iconBoxBg }]}>
      <Text style={styles.iconText}>{emoji}</Text>
    </View>
  )
}

function InfoRow({
  emoji,
  title,
  value,
  theme,
}: {
  emoji: string
  title: string
  value: string
  theme: AppTheme
}) {
  return (
    <View style={styles.row}>
      <IconBox emoji={emoji} theme={theme} />

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: theme.muted }]}>{value}</Text>
      </View>
    </View>
  )
}

type ToggleRowProps = {
  emoji: string
  title: string
  subtitle: string
  value: boolean
  onValueChange: (next: boolean) => void
  switchColors: {
    trackColor: { false: string; true: string }
    thumbColor?: string
    ios_backgroundColor?: string
  }
  theme: AppTheme
}

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
  )
}

type NavRowProps = {
  emoji: string
  title: string
  subtitle: string
  onPress: () => void
  theme: AppTheme
  badge?: number
}

function NavRow({
  emoji,
  title,
  subtitle,
  onPress,
  theme,
  badge = 0,
}: NavRowProps) {
  return (
    <TouchableOpacity
      style={styles.navRow}
      onPress={onPress}
      accessibilityRole="button"
      activeOpacity={0.85}
    >
      <IconBox emoji={emoji} theme={theme} />

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: theme.muted }]}>{subtitle}</Text>
      </View>

      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <Text style={[styles.tileChev, { color: theme.tileChev }]}>›</Text>
    </TouchableOpacity>
  )
}