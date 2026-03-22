import React, { useEffect, useMemo, useState } from "react"
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useTheme, type AppTheme } from "../NAV/ThemeProvider"
import { useAuth } from "./AUTH/AuthContext"
import { styles } from "./SettingPage.style"

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

export function ProfileSettingsPage() {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { user, token, setAuthSession } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const currentRoleLabel = user?.role === "admin" ? "Admin" : "Student"
  const emailLabel = user?.email || "Not available"

  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`.trim() || "Your Name"
  }, [firstName, lastName])

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return

      try {
        setLoadingProfile(true)

        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok || !data?.user) {
          return
        }

        setFirstName(data.user.firstName || "")
        setLastName(data.user.lastName || "")
      } catch (error) {
        console.log("loadProfile error:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [token])

  const handleSaveProfile = async () => {
    if (!token) {
      Alert.alert("Unauthorized", "Please log in again.")
      return
    }

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Missing information", "Please complete first and last name.")
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert("Update failed", data?.error || "Please try again.")
        return
      }

      if (data?.user) {
        await setAuthSession(token, {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
        })
      }

      Alert.alert("Success", "Profile updated successfully.")
    } catch (error) {
      console.log("handleSaveProfile error:", error)
      Alert.alert("Error", "Could not update profile.")
    } finally {
      setSaving(false)
    }
  }

  const handleRoleRequest = async () => {
    Alert.alert(
      "Coming Soon",
      "Role change requests are not available in the app yet. Please contact the developer/admin directly."
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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.avatarBg,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: theme.accent }]}>‹</Text>
            </TouchableOpacity>

            <View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>
                Profile Settings
              </Text>
              <Text style={[styles.brandSub, { color: theme.muted }]}>
                Manage your account details
              </Text>
            </View>
          </View>

          <View style={[styles.pill, { backgroundColor: theme.pillBg }]}>
            <Text style={[styles.pillText, { color: theme.accent }]}>RAMP</Text>
          </View>
        </View>

        <Card theme={theme}>
          <View
            style={{
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 52,
                backgroundColor: theme.iconBoxBg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={64}
                color={theme.accent}
              />
            </View>

            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 4,
              }}
            >
              {fullName}
            </Text>

            <Text
              style={{
                color: theme.muted,
                fontSize: 14,
              }}
            >
              {currentRoleLabel} • {emailLabel}
            </Text>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Personal Information
        </Text>

        <Card theme={theme}>
          {loadingProfile ? (
            <View style={{ paddingVertical: 18, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text
                style={{
                  color: theme.muted,
                  marginTop: 10,
                  fontSize: 13,
                }}
              >
                Loading profile...
              </Text>
            </View>
          ) : (
            <>
              <InputField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                theme={theme}
              />
              <Divider theme={theme} />
              <InputField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                theme={theme}
              />
            </>
          )}
        </Card>

        <TouchableOpacity
          onPress={handleSaveProfile}
          activeOpacity={0.9}
          disabled={saving || loadingProfile}
          style={{
            backgroundColor: theme.accent,
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
            marginBottom: 8,
            opacity: saving || loadingProfile ? 0.7 : 1,
          }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Role Request
        </Text>

        <Card theme={theme}>
          <InfoRow
            emoji="🪪"
            title="Current Role"
            value={currentRoleLabel}
            theme={theme}
          />
          <Divider theme={theme} />
          <View style={{ paddingHorizontal: 2, paddingVertical: 4 }}>
            <Text
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: "700",
                marginBottom: 10,
              }}
            >
              Request Role Change
            </Text>

            <Text
              style={{
                color: theme.muted,
                fontSize: 13,
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              Role changes are handled manually right now. Please contact the
              developer or admin if you need access changes.
            </Text>

            <TouchableOpacity
              onPress={handleRoleRequest}
              activeOpacity={0.9}
              style={{
                marginTop: 4,
                backgroundColor: theme.pillBg,
                borderRadius: 16,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: theme.accent,
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                Contact for Role Change
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>{children}</View>
  )
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

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  theme,
}: {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  theme: AppTheme
}) {
  return (
    <View style={{ paddingVertical: 4 }}>
      <Text
        style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        style={{
          height: Platform.OS === "ios" ? 50 : 48,
          borderRadius: 14,
          backgroundColor: theme.iconBoxBg,
          color: theme.text,
          paddingHorizontal: 14,
          fontSize: 15,
        }}
      />
    </View>
  )
}