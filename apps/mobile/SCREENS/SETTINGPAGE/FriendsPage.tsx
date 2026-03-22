import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../SETTINGPAGE/AUTH/AuthContext"
import { useTheme } from "../NAV/ThemeProvider"
import { createStyles } from "./FriendsPage.styles"

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

type UserPreview = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type FriendRequest = {
  id: string
  requester: UserPreview
  addressee: UserPreview
}

type FriendItem = {
  friendshipId: string
  friend: UserPreview
}

type SharingItem = {
  friendId: string
  isSharing: boolean
}

async function apiFetch(
  path: string,
  token: string | null,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed")
  }

  return data
}

export function FriendsPage() {
  const navigation = useNavigation<any>()
  const { token, isAuthenticated, isHydrating } = useAuth()
  const { theme } = useTheme()
  const styles = createStyles(theme)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sending, setSending] = useState(false)
  const [turningOffAll, setTurningOffAll] = useState(false)
  const [togglingFriendId, setTogglingFriendId] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [searchText, setSearchText] = useState("")
  const [incoming, setIncoming] = useState<FriendRequest[]>([])
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [sharingMap, setSharingMap] = useState<Record<string, boolean>>({})

  const pendingCount = useMemo(
    () => incoming.length + outgoing.length,
    [incoming.length, outgoing.length]
  )

  const sharingCount = useMemo(
    () => Object.values(sharingMap).filter(Boolean).length,
    [sharingMap]
  )

  const filteredFriends = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) return friends

    return friends.filter((item) => {
      const fullName =
        `${item.friend.firstName} ${item.friend.lastName}`.toLowerCase()
      return fullName.includes(keyword)
    })
  }, [friends, searchText])

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false)
      setRefreshing(false)
      return
    }

    try {
      const [incomingRes, outgoingRes, friendsRes, sharingRes] = await Promise.all([
        apiFetch("/friends/requests/incoming", token),
        apiFetch("/friends/requests/outgoing", token),
        apiFetch("/friends", token),
        apiFetch("/location/sharing", token),
      ])

      setIncoming(incomingRes.requests || [])
      setOutgoing(outgoingRes.requests || [])
      setFriends(friendsRes.friends || [])

      const nextSharingMap: Record<string, boolean> = {}
      ;(sharingRes.items || []).forEach((item: SharingItem) => {
        nextSharingMap[item.friendId] = item.isSharing
      })
      setSharingMap(nextSharingMap)
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not load friends")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    if (isHydrating) return
    if (!isAuthenticated || !token) {
      setLoading(false)
      return
    }
    load()
  }, [isHydrating, isAuthenticated, token, load])

  async function onRefresh() {
    setRefreshing(true)
    await load()
  }

  async function sendRequest() {
    const normalized = email.trim().toLowerCase()

    if (!normalized) {
      Alert.alert("Missing email", "Please enter a CSUB email.")
      return
    }

    if (!token) {
      Alert.alert("Unauthorized", "Please log in again.")
      return
    }

    try {
      setSending(true)
      await apiFetch("/friends/request", token, {
        method: "POST",
        body: JSON.stringify({ email: normalized }),
      })
      setEmail("")
      Alert.alert("Success", "Friend request sent.")
      await load()
    } catch (err: any) {
      Alert.alert("Send failed", err.message || "Could not send request")
    } finally {
      setSending(false)
    }
  }

  async function acceptRequest(id: string) {
    if (!token) return

    try {
      await apiFetch(`/friends/requests/${id}/accept`, token, {
        method: "POST",
      })
      await load()
    } catch (err: any) {
      Alert.alert("Accept failed", err.message || "Could not accept request")
    }
  }

  async function rejectRequest(id: string) {
    if (!token) return

    try {
      await apiFetch(`/friends/requests/${id}/reject`, token, {
        method: "POST",
      })
      await load()
    } catch (err: any) {
      Alert.alert("Reject failed", err.message || "Could not reject request")
    }
  }

  async function toggleShare(friendId: string, nextValue: boolean) {
    if (!token) return

    try {
      setTogglingFriendId(friendId)

      if (nextValue) {
        await apiFetch(`/location/share/${friendId}`, token, {
          method: "POST",
        })
      } else {
        await apiFetch(`/location/share/${friendId}`, token, {
          method: "DELETE",
        })
      }

      setSharingMap((prev) => ({
        ...prev,
        [friendId]: nextValue,
      }))
    } catch (err: any) {
      Alert.alert("Share update failed", err.message || "Could not update sharing")
    } finally {
      setTogglingFriendId(null)
    }
  }

  function confirmTurnOffAllSharing() {
    Alert.alert(
      "Turn OFF all sharing",
      "This will stop sharing your location with all friends.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Turn OFF all",
          style: "destructive",
          onPress: async () => {
            if (!token) return

            try {
              setTurningOffAll(true)
              await apiFetch("/location/share/all-off", token, {
                method: "POST",
              })

              setSharingMap((prev) => {
                const next: Record<string, boolean> = {}
                for (const key of Object.keys(prev)) {
                  next[key] = false
                }
                return next
              })

              Alert.alert("Done", "All location sharing has been turned off.")
            } catch (err: any) {
              Alert.alert("Turn OFF failed", err.message || "Could not turn off all sharing")
            } finally {
              setTurningOffAll(false)
            }
          },
        },
      ]
    )
  }

  function confirmRemove(friendshipId: string, fullName: string) {
    Alert.alert("Remove friend", `Remove ${fullName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (!token) return

          try {
            await apiFetch(`/friends/${friendshipId}`, token, {
              method: "DELETE",
            })
            await load()
          } catch (err: any) {
            Alert.alert("Remove failed", err.message || "Could not remove friend")
          }
        },
      },
    ])
  }

  if (loading || isHydrating) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={styles.loadingText}>Loading friends...</Text>
      </SafeAreaView>
    )
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Please log in to view friends.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Friends</Text>

            <View style={styles.headerIconBadge}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={18}
                color={theme.accent}
              />
            </View>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.pageSubtext}>
          Invite friends, respond to requests, and control location sharing.
        </Text>

        <View style={styles.statsRow}>
          <StatCard label="Friends" value={friends.length} styles={styles} />
          <StatCard label="Pending" value={pendingCount} styles={styles} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Sharing</Text>
          <Text style={styles.sectionSub}>
            Control who can see your location.
          </Text>

          <View style={styles.sharingSummaryBox}>
            <Text style={styles.sharingSummaryTitle}>
              Sharing with {sharingCount} friend{sharingCount === 1 ? "" : "s"}
            </Text>
            <Text style={styles.sharingSummarySub}>
              You can turn off all active sharing at once.
            </Text>

            <TouchableOpacity
  style={[
    styles.turnOffAllBtn,
    (turningOffAll || sharingCount === 0) && styles.turnOffAllBtnDisabled,
  ]}
  onPress={confirmTurnOffAllSharing}
  disabled={turningOffAll || sharingCount === 0}
>
  <Text
    style={[
      styles.turnOffAllBtnText,
      (turningOffAll || sharingCount === 0) && styles.turnOffAllBtnTextDisabled,
    ]}
  >
    {turningOffAll ? "Turning OFF..." : "Turn OFF all sharing"}
  </Text>
</TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Friend</Text>
          <Text style={styles.sectionSub}>
            Send a request using a CSUB email address.
          </Text>

          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color={theme.muted}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="friend@csub.edu"
              placeholderTextColor={theme.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, sending && styles.disabledBtn]}
            onPress={sendRequest}
            disabled={sending}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>
              {sending ? "Sending..." : "Send Request"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={theme.muted}
          />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search friends by name"
            placeholderTextColor={theme.muted}
            style={styles.searchInput}
          />
        </View>

        <SectionHeader title="Incoming Requests" count={incoming.length} styles={styles} />
        <View style={styles.section}>
          {incoming.length === 0 ? (
            <EmptyState text="No incoming requests." styles={styles} themeMuted={theme.muted} />
          ) : (
            incoming.map((item) => {
              const fullName = `${item.requester.firstName} ${item.requester.lastName}`

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <AvatarLetter
                      letter={item.requester.firstName?.[0]}
                      styles={styles}
                    />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{fullName}</Text>
                      <Text style={styles.cardEmail}>{item.requester.email}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={() => acceptRequest(item.id)}
                    >
                      <Text style={styles.actionBtnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => rejectRequest(item.id)}
                    >
                      <Text style={styles.actionBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )}
        </View>

        <SectionHeader title="Sent Requests" count={outgoing.length} styles={styles} />
        <View style={styles.section}>
          {outgoing.length === 0 ? (
            <EmptyState text="No sent requests." styles={styles} themeMuted={theme.muted} />
          ) : (
            outgoing.map((item) => {
              const fullName = `${item.addressee.firstName} ${item.addressee.lastName}`

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <AvatarLetter
                      letter={item.addressee.firstName?.[0]}
                      styles={styles}
                    />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{fullName}</Text>
                      <Text style={styles.cardEmail}>{item.addressee.email}</Text>
                    </View>
                  </View>

                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending approval</Text>
                  </View>
                </View>
              )
            })
          )}
        </View>

        <SectionHeader title="Your Friends" count={filteredFriends.length} styles={styles} />
        <View style={styles.section}>
          {friends.length === 0 ? (
            <EmptyState text="No friends yet." styles={styles} themeMuted={theme.muted} />
          ) : filteredFriends.length === 0 ? (
            <EmptyState text="No matching friends found." styles={styles} themeMuted={theme.muted} />
          ) : (
            filteredFriends.map((item) => {
              const fullName = `${item.friend.firstName} ${item.friend.lastName}`
              const isSharing = !!sharingMap[item.friend.id]
              const isBusy = togglingFriendId === item.friend.id

              return (
                <View key={item.friendshipId} style={styles.friendRow}>
                  <View style={styles.friendTopRow}>
                    <AvatarLetter
                      letter={item.friend.firstName?.[0]}
                      styles={styles}
                    />

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{fullName}</Text>
                      <Text style={styles.cardEmail}>{item.friend.email}</Text>
                    </View>
                  </View>

                  <View style={styles.friendBottomRow}>
                    <View style={styles.sharingTextWrap}>
                      <Text style={styles.sharingLabel}>Share my location</Text>
                      <Text style={styles.sharingState}>
                        {isSharing ? "Currently ON" : "Currently OFF"}
                      </Text>
                    </View>

                    <Switch
                      value={isSharing}
                      disabled={isBusy}
                      onValueChange={(value) => toggleShare(item.friend.id, value)}
                      trackColor={{ false: theme.divider, true: theme.accent }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={styles.friendActionsRow}>
                    <TouchableOpacity
                      style={styles.removeGhostBtn}
                      onPress={() => confirmRemove(item.friendshipId, fullName)}
                    >
                      <Text style={styles.removeGhostText}>Remove Friend</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({
  label,
  value,
  styles,
}: {
  label: string
  value: number
  styles: any
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function SectionHeader({
  title,
  count,
  styles,
}: {
  title: string
  count: number
  styles: any
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{count}</Text>
      </View>
    </View>
  )
}

function EmptyState({
  text,
  styles,
  themeMuted,
}: {
  text: string
  styles: any
  themeMuted: string
}) {
  return (
    <View style={styles.emptyWrap}>
      <MaterialCommunityIcons
        name="account-outline"
        size={22}
        color={themeMuted}
      />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  )
}

function AvatarLetter({
  letter,
  styles,
}: {
  letter?: string
  styles: any
}) {
  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarLetter}>{letter || "U"}</Text>
    </View>
  )
}