import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { styles } from "./EventPage.styles"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { EventsStackParamList } from "../NAV/EventsStack"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const API_BASE = "http://localhost:3001" // TODO: đổi sang LAN IP nếu chạy trên phone thật

type DbEvent = {
  id: string
  title: string
  organization: string
  startAt: string
  endAt: string
  roomNote: string | null
  building: { id: string; name: string; slug: string; centerLat: number; centerLng: number }
}

type NavPlace = { id: string; title: string; latitude: number; longitude: number }

type EventCard = {
  id: string
  dayIndex: number
  title: string
  organization: string
  building: string
  addressLine: string
  timeLabel: string
  navPlace: NavPlace
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function getMonday(d: Date) {
  const day = d.getDay() // Sun=0
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(d.getDate() + n)
  return x
}

function formatTimeLabel(startIso: string, endIso: string) {
  const s = new Date(startIso)
  const e = new Date(endIso)

  const fmt = (d: Date) => {
    let h = d.getHours()
    const m = d.getMinutes()
    const ampm = h >= 12 ? "PM" : "AM"
    h = h % 12
    if (h === 0) h = 12
    return `${h}:${pad2(m)} ${ampm}`
  }

  return `${fmt(s)} – ${fmt(e)}`
}

function dayIndexMon0(dateIso: string) {
  const d = new Date(dateIso)
  const js = d.getDay() // 0..6
  return js === 0 ? 6 : js - 1 // Mon=0 ... Sun=6
}

function weekLabel(weekStart: Date) {
  const end = addDays(weekStart, 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  return `Week of ${fmt(weekStart)} – ${fmt(end)}`
}

export function EventPage() {
  const insets = useSafeAreaInsets()
  const navigation =
    useNavigation<NativeStackNavigationProp<EventsStackParamList, "EventHome">>()

  // ✅ "today week" anchor
  const currentWeekStart = useMemo(() => getMonday(new Date()), [])
  const [weekStart, setWeekStart] = useState(() => currentWeekStart)

  // active day
  const [activeDay, setActiveDay] = useState(() => dayIndexMon0(new Date().toISOString()))

  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<EventCard[]>([])

  // ✅ clamp: never allow weekStart earlier than current week
  useEffect(() => {
    if (weekStart.getTime() < currentWeekStart.getTime()) {
      setWeekStart(currentWeekStart)
      setActiveDay(dayIndexMon0(new Date().toISOString()))
    }
  }, [weekStart, currentWeekStart])

  const fromStr = useMemo(() => toYYYYMMDD(weekStart), [weekStart])
  const toStr = useMemo(() => toYYYYMMDD(addDays(weekStart, 6)), [weekStart])

  const dayDateLabels = useMemo(() => {
    return days.map((d, idx) => {
      const date = addDays(weekStart, idx)
      return { d, date, dateStr: toYYYYMMDD(date) }
    })
  }, [weekStart])

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${API_BASE}/api/events?from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(
        toStr
      )}`
      const res = await fetch(url)
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Error", data?.error ?? "Failed to load events")
        setEvents([])
        return
      }

      const items: DbEvent[] = Array.isArray(data?.items) ? data.items : []

      const mapped: EventCard[] = items.map((ev) => {
        const idx = dayIndexMon0(ev.startAt)
        const b = ev.building

        return {
          id: ev.id,
          dayIndex: idx,
          title: ev.title,
          organization: ev.organization,
          building: b?.name ?? "Unknown building",
          addressLine: ev.roomNote?.trim()
            ? `${b?.name ?? ""} • ${ev.roomNote.trim()}`
            : `${b?.name ?? ""}`,
          timeLabel: formatTimeLabel(ev.startAt, ev.endAt),
          navPlace: {
            id: b.id,
            title: b.name,
            latitude: b.centerLat,
            longitude: b.centerLng,
          },
        }
      })

      setEvents(mapped)
    } catch (e: any) {
      Alert.alert("Network error", e?.message ?? "Failed to connect to server")
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [fromStr, toStr])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useFocusEffect(
    useCallback(() => {
      loadEvents()
    }, [loadEvents])
  )

  // =========================
  // ✅ Navigate chắc chắn
  // =========================
  const navigateToMap = useCallback(
    (place: NavPlace) => {
      const intent = { type: "route_to", place }

      const MAP_ROUTE_CANDIDATES = ["Map", "MapPage", "MapHome"]
      const MAP_TAB_CANDIDATES = ["MapTab", "MapStack", "MapRoot", "Map"]

      const chain: any[] = []
      let cur: any = navigation as any
      while (cur) {
        chain.push(cur)
        cur = cur.getParent?.()
      }

      const tryNavigate = (navObj: any, tryFn: () => void) => {
        try {
          tryFn()
          return true
        } catch {
          return false
        }
      }

      for (const navObj of chain) {
        for (const name of MAP_ROUTE_CANDIDATES) {
          const ok = tryNavigate(navObj, () => navObj.navigate(name, { intent }))
          if (ok) return
        }
      }

      for (const navObj of chain) {
        for (const tabName of MAP_TAB_CANDIDATES) {
          for (const screenName of MAP_ROUTE_CANDIDATES) {
            const ok = tryNavigate(navObj, () =>
              navObj.navigate(tabName, {
                screen: screenName,
                params: { intent },
              })
            )
            if (ok) return
          }
        }
      }

      const top = chain[chain.length - 1]
      const state = top?.getState?.()
      Alert.alert("Navigate failed", "Không tìm thấy route Map trong navigator.")
      // eslint-disable-next-line no-console
      console.log("ROOT NAV STATE:", JSON.stringify(state, null, 2))
    },
    [navigation]
  )

  const dayEvents = events.filter((e) => e.dayIndex === activeDay)

  // ✅ rule: cannot go before current week
  const canGoPrev = weekStart.getTime() > currentWeekStart.getTime()

  const onPrevWeek = useCallback(() => {
    if (!canGoPrev) return
    setWeekStart((w) => addDays(w, -7))
  }, [canGoPrev])

  const onNextWeek = useCallback(() => {
    setWeekStart((w) => addDays(w, 7))
  }, [])

  const onThisWeek = useCallback(() => {
    setWeekStart(currentWeekStart)
    setActiveDay(dayIndexMon0(new Date().toISOString()))
  }, [currentWeekStart])

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
  contentInsetAdjustmentBehavior="never"
  scrollIndicatorInsets={{ bottom: 0 }}
  style={{ marginBottom: -insets.bottom }} // ✅ kéo content xuống, ăn luôn safe-area
>
        {/* ===== Week Picker Header ===== */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          {/* ✅ Prev (disabled if current week) */}
          <TouchableOpacity
            onPress={onPrevWeek}
            disabled={!canGoPrev}
            activeOpacity={0.85}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              opacity: canGoPrev ? 1 : 0.35,
            }}
          >
            <Text style={{ fontWeight: "700" }}>‹</Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#0F172A" }}>
              {weekLabel(weekStart)}
            </Text>

            <TouchableOpacity onPress={onThisWeek} activeOpacity={0.85} style={{ marginTop: 6 }}>
              <Text style={{ color: "#2563EB", fontWeight: "700" }}>This week</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Next always allowed (future) */}
          <TouchableOpacity
            onPress={onNextWeek}
            activeOpacity={0.85}
            style={{ paddingVertical: 8, paddingHorizontal: 10 }}
          >
            <Text style={{ fontWeight: "700" }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ===== Day Tabs (Mon–Sun) ===== */}
        <View style={styles.tabsRow}>
          {dayDateLabels.map(({ d, dateStr }, index) => {
            const isActive = activeDay === index
            return (
              <TouchableOpacity
                key={d + dateStr}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveDay(index)}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{d}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* ===== Section Header ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {days[activeDay]} • {dayDateLabels[activeDay]?.dateStr}
          </Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{loading ? "…" : dayEvents.length} events</Text>
          </View>
        </View>

        {loading && (
          <View style={{ paddingVertical: 14, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={styles.emptySub}>Loading events…</Text>
          </View>
        )}

        {!loading && dayEvents.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No events</Text>
            <Text style={styles.emptySub}>Try another day or another week.</Text>
          </View>
        )}

        {!loading &&
          dayEvents.map((event) => (
            <View key={event.id} style={styles.card}>
              <View style={styles.flyer}>
                <View style={styles.flyerPlaceholder}>
                  <Text style={styles.flyerPlaceholderTitle}>Flyer Preview</Text>
                  <Text style={styles.flyerPlaceholderSub}>Upload flyer to make it stand out</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{event.title}</Text>
                </View>

                <Text style={styles.orgText}>{event.organization}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>{event.building}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>{event.timeLabel}</Text>
                  </View>
                </View>

                <Text style={styles.addressText}>{event.addressLine}</Text>

                <View style={styles.footerRow}>
                  <View style={styles.timePill}>
                    <Text style={styles.timeText}>{event.timeLabel}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => navigateToMap(event.navPlace)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.navBtnText}>Navigate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

        {/* ===== Add Event ===== */}
        <View style={styles.createBtnWrap}>
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("CreateEvent", { weekStartISO: weekStart.toISOString() })}
          >
            <Text style={styles.createButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}