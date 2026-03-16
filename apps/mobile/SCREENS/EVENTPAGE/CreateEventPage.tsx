import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import { styles } from "./CreateEventPage.styles"
import type { EventsStackParamList } from "../NAV/EventsStack" // ✅ vì stack của bạn nằm trong NAV
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
type CreateEventRoute = RouteProp<EventsStackParamList, "CreateEvent">

type BuildingItem = {
  id: string
  slug: string
  name: string
  center: { lat: number; lng: number }
  campus: string
  score: number
}

const API_BASE = "http://localhost:3001"
// NOTE: tạm giống curl của bạn (LA offset)
const TZ_OFFSET = "-07:00"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(d.getDate() + n)
  return x
}

function buildTimeSlots15m(startHour = 7, endHour = 22) {
  const slots: string[] = []
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endHour && m > 0) break
      slots.push(`${pad2(h)}:${pad2(m)}`) // 24h HH:mm
    }
  }
  return slots
}

function prettyTime(hhmm: string) {
  const [hStr, mStr] = hhmm.split(":")
  let h = Number(hStr)
  const m = Number(mStr)
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${pad2(m)} ${ampm}`
}

export function CreateEventPage() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const route = useRoute<CreateEventRoute>()

  const weekStart = useMemo(() => new Date(route.params.weekStartISO), [route.params.weekStartISO])

  const [eventTitle, setEventTitle] = useState("")
  const [organization, setOrganization] = useState("")

  // week date options (Mon..Sun)
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = addDays(weekStart, idx)
      return {
        idx,
        date: d,
        dateStr: toYYYYMMDD(d),
        label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      }
    })
  }, [weekStart])

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const todayStr = toYYYYMMDD(new Date())
    const found = weekDates.find((x) => x.dateStr === todayStr)
    return found?.dateStr ?? weekDates[0]?.dateStr ?? ""
  })

  useEffect(() => {
    const todayStr = toYYYYMMDD(new Date())
    const found = weekDates.find((x) => x.dateStr === todayStr)
    setSelectedDateStr(found?.dateStr ?? weekDates[0]?.dateStr ?? "")
  }, [weekDates])

  // times
  const timeSlots = useMemo(() => buildTimeSlots15m(7, 22), [])
  const [startHHMM, setStartHHMM] = useState<string>("10:00")
  const [endHHMM, setEndHHMM] = useState<string>("11:00")

  // time picker modal
  const [timePickerOpen, setTimePickerOpen] = useState<null | "start" | "end">(null)

  // building search
  const [buildingQuery, setBuildingQuery] = useState("")
  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [buildingName, setBuildingName] = useState("")
  const [suggestions, setSuggestions] = useState<BuildingItem[]>([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const debounceRef = useRef<any>(null)

  const [roomNote, setRoomNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // debounce building search
  useEffect(() => {
    const q = buildingQuery.trim()
    if (!q) {
      setSuggestions([])
      return
    }

    setLoadingSuggest(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const url = `${API_BASE}/api/buildings/search?q=${encodeURIComponent(q)}&limit=8`
        const res = await fetch(url)
        const data = await res.json()
        setSuggestions(Array.isArray(data?.items) ? data.items : [])
      } catch {
        setSuggestions([])
      } finally {
        setLoadingSuggest(false)
      }
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [buildingQuery])

  // keep end > start
  useEffect(() => {
    const sIdx = timeSlots.indexOf(startHHMM)
    const eIdx = timeSlots.indexOf(endHHMM)
    if (sIdx !== -1 && eIdx !== -1 && eIdx <= sIdx) {
      const next = timeSlots[Math.min(sIdx + 4, timeSlots.length - 1)] // +60 mins
      setEndHHMM(next)
    }
  }, [startHHMM, endHHMM, timeSlots])

  const startAt = useMemo(() => {
    if (!selectedDateStr) return ""
    return `${selectedDateStr}T${startHHMM}:00${TZ_OFFSET}`
  }, [selectedDateStr, startHHMM])

  const endAt = useMemo(() => {
    if (!selectedDateStr) return ""
    return `${selectedDateStr}T${endHHMM}:00${TZ_OFFSET}`
  }, [selectedDateStr, endHHMM])

  const isFutureAndValid = useMemo(() => {
    const s = new Date(startAt)
    const e = new Date(endAt)
    const now = new Date()
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return false
    if (e <= s) return false
    if (s <= now) return false
    return true
  }, [startAt, endAt])

  const canSubmit = useMemo(() => {
    if (eventTitle.trim().length === 0) return false
    if (organization.trim().length === 0) return false
    if (!buildingId) return false
    if (!selectedDateStr) return false
    if (!startHHMM || !endHHMM) return false
    if (!isFutureAndValid) return false
    return true
  }, [eventTitle, organization, buildingId, selectedDateStr, startHHMM, endHHMM, isFutureAndValid])

  async function onCreate() {
    if (!canSubmit || !buildingId) return

    if (!isFutureAndValid) {
      Alert.alert("Invalid time", "You can only create events in the future.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle.trim(),
          organization: organization.trim(),
          buildingId,
          roomNote: roomNote.trim(),
          startAt,
          endAt,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 409) {
        const c = data?.conflict
        Alert.alert(
          "Schedule conflict",
          c
            ? `Conflicts with: ${c.title}\n${new Date(c.startAt).toLocaleString()} - ${new Date(c.endAt).toLocaleString()}`
            : "Another event exists in this building during that time."
        )
        return
      }

      if (!res.ok) {
        Alert.alert("Error", data?.error ?? "Failed to create event")
        return
      }

      Alert.alert("Created", "Event created successfully")
      navigation.goBack()
    } catch (e: any) {
      Alert.alert("Network error", e?.message ?? "Failed to connect to server")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
       <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
  contentInsetAdjustmentBehavior="never"
  scrollIndicatorInsets={{ bottom: 0 }}
  style={{ marginBottom: -insets.bottom }} // ✅ kéo content xuống, ăn luôn safe-area
>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Add Event</Text>
            <Text style={styles.headerSub}>CSUB • Events</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* ===== Details ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Event Title</Text>
            <Text style={styles.required}>Required</Text>
          </View>
          <TextInput
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="e.g., Photography Club Meetup"
          />

          <View style={{ height: 12 }} />

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Organization</Text>
            <Text style={styles.required}>Required</Text>
          </View>
          <TextInput
            style={styles.input}
            value={organization}
            onChangeText={setOrganization}
            placeholder="e.g., Photo Club"
          />
        </View>

        {/* ===== Time ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time</Text>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Week</Text>
            <Text style={styles.selectRightHint}>
              {weekDates[0]?.dateStr} → {weekDates[6]?.dateStr}
            </Text>
          </View>

          {/* Date pills */}
          <View style={styles.dayPillsRow}>
            {weekDates.map((d) => {
              const active = selectedDateStr === d.dateStr
              return (
                <TouchableOpacity
                  key={d.dateStr}
                  style={[styles.dayPill, active && styles.dayPillActive]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedDateStr(d.dateStr)}
                >
                  <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                    {d.label.split(",")[0]}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View style={{ height: 10 }} />
          <Text style={styles.selectRightHint}>Selected: {selectedDateStr || "—"}</Text>

          <View style={{ height: 12 }} />

          {/* ✅ Start select */}
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Start Time</Text>
            <Text style={styles.required}>Required</Text>
          </View>
          <TouchableOpacity
            style={styles.selectBtn}
            activeOpacity={0.85}
            onPress={() => setTimePickerOpen("start")}
          >
            <Text style={styles.selectText}>{prettyTime(startHHMM)}</Text>
            <Text style={styles.selectRightHint}>Pick</Text>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          {/* ✅ End select */}
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>End Time</Text>
            <Text style={styles.required}>Required</Text>
          </View>
          <TouchableOpacity
            style={styles.selectBtn}
            activeOpacity={0.85}
            onPress={() => setTimePickerOpen("end")}
          >
            <Text style={styles.selectText}>{prettyTime(endHHMM)}</Text>
            <Text style={styles.selectRightHint}>Pick</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />
          {!isFutureAndValid ? (
            <Text style={styles.helperText}>
              Pick a future date/time (start must be in the future).
            </Text>
          ) : (
            <Text style={styles.helperText}>
              Will create: {new Date(startAt).toLocaleString()} → {new Date(endAt).toLocaleString()}
            </Text>
          )}
        </View>

        {/* ===== Location ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Building</Text>
            <Text style={styles.required}>Required</Text>
          </View>

          <TextInput
            style={styles.input}
            value={buildingQuery}
            onChangeText={(t) => {
              setBuildingQuery(t)
              setBuildingId(null)
              setBuildingName("")
            }}
            placeholder="Search building… (e.g., library)"
            autoCapitalize="none"
          />

          <View style={{ marginTop: 10 }}>
            {loadingSuggest ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ActivityIndicator />
                <Text style={styles.selectRightHint}>Searching…</Text>
              </View>
            ) : null}

            {suggestions.length > 0 ? (
              <View style={styles.chipRow}>
                {suggestions.map((b) => {
                  const isSelected = buildingId === b.id
                  return (
                    <TouchableOpacity
                      key={b.id}
                      style={[
                        styles.chip,
                        isSelected && { borderColor: "rgba(37, 99, 235, 0.45)" },
                      ]}
                      onPress={() => {
                        setBuildingId(b.id)
                        setBuildingName(b.name)
                        setBuildingQuery(b.name)
                        setSuggestions([])
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.chipText, isSelected && { color: "#2563EB" }]}>
                        {b.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            ) : null}

            <View style={{ marginTop: 10 }}>
              <TouchableOpacity style={styles.selectBtn} activeOpacity={0.85}>
                <Text style={[styles.selectText, !buildingId && styles.selectPlaceholder]}>
                  {buildingId ? buildingName : "Select a building…"}
                </Text>
                <Text style={styles.selectRightHint}>{buildingId ? "Selected" : "Pick"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Room / Notes</Text>
              <Text style={styles.selectRightHint}>Optional</Text>
            </View>

            <TextInput
              style={[styles.input, styles.textarea]}
              value={roomNote}
              onChangeText={setRoomNote}
              placeholder="e.g., Room 311 (optional). We navigate to the building only."
              multiline
            />
          </View>
        </View>

        {/* ===== Submit ===== */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!canSubmit || submitting) && styles.submitBtnDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!canSubmit || submitting}
            onPress={onCreate}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? "Creating…" : "Create Event"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>Fill required fields to enable Create.</Text>
        </View>
      </ScrollView>

      {/* ✅ Time Picker Modal Bottom Sheet */}
      <Modal
        visible={timePickerOpen !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setTimePickerOpen(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 14,
              maxHeight: "70%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#0F172A" }}>
                {timePickerOpen === "start" ? "Pick Start Time" : "Pick End Time"}
              </Text>

              <TouchableOpacity onPress={() => setTimePickerOpen(null)} activeOpacity={0.85}>
                <Text style={{ color: "#2563EB", fontWeight: "800" }}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {timeSlots.map((t) => {
                const active =
                  (timePickerOpen === "start" ? startHHMM : endHHMM) === t

                const sIdx = timeSlots.indexOf(startHHMM)
                const tIdx = timeSlots.indexOf(t)
                const disabled = timePickerOpen === "end" ? tIdx <= sIdx : false

                return (
                  <TouchableOpacity
                    key={t}
                    activeOpacity={0.85}
                    disabled={disabled}
                    onPress={() => {
                      if (timePickerOpen === "start") setStartHHMM(t)
                      else setEndHHMM(t)
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: active
                        ? "rgba(37,99,235,0.45)"
                        : "rgba(15,23,42,0.10)",
                      opacity: disabled ? 0.35 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: active ? "#2563EB" : "#0F172A",
                      }}
                    >
                      {prettyTime(t)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}