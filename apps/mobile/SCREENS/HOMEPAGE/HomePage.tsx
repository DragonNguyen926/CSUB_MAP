import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createStyles } from "./HomePage.styles"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useTheme } from "../NAV/ThemeProvider"
import * as Location from "expo-location"
import MapView, { Marker, Region } from "react-native-maps"

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

const DEV_USE_MOCK_LOCATION = true
type MockPreset = "student_union" | "housing"
const DEV_DEFAULT_PRESET: MockPreset = "student_union"

type LatLng = { latitude: number; longitude: number }
const categories = ["Library", "Housing", "Union", "Admin West"] as const

type Building = {
  id: string
  name: string
  subtitle: string
  distance: string
  icon: string
}

type PlaceResult = {
  id: string
  place_name: string
  center: [number, number]
  place_type?: string[]
  properties?: { category?: string }
  text?: string
}

type NavPlace = {
  id: string
  title: string
  latitude: number
  longitude: number
}

type DbEvent = {
  id: string
  title: string
  organization: string
  startAt: string
  endAt: string
  roomNote: string | null
  building: {
    id: string
    name: string
    slug: string
    centerLat: number
    centerLng: number
  }
}

type EventCards = {
  id: string
  title: string
  department?: string
  time: string
  location: string
  icon?: string
  isLive: boolean
  navPlace: NavPlace
}

const buildingsData: Building[] = [
  { id: "fav_library", name: "Library", subtitle: "Main Campus Library", distance: "—", icon: "📚" },
  { id: "fav_union", name: "Student Union", subtitle: "Student Union", distance: "—", icon: "🍽️" },
  { id: "fav_sci3", name: "SCIENCE 3", subtitle: "NSME", distance: "—", icon: "🔬" },
  { id: "fav_gym", name: "Campus Gym", subtitle: "Fitness Center", distance: "—", icon: "🏋️‍♂️" },
]

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function localYYYYMMDD(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
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

  return `${fmt(s)} - ${fmt(e)}`
}

function isLiveNow(startIso: string, endIso: string) {
  const now = Date.now()
  const s = new Date(startIso).getTime()
  const e = new Date(endIso).getTime()
  return now >= s && now <= e
}

function pickIconForOrg(org?: string) {
  const o = (org ?? "").toLowerCase()
  if (o.includes("gym") || o.includes("rec")) return "🏋️‍♂️"
  if (o.includes("art")) return "🎨"
  if (o.includes("cs") || o.includes("tech") || o.includes("engineering")) return "💻"
  if (o.includes("data")) return "📊"
  if (o.includes("yoga")) return "🧘‍♀️"
  return "🎟️"
}

function haversineMeters(a: LatLng, b: LatLng) {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)

  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

function formatDistance(meters: number) {
  const miles = meters / 1609.344
  if (meters < 1000) {
    return `${Math.round(meters)}m • ${miles.toFixed(1)}mi`
  }
  return `${(meters / 1000).toFixed(1)}km • ${miles.toFixed(1)}mi`
}

export function HomePage() {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const styles = createStyles(theme)

  const [category, setCategory] = useState<(typeof categories)[number]>("Library")
  const [query, setQuery] = useState("")
  const placeholder = "Search for classes, buildings,..."

  const [selectedPlaceForDirections, setSelectedPlaceForDirections] = useState<NavPlace | null>(null)

  const [results, setResults] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const debounceRef = useRef<any>(null)

  const [useMockLocation] = useState(__DEV__ ? DEV_USE_MOCK_LOCATION : false)
  const [mockPreset] = useState<MockPreset>(DEV_DEFAULT_PRESET)

  const [nearLabel, setNearLabel] = useState("....")
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)

  const [clearOnReturn, setClearOnReturn] = useState(false)

  const [todayEvents, setTodayEvents] = useState<EventCards[]>([])
  const [loadingToday, setLoadingToday] = useState(false)

  const [favRouting, setFavRouting] = useState<string | null>(null)

  const [favPlacesById, setFavPlacesById] = useState<Record<string, NavPlace>>({})
  const [favDistanceById, setFavDistanceById] = useState<Record<string, string>>({})
  const [favLoadingById, setFavLoadingById] = useState<Record<string, boolean>>({})

  const clearHomeSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setSelectedId(null)
    setSelectedPlaceForDirections(null)
    setSearchFocus(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!clearOnReturn) return
      clearHomeSearch()
      setClearOnReturn(false)
    }, [clearOnReturn, clearHomeSearch])
  )

  const searchPlaces = useCallback(async (text: string) => {
    const q = text.trim()
    if (!q) {
      setResults([])
      return
    }

    try {
      setSearching(true)
      const url = `${API_BASE}/api/buildings/search?q=${encodeURIComponent(q)}&limit=12`
      const res = await fetch(url)
      if (!res.ok) {
        setResults([])
        return
      }

      const data = await res.json()

      const mapped: PlaceResult[] = (data.items ?? []).map((item: any) => ({
        id: item.id,
        place_name: item.name,
        center: [item.center.lng, item.center.lat],
        place_type: ["building"],
        text: item.name,
      }))

      setResults(mapped)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (searchFocus) searchPlaces(query)
    }, 250)

    return () => debounceRef.current && clearTimeout(debounceRef.current)
  }, [query, searchFocus, searchPlaces])

  const onChangeQuery = useCallback((t: string) => {
    setQuery(t)
    setSelectedId(null)
    setSelectedPlaceForDirections(null)
  }, [])

  const loadTodayEvents = useCallback(async () => {
    setLoadingToday(true)
    try {
      const now = new Date()
      const y = new Date(now)
      y.setDate(now.getDate() - 1)
      const t = new Date(now)
      t.setDate(now.getDate() + 1)

      const from = toYYYYMMDD(y)
      const to = toYYYYMMDD(t)

      const url = `${API_BASE}/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      const res = await fetch(url)
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        Alert.alert("Error", data?.error ?? "Failed to load today's events")
        setTodayEvents([])
        return
      }

      const items: DbEvent[] = Array.isArray(data?.items) ? data.items : []
      const todayLocal = toYYYYMMDD(new Date())
      const onlyToday = items.filter((ev) => localYYYYMMDD(ev.startAt) === todayLocal)

      const mapped: EventCards[] = onlyToday.map((ev) => {
        const b = ev.building
        const room = ev.roomNote?.trim()
        const location = room ? `${b?.name ?? "Unknown"} • ${room}` : `${b?.name ?? "Unknown"}`

        return {
          id: ev.id,
          title: ev.title,
          department: ev.organization,
          time: formatTimeLabel(ev.startAt, ev.endAt),
          location,
          icon: pickIconForOrg(ev.organization),
          isLive: isLiveNow(ev.startAt, ev.endAt),
          navPlace: {
            id: b.id,
            title: b.name,
            latitude: b.centerLat,
            longitude: b.centerLng,
          },
        }
      })

      setTodayEvents(mapped)
    } catch (e: any) {
      Alert.alert("Network error", e?.message ?? "Failed to connect to server")
      setTodayEvents([])
    } finally {
      setLoadingToday(false)
    }
  }, [])

  useEffect(() => {
    loadTodayEvents()
  }, [loadTodayEvents])

  const handleNavigate = useCallback(
    (ev: EventCards) => {
      navigation.navigate("Map", {
        intent: { type: "route_to", place: ev.navPlace },
      })
      setClearOnReturn(true)
    },
    [navigation]
  )

  const goToEvents = useCallback(() => {
    const TAB_CANDIDATES = ["Events", "Event", "EventsTab", "EventTab"]
    const SCREEN_CANDIDATES = ["EventHome", "EventsHome", "EventPage", "EventsPage"]

    const chain: any[] = []
    let cur: any = navigation as any
    while (cur) {
      chain.push(cur)
      cur = cur.getParent?.()
    }

    const tryNav = (navObj: any, fn: () => void) => {
      try {
        fn()
        return true
      } catch {
        return false
      }
    }

    for (const navObj of chain) {
      for (const name of [...TAB_CANDIDATES, ...SCREEN_CANDIDATES]) {
        const ok = tryNav(navObj, () => navObj.navigate(name))
        if (ok) return
      }
    }

    for (const navObj of chain) {
      for (const tabName of TAB_CANDIDATES) {
        for (const screenName of SCREEN_CANDIDATES) {
          const ok = tryNav(navObj, () => navObj.navigate(tabName, { screen: screenName }))
          if (ok) return
        }
      }
    }

    const root = chain[chain.length - 1]
    const state = root?.getState?.()
    Alert.alert("View All failed", "Không tìm thấy route Events. Mở console để xem routes thật.")
    console.log("ROOT NAV STATE:", JSON.stringify(state, null, 2))
  }, [navigation])

  const onPressGo = useCallback(() => {
    if (!selectedPlaceForDirections) {
      Alert.alert("Pick a destination", "Search and tap a building first, then press Go.")
      return
    }

    navigation.navigate("Map", {
      intent: { type: "route_to", place: selectedPlaceForDirections },
    })

    setClearOnReturn(true)
  }, [navigation, selectedPlaceForDirections])

  const onPressMyLocation = useCallback(() => {
    navigation.navigate("Map", { intent: { type: "my_location" } })
    setClearOnReturn(true)
  }, [navigation])

  const getNavPlaceFromBuildingName = useCallback(async (name: string): Promise<NavPlace | null> => {
    try {
      const url = `${API_BASE}/api/buildings/search?q=${encodeURIComponent(name)}&limit=8`
      const res = await fetch(url)
      if (!res.ok) return null

      const data = await res.json().catch(() => ({}))
      const items = data?.items ?? []
      if (!items.length) return null

      const needle = name.toLowerCase()
      const pick =
        items.find((x: any) => String(x?.name ?? "").toLowerCase() === needle) ??
        items.find((x: any) => String(x?.name ?? "").toLowerCase().includes(needle)) ??
        items[0]

      const lat = pick?.center?.lat
      const lng = pick?.center?.lng
      const title = String(pick?.name ?? name)
      const id = String(pick?.id ?? name)

      if (typeof lat !== "number" || typeof lng !== "number") return null
      return { id, title, latitude: lat, longitude: lng }
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      for (const b of buildingsData) {
        if (favPlacesById[b.id]) continue

        setFavLoadingById((prev) => ({ ...prev, [b.id]: true }))
        const place = await getNavPlaceFromBuildingName(b.name)
        if (cancelled) return

        setFavLoadingById((prev) => ({ ...prev, [b.id]: false }))

        if (place) {
          setFavPlacesById((prev) => ({ ...prev, [b.id]: place }))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [favPlacesById, getNavPlaceFromBuildingName])

  useEffect(() => {
    if (!userLocation) return

    const next: Record<string, string> = {}

    for (const b of buildingsData) {
      const place = favPlacesById[b.id]
      if (!place) continue

      const meters = haversineMeters(userLocation, {
        latitude: place.latitude,
        longitude: place.longitude,
      })

      next[b.id] = formatDistance(meters)
    }

    setFavDistanceById(next)
  }, [userLocation, favPlacesById])

  const onPressFavoriteBuilding = useCallback(
    async (b: Building) => {
      setFavRouting(b.id)

      const cached = favPlacesById[b.id]
      const place = cached ?? (await getNavPlaceFromBuildingName(b.name))

      setFavRouting(null)

      if (!place) {
        Alert.alert("Not found", `Can't find "${b.name}" in database yet.`)
        return
      }

      if (!cached) setFavPlacesById((prev) => ({ ...prev, [b.id]: place }))

      navigation.navigate("Map", { intent: { type: "route_to", place } })
      setClearOnReturn(true)
    },
    [favPlacesById, getNavPlaceFromBuildingName, navigation]
  )

  const getMockLocationFromBackend = useCallback(
    async (preset: MockPreset): Promise<{ coords: LatLng; label: string } | null> => {
      try {
        const q = preset === "student_union" ? "student union" : "housing"
        const url = `${API_BASE}/api/buildings/search?q=${encodeURIComponent(q)}&limit=6`
        const res = await fetch(url)
        if (!res.ok) return null

        const data = await res.json()
        const items = data.items ?? []
        if (!items.length) return null

        const pick =
          items.find((x: any) => {
            const name = String(x?.name ?? "").toLowerCase()
            return preset === "student_union"
              ? name.includes("student union") || name.includes("student center")
              : name.includes("housing") || name.includes("residence") || name.includes("dorm")
          }) ?? items[0]

        const lat = pick?.center?.lat
        const lng = pick?.center?.lng
        const name = String(pick?.name ?? "Campus")

        if (typeof lat !== "number" || typeof lng !== "number") return null
        return { coords: { latitude: lat, longitude: lng }, label: name }
      } catch {
        return null
      }
    },
    []
  )

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        if (__DEV__ && useMockLocation) {
          const mock = await getMockLocationFromBackend(mockPreset)
          if (mock && !cancelled) {
            setUserLocation(mock.coords)
            setNearLabel(mock.label)
            return
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          if (!cancelled) setNearLabel("Location unavailable")
          return
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        if (cancelled) return

        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
        setUserLocation(coords)

        const rev = await Location.reverseGeocodeAsync(coords)
        const p = rev?.[0]
        const label = p?.name || p?.street || p?.district || p?.city || p?.region || "Nearby"
        setNearLabel(label)
      } catch {
        if (!cancelled) setNearLabel("Location unavailable")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [getMockLocationFromBackend, mockPreset, useMockLocation])

  const miniMapRegion: Region | undefined = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0035,
        longitudeDelta: 0.0035,
      }
    : selectedPlaceForDirections
      ? {
          latitude: selectedPlaceForDirections.latitude,
          longitude: selectedPlaceForDirections.longitude,
          latitudeDelta: 0.0035,
          longitudeDelta: 0.0035,
        }
      : undefined

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>R</Text>
            </View>
            <Text style={styles.headerTitle}>CSUB</Text>
          </View>

          <View style={styles.pill}>
            <Text style={styles.pillText}>RAMP</Text>
          </View>
        </View>

        <View style={styles.locationBanner}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={theme.accent}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>You are near {nearLabel}</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.text} />
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              value={query}
              onChangeText={onChangeQuery}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholderTextColor={theme.muted}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={onPressGo}
            />
          </View>

          <TouchableOpacity
            style={[styles.goBtn, !selectedPlaceForDirections && styles.goBtnDisabled]}
            onPress={onPressGo}
            activeOpacity={0.85}
          >
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        {searchFocus && (results.length > 0 || searching) && (
          <View style={styles.suggestionsWrap}>
            <View style={styles.suggestionsCard}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
                <Text style={styles.suggestionsSubtitle}>
                  {searching ? "Searching..." : "Tap a building to set destination"}
                </Text>
              </View>

              {results.map((r) => {
                const [lng, lat] = r.center
                const title = r.place_name
                const isSelected = selectedId === r.id

                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => {
                      setSelectedId(r.id)
                      setSelectedPlaceForDirections({
                        id: r.id,
                        title,
                        latitude: lat,
                        longitude: lng,
                      })
                      setQuery(title)
                      setSearchFocus(false)
                      setResults([])
                    }}
                    style={[
                      styles.suggestionItem,
                      isSelected && styles.suggestionItemSelected,
                    ]}
                  >
                    <Text style={styles.suggestionName} numberOfLines={2}>
                      {title}
                    </Text>
                    <Text style={styles.suggestionMeta} numberOfLines={1}>
                      building
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((c) => {
            const active = category === c
            return (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setCategory(c)
                  setQuery(c)
                  setSearchFocus(true)
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.primaryCard}
            onPress={onPressMyLocation}
            activeOpacity={0.92}
          >
            {miniMapRegion ? (
              <MapView
                style={styles.miniMap}
                region={miniMapRegion}
                pointerEvents="none"
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {userLocation && (
                  <Marker
                    coordinate={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    title="You"
                  />
                )}

                {selectedPlaceForDirections && (
                  <Marker
                    coordinate={{
                      latitude: selectedPlaceForDirections.latitude,
                      longitude: selectedPlaceForDirections.longitude,
                    }}
                    title={selectedPlaceForDirections.title}
                  />
                )}
              </MapView>
            ) : (
              <View style={styles.miniMapFallback}>
                <MaterialCommunityIcons
                  name="map-outline"
                  size={34}
                  color="#FFFFFF"
                />
                <Text style={styles.miniMapFallbackTitle}>Open Map</Text>
              </View>
            )}

            <View style={styles.miniMapNote}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={12}
                color={theme.accent}
              />
              <Text style={styles.miniMapNoteText} numberOfLines={1}>
                Near {nearLabel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Events</Text>
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>LIVE</Text>
          </View>

          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={goToEvents}
            activeOpacity={0.85}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loadingToday ? (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" }}>
            <ActivityIndicator color={theme.accent} />
            <Text style={{ marginTop: 6, opacity: 0.7, color: theme.muted }}>
              Loading today's events…
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsRow}
          >
            {todayEvents.length === 0 ? (
              <View
                style={[
                  styles.eventCard,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text style={styles.eventTitle}>No events today</Text>
                <Text style={styles.eventSubtitle}>Try View All for other days</Text>
              </View>
            ) : (
              todayEvents.map((ev) => (
                <View key={ev.id} style={styles.eventCard}>
                  <View style={styles.eventTop}>
                    <View style={styles.eventIconCircle}>
                      <Text style={styles.eventIconEmoji}>{ev.icon}</Text>
                    </View>
                    <View style={[styles.badge, ev.isLive ? styles.badgeLive : styles.badgeNow]}>
                      <Text style={styles.badgeText}>
                        {ev.isLive ? "LIVE" : "OPEN NOW"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {ev.title}
                  </Text>

                  {!!ev.department && (
                    <Text style={styles.eventSubtitle} numberOfLines={1}>
                      {ev.department}
                    </Text>
                  )}

                  <View style={styles.metaRow}>
                    <Text style={styles.metaIcon}>🕒</Text>
                    <Text style={styles.metaText} numberOfLines={1}>
                      {ev.time}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.metaText} numberOfLines={1}>
                      {ev.location}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.eventBtn} onPress={() => handleNavigate(ev)}>
                    <Text style={styles.eventBtnText}>Navigate There</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Buildings</Text>
        </View>

        <View style={styles.grid}>
          {buildingsData.map((building) => {
            const loading = !!favLoadingById[building.id]
            const routing = favRouting === building.id
            const distanceLabel = favDistanceById[building.id] ?? building.distance

            return (
              <TouchableOpacity
                key={building.id}
                style={styles.buildingCard}
                onPress={() => onPressFavoriteBuilding(building)}
                activeOpacity={0.85}
                disabled={routing}
              >
                <View style={styles.buildingTop}>
                  <View style={styles.buildingIcon}>
                    <Text style={styles.buildingEmoji}>{building.icon}</Text>
                  </View>
                </View>

                <Text style={styles.buildingName} numberOfLines={1}>
                  {building.name}
                </Text>

                <Text style={styles.buildingSubtitle} numberOfLines={1}>
                  {building.subtitle}
                </Text>

                <Text style={styles.buildingDistance}>
                  {routing ? "Routing..." : loading ? "Loading..." : distanceLabel}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}