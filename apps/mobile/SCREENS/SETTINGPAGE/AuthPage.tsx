import React, { useEffect, useMemo, useState } from "react"
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { styles } from "./AuthPage.styles"
import { useAuth } from "./AUTH/AuthContext"

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

type AuthMode = "login" | "signup"

export function AuthPage() {
  const navigation = useNavigation<any>()
  const { setAuthSession } = useAuth()

  const [mode, setMode] = useState<AuthMode>("login")
  const [submitting, setSubmitting] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [otpCode, setOtpCode] = useState("")
  const [otpModalVisible, setOtpModalVisible] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendingOtp, setResendingOtp] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const [forgotModalVisible, setForgotModalVisible] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [sendingResetCode, setSendingResetCode] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)
  const [resetCooldown, setResetCooldown] = useState(0)

  const title = useMemo(() => {
    return mode === "login" ? "Welcome back" : "Create your account"
  }, [mode])

  const subtitle = useMemo(() => {
    return mode === "login"
      ? "Log in to access your personal settings and campus tools."
      : "Sign up to unlock settings, QR tools, and personalized features."
  }, [mode])

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  useEffect(() => {
    if (resetCooldown <= 0) return

    const timer = setInterval(() => {
      setResetCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resetCooldown])

  const resetSignupFields = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  const resetForgotPasswordFields = () => {
    setResetCode("")
    setNewPassword("")
    setConfirmNewPassword("")
    setResetCooldown(0)
  }

  const openForgotPasswordModal = () => {
    setResetEmail(email.trim().toLowerCase())
    setResetCode("")
    setNewPassword("")
    setConfirmNewPassword("")
    setResetCooldown(0)
    setForgotModalVisible(true)
  }

  const closeForgotPasswordModal = () => {
    setForgotModalVisible(false)
    resetForgotPasswordFields()
  }

  const validateNewPassword = (value: string) => {
    const hasMinLength = value.length >= 8
    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    return hasMinLength && hasUppercase && hasLowercase
  }

  const handleVerifyOtp = async () => {
    try {
      if (!pendingEmail.trim() || !otpCode.trim()) {
        Alert.alert("Missing code", "Please enter the verification code.")
        return
      }

      setVerifyingOtp(true)

      const res = await fetch(`${API_BASE}/api/auth/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail.trim().toLowerCase(),
          code: otpCode.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Verification failed", data?.error ?? "Unable to verify code.")
        return
      }

      await setAuthSession(data.token, data.user)
      setOtpModalVisible(false)
      setOtpCode("")
      setPendingEmail("")
      setResendCooldown(0)
      resetSignupFields()
      navigation.goBack()
    } catch (error: any) {
      Alert.alert("Network error", error?.message ?? "Something went wrong.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      if (resendingOtp || resendCooldown > 0) return

      if (!pendingEmail.trim()) {
        Alert.alert("Missing email", "No pending signup email found.")
        return
      }

      setResendingOtp(true)

      const res = await fetch(`${API_BASE}/api/auth/signup/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail.trim().toLowerCase(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Resend failed", data?.error ?? "Unable to resend code.")
        return
      }

      setResendCooldown(30)
      Alert.alert("Code resent", "A new verification code has been sent.")
    } catch (error: any) {
      Alert.alert("Network error", error?.message ?? "Something went wrong.")
    } finally {
      setResendingOtp(false)
    }
  }

  const handleSendResetCode = async () => {
    try {
      if (sendingResetCode || resetCooldown > 0) return

      const normalizedEmail = resetEmail.trim().toLowerCase()

      if (!normalizedEmail) {
        Alert.alert("Missing email", "Please enter your email.")
        return
      }

      if (!normalizedEmail.endsWith("@csub.edu")) {
        Alert.alert("Invalid email", "Please use your CSUB email address.")
        return
      }

      setSendingResetCode(true)

      const res = await fetch(`${API_BASE}/api/auth/forgot-password/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Request failed", data?.error ?? "Unable to send reset code.")
        return
      }

      setResetCooldown(30)
      Alert.alert("Code sent", "A password reset code has been sent to your email.")
    } catch (error: any) {
      Alert.alert("Network error", error?.message ?? "Something went wrong.")
    } finally {
      setSendingResetCode(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      const normalizedEmail = resetEmail.trim().toLowerCase()

      if (!normalizedEmail) {
        Alert.alert("Missing email", "Please enter your email.")
        return
      }

      if (!normalizedEmail.endsWith("@csub.edu")) {
        Alert.alert("Invalid email", "Please use your CSUB email address.")
        return
      }

      if (!resetCode.trim()) {
        Alert.alert("Missing code", "Please enter the reset code.")
        return
      }

      if (resetCode.trim().length !== 6) {
        Alert.alert("Invalid code", "Reset code must be 6 digits.")
        return
      }

      if (!newPassword.trim() || !confirmNewPassword.trim()) {
        Alert.alert("Missing info", "Please enter your new password twice.")
        return
      }

      if (!validateNewPassword(newPassword)) {
        Alert.alert(
          "Weak password",
          "Password must be at least 8 characters and include uppercase and lowercase letters."
        )
        return
      }

      if (newPassword !== confirmNewPassword) {
        Alert.alert("Password mismatch", "Passwords do not match.")
        return
      }

      setResettingPassword(true)

      const res = await fetch(`${API_BASE}/api/auth/forgot-password/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          code: resetCode.trim(),
          newPassword,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Reset failed", data?.error ?? "Unable to reset password.")
        return
      }

      Alert.alert("Password updated", "Your password has been reset. Please log in.")
      setEmail(normalizedEmail)
      setPassword("")
      closeForgotPasswordModal()
      setMode("login")
    } catch (error: any) {
      Alert.alert("Network error", error?.message ?? "Something went wrong.")
    } finally {
      setResettingPassword(false)
    }
  }

  const onPressSubmit = async () => {
    try {
      if (mode === "login") {
        if (!email.trim() || !password.trim()) {
          Alert.alert("Missing info", "Please enter your email and password.")
          return
        }

        setSubmitting(true)

        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          Alert.alert("Login failed", data?.error ?? "Unable to log in.")
          return
        }

        await setAuthSession(data.token, data.user)
        navigation.goBack()
        return
      }

      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        Alert.alert("Missing info", "Please complete all fields.")
        return
      }

      if (password !== confirmPassword) {
        Alert.alert("Password mismatch", "Passwords do not match.")
        return
      }

      setSubmitting(true)

      const normalizedEmail = email.trim().toLowerCase()

      const res = await fetch(`${API_BASE}/api/auth/signup/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          password,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Sign up failed", data?.error ?? "Unable to create account.")
        return
      }

      setPendingEmail(normalizedEmail)
      setOtpCode("")
      setResendCooldown(0)
      setOtpModalVisible(true)
    } catch (error: any) {
      Alert.alert("Network error", error?.message ?? "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>

          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>RAMP</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIconText}>R</Text>
          </View>

          <Text style={styles.heroTitle}>CSUB</Text>
          <Text style={styles.heroSubtitle}>{title}</Text>
          <Text style={styles.heroDescription}>{subtitle}</Text>
        </View>

        <View style={styles.segmentWrap}>
          <TouchableOpacity
            style={[styles.segmentBtn, mode === "login" && styles.segmentBtnActive]}
            onPress={() => setMode("login")}
            activeOpacity={0.9}
          >
            <Text
              style={[styles.segmentBtnText, mode === "login" && styles.segmentBtnTextActive]}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, mode === "signup" && styles.segmentBtnActive]}
            onPress={() => setMode("signup")}
            activeOpacity={0.9}
          >
            <Text
              style={[styles.segmentBtnText, mode === "signup" && styles.segmentBtnTextActive]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {mode === "signup" && (
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Nguyen"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Long"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="yourname@csub.edu"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {mode === "signup" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {mode === "login" ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.helperRow}
              onPress={openForgotPasswordModal}
            >
              <Text style={styles.helperText}>Forgot password?</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.helperBlock}>
              <Text style={styles.helperNote}>
                Use your CSUB email to create an account.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={onPressSubmit}
            activeOpacity={0.9}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {mode === "login" ? "Log In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomTextWrap}>
          <Text style={styles.bottomText}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </Text>

          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            activeOpacity={0.8}
          >
            <Text style={styles.bottomLink}>
              {mode === "login" ? " Sign Up" : " Log In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={otpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setOtpModalVisible(false)
          setOtpCode("")
          setResendCooldown(0)
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(17, 24, 39, 0.45)",
            justifyContent: "center",
            paddingHorizontal: 22,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 22,
              paddingBottom: 18,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "#EEF2FF",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 14,
              }}
            >
              <MaterialCommunityIcons
                name="email-check-outline"
                size={28}
                color="#4F46E5"
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#111827",
                textAlign: "center",
              }}
            >
              Verify your email
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 21,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              Enter the 6-digit code sent to:
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: "700",
                color: "#111827",
                textAlign: "center",
              }}
            >
              {pendingEmail}
            </Text>

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Verification Code
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  textAlign: "center",
                  letterSpacing: 6,
                }}
                value={otpCode}
                onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, "").slice(0, 6))}
                placeholder="000000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={{
                marginTop: 18,
                backgroundColor: "#4F46E5",
                borderRadius: 16,
                paddingVertical: 15,
                alignItems: "center",
                opacity: verifyingOtp ? 0.7 : 1,
              }}
              onPress={handleVerifyOtp}
              activeOpacity={0.9}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "800",
                  }}
                >
                  Verify Code
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 12,
                borderRadius: 16,
                paddingVertical: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                opacity: resendingOtp || resendCooldown > 0 ? 0.7 : 1,
              }}
              onPress={handleResendOtp}
              activeOpacity={0.9}
              disabled={resendingOtp || resendCooldown > 0}
            >
              {resendingOtp ? (
                <ActivityIndicator color="#4F46E5" />
              ) : (
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {resendCooldown > 0
                    ? `Resend Code in ${resendCooldown}s`
                    : "Resend Code"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 10,
                alignItems: "center",
                paddingVertical: 8,
              }}
              onPress={() => {
                setOtpModalVisible(false)
                setOtpCode("")
                setResendCooldown(0)
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeForgotPasswordModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(17, 24, 39, 0.45)",
            justifyContent: "center",
            paddingHorizontal: 22,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 22,
              paddingBottom: 18,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "#EEF2FF",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 14,
              }}
            >
              <MaterialCommunityIcons
                name="lock-reset"
                size={28}
                color="#4F46E5"
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#111827",
                textAlign: "center",
              }}
            >
              Reset your password
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 21,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              Enter your CSUB email, reset code, and your new password.
            </Text>

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Email
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: "#111827",
                }}
                value={resetEmail}
                onChangeText={setResetEmail}
                placeholder="yourname@csub.edu"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              style={{
                marginTop: 14,
                borderRadius: 16,
                paddingVertical: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                opacity: sendingResetCode || resetCooldown > 0 ? 0.7 : 1,
              }}
              onPress={handleSendResetCode}
              activeOpacity={0.9}
              disabled={sendingResetCode || resetCooldown > 0}
            >
              {sendingResetCode ? (
                <ActivityIndicator color="#4F46E5" />
              ) : (
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {resetCooldown > 0
                    ? `Resend Code in ${resetCooldown}s`
                    : "Send Reset Code"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Reset Code
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  textAlign: "center",
                  letterSpacing: 6,
                }}
                value={resetCode}
                onChangeText={(text) => setResetCode(text.replace(/[^0-9]/g, "").slice(0, 6))}
                placeholder="000000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={{ marginTop: 14 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                New Password
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: "#111827",
                }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ marginTop: 14 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Confirm New Password
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: "#111827",
                }}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Re-enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={{
                marginTop: 18,
                backgroundColor: "#4F46E5",
                borderRadius: 16,
                paddingVertical: 15,
                alignItems: "center",
                opacity: resettingPassword ? 0.7 : 1,
              }}
              onPress={handleResetPassword}
              activeOpacity={0.9}
              disabled={resettingPassword}
            >
              {resettingPassword ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: "800",
                  }}
                >
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 10,
                alignItems: "center",
                paddingVertical: 8,
              }}
              onPress={closeForgotPasswordModal}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}