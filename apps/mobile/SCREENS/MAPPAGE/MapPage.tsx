import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Keyboard,
} from "react-native"
import MapView, {
  Polygon,
  Polyline,
  Region,
  MapPressEvent,
  Marker,
  LatLng as RNLatLng,
} from "react-native-maps"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import * as Location from "expo-location"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../NAV/ThemeProvider"
import { useAuth } from "../SETTINGPAGE/AUTH/AuthContext"
import { createStyles } from "./MapPage.styles"

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN

const TILESET = "mapbox.mapbox-streets-v8"
const TILEQUERY_RADIUS_METERS = 18
const TILEQUERY_LIMIT = 5

const API_BASE = "https://ezequiel-unfractious-serafina.ngrok-free.dev"

const DEV_USE_MOCK_LOCATION = true
type MockPreset = "student_union" | "housing"
const DEV_DEFAULT_PRESET: MockPreset = "student_union"

type LatLng = { latitude: number; longitude: number }

type PlaceResult = {
  id: string
  place_name: string
  center: [number, number]
  place_type?: string[]
  properties?: { category?: string }
  text?: string
}

type NavPlace = { id: string; title: string; latitude: number; longitude: number }

type MapIntent =
  | { type: "my_location" }
  | { type: "route_to"; place: NavPlace }

type RouteParams = { intent?: MapIntent }

type FriendMapItem = {
  id: string
  firstName: string
  lastName: string
  email: string
  latitude: number
  longitude: number
  updatedAt: string
  isHidden: boolean
  isPinned: boolean
}

export function MapPage() {
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)

  const navigation = useNavigation<any>()
  const route = useRoute<any>() as { params?: RouteParams }
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const { token, isAuthenticated } = useAuth()

  const isGuest = !token || !isAuthenticated

  const [userLocation, setUserLocation] = useState<LatLng | null>(null)

  const [friendMapItems, setFriendMapItems] = useState<FriendMapItem[]>([])
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)

  const [useMockLocation, setUseMockLocation] = useState(
    __DEV__ ? DEV_USE_MOCK_LOCATION : false
  )
  const [mockPreset, setMockPreset] = useState<MockPreset>(DEV_DEFAULT_PRESET)

  const [selectedPolygon, setSelectedPolygon] = useState<LatLng[] | null>(null)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<{
    id: string
    latitude: number
    longitude: number
    title: string
  } | null>(null)

  const [routeCoords, setRouteCoords] = useState<RNLatLng[] | null>(null)
  const [routeMeta, setRouteMeta] = useState<{ distanceM: number; durationS: number } | null>(null)
  const [routing, setRouting] = useState(false)

  const [pendingRouteTo, setPendingRouteTo] = useState<LatLng | null>(null)
  const [pendingMyLocation, setPendingMyLocation] = useState(false)

  const debounceRef = useRef<any>(null)

  const backdrop = useRef(new Animated.Value(0)).current
  const sheetY = useRef(new Animated.Value(-10)).current
  const sheetOpacity = useRef(new Animated.Value(0)).current

  const initialRegion = useMemo<Region>(
    () => ({
      latitude: 35.347,
      longitude: -119.106,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    []
  )

  const visibleFriendMapItems = useMemo(() => {
    return friendMapItems
      .filter((item) => !item.isHidden)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
  }, [friendMapItems])

  const showSearchSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(sheetY, { toValue: 0, damping: 18, stiffness: 220, useNativeDriver: true }),
    ]).start()
  }, [backdrop, sheetOpacity, sheetY])

  const hideSearchSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(sheetOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: -10, duration: 150, useNativeDriver: true }),
    ]).start()
  }, [backdrop, sheetOpacity, sheetY])

  const dismissSearch = useCallback(() => {
    setSearchFocus(false)
    Keyboard.dismiss()
    hideSearchSheet()
  }, [hideSearchSheet])

  const focusSearch = useCallback(() => {
    setSearchFocus(true)
    showSearchSheet()
  }, [showSearchSheet])

  const pushMyLocationToBackend = useCallback(
    async (coords: LatLng) => {
      if (!token || !isAuthenticated) return

      try {
        const res = await fetch(`${API_BASE}/location/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        })

        if (!res.ok) {
          const body = await res.text()
          console.log("pushMyLocationToBackend failed:", res.status, body)
        }
      } catch (err) {
        console.log("pushMyLocationToBackend error:", err)
      }
    },
    [token, isAuthenticated]
  )

  const fetchMapData = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setFriendMapItems([])
      return
    }

    try {
      const res = await fetch(`${API_BASE}/location/map`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        console.log("fetchMapData failed:", data)
        setFriendMapItems([])
        return
      }

      setFriendMapItems(data.items ?? [])
    } catch (err) {
      console.log("fetchMapData error:", err)
      setFriendMapItems([])
    }
  }, [token, isAuthenticated])

  const getMockLocationFromBackend = useCallback(
    async (preset: MockPreset): Promise<LatLng | null> => {
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

        if (!pick?.center?.lat || !pick?.center?.lng) return null
        return { latitude: pick.center.lat, longitude: pick.center.lng }
      } catch {
        return null
      }
    },
    []
  )

  const setAndCenterUserLocation = useCallback(
    (coords: LatLng, duration = 650) => {
      setUserLocation(coords)
      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.006, longitudeDelta: 0.006 },
        duration
      )
      pushMyLocationToBackend(coords)
    },
    [pushMyLocationToBackend]
  )

  useEffect(() => {
    if (isGuest) {
      setFriendMapItems([])
      setSelectedFriendId(null)
    }
  }, [isGuest])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setRouteCoords(null)
        setRouteMeta(null)

        if (__DEV__ && useMockLocation) {
          const mock = await getMockLocationFromBackend(mockPreset)
          if (mock && !cancelled) {
            setAndCenterUserLocation(mock, 650)
            return
          }
        }

        const perm = await Location.requestForegroundPermissionsAsync()
        if (perm.status !== "granted") return

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        if (cancelled) return

        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }

        setAndCenterUserLocation(coords, 900)
      } catch {
        // ignore
      }
    })()

    return () => {
      cancelled = true
    }
  }, [getMockLocationFromBackend, mockPreset, setAndCenterUserLocation, useMockLocation])

  useEffect(() => {
    if (!token || !isAuthenticated) return

    fetchMapData()

    const id = setInterval(() => {
      fetchMapData()

      if (userLocation) {
        pushMyLocationToBackend(userLocation)
      }
    }, 15000)

    return () => clearInterval(id)
  }, [token, isAuthenticated, userLocation, fetchMapData, pushMyLocationToBackend])

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
        const body = await res.text()
        console.log("SEARCH FAIL:", res.status, body.slice(0, 160))
        throw new Error(`HTTP ${res.status}`)
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
    } catch (err) {
      console.log("searchPlaces error:", err)
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

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchPlaces, searchFocus])

  const onChangeQuery = useCallback(
    (t: string) => {
      setQuery(t)
      setRouteCoords(null)
      setRouteMeta(null)

      if (selectedId) {
        setSelectedId(null)
        setSelectedPlace(null)
      }
    },
    [selectedId]
  )

  const fetchRoute = useCallback(
    async (to: LatLng) => {
      if (!userLocation) return

      try {
        setRouting(true)
        setRouteCoords(null)
        setRouteMeta(null)

        const from = `${userLocation.longitude},${userLocation.latitude}`
        const dest = `${to.longitude},${to.latitude}`

        const url =
          `https://api.mapbox.com/directions/v5/mapbox/walking/${from};${dest}` +
          `?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full`

        const res = await fetch(url)
        if (!res.ok) throw new Error()

        const data = await res.json()
        const r = data.routes?.[0]
        const coords: [number, number][] | undefined = r?.geometry?.coordinates
        if (!coords || coords.length < 2) return

        setRouteCoords(coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng })))
        setRouteMeta({
          distanceM: Math.round(r.distance ?? 0),
          durationS: Math.round(r.duration ?? 0),
        })
      } finally {
        setRouting(false)
      }
    },
    [userLocation]
  )

  const goToSelectedAndRoute = useCallback(async () => {
    if (!selectedPlace) return

    const to = { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }

    mapRef.current?.animateToRegion(
      { ...to, latitudeDelta: 0.004, longitudeDelta: 0.004 },
      850
    )

    if (!userLocation) {
      setPendingRouteTo(to)
      return
    }

    await fetchRoute(to)
  }, [fetchRoute, selectedPlace, userLocation])

  useFocusEffect(
    useCallback(() => {
      const intent = route.params?.intent
      if (!intent) return

      navigation.setParams?.({ intent: undefined })

      if (intent.type === "my_location") {
        if (!userLocation) {
          setPendingMyLocation(true)
          return
        }

        mapRef.current?.animateToRegion(
          { ...userLocation, latitudeDelta: 0.006, longitudeDelta: 0.006 },
          650
        )
        setRouteCoords(null)
        setRouteMeta(null)
        return
      }

      if (intent.type === "route_to") {
        const p = intent.place
        setSelectedId(p.id)
        setSelectedPlace({
          id: p.id,
          title: p.title,
          latitude: p.latitude,
          longitude: p.longitude,
        })
        setQuery(p.title)

        const to = { latitude: p.latitude, longitude: p.longitude }
        mapRef.current?.animateToRegion(
          { ...to, latitudeDelta: 0.004, longitudeDelta: 0.004 },
          650
        )

        if (!userLocation) {
          setPendingRouteTo(to)
          return
        }

        fetchRoute(to)
      }
    }, [route.params, navigation, userLocation, fetchRoute])
  )

  useEffect(() => {
    if (!userLocation) return

    if (pendingMyLocation) {
      setPendingMyLocation(false)
      mapRef.current?.animateToRegion(
        { ...userLocation, latitudeDelta: 0.006, longitudeDelta: 0.006 },
        650
      )
      setRouteCoords(null)
      setRouteMeta(null)
    }

    if (pendingRouteTo) {
      const to = pendingRouteTo
      setPendingRouteTo(null)
      fetchRoute(to)
    }
  }, [userLocation, pendingMyLocation, pendingRouteTo, fetchRoute])

  const onPressMap = useCallback(
    async (e: MapPressEvent) => {
      dismissSearch()

      try {
        const { latitude, longitude } = e.nativeEvent.coordinate

        const url =
          `https://api.mapbox.com/v4/${TILESET}/tilequery/${longitude},${latitude}.json` +
          `?layers=building&radius=${TILEQUERY_RADIUS_METERS}&limit=${TILEQUERY_LIMIT}` +
          `&access_token=${MAPBOX_TOKEN}`

        const res = await fetch(url)
        if (!res.ok) return

        const data = await res.json()
        const best = data.features?.[0]
        if (!best) {
          setSelectedPolygon(null)
          return
        }

        const ring =
          best.geometry.type === "Polygon"
            ? best.geometry.coordinates[0]
            : best.geometry.coordinates?.[0]?.[0]

        if (!ring) return

        const polygon = ring.map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }))

        setSelectedPolygon(polygon)
      } catch {
        // ignore
      }
    },
    [dismissSearch]
  )

  const routeText = useMemo(() => {
    if (!routeMeta) return null
    const minutes = Math.max(1, Math.round(routeMeta.durationS / 60))
    return `${routeMeta.distanceM} m • ${minutes} min`
  }, [routeMeta])

  const devPillLabel = useMemo(() => {
    if (!__DEV__) return null
    if (!useMockLocation) return "GPS: Device"
    return mockPreset === "student_union" ? "GPS: Student Union" : "GPS: Housing"
  }, [mockPreset, useMockLocation])

  return (
    <SafeAreaView
      style={StyleSheet.absoluteFill}
      edges={["top", "left", "right"]}
      pointerEvents="box-none"
    >
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          onPress={onPressMap}
          showsUserLocation={!__DEV__ || !useMockLocation}
          showsCompass
        >
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.title}
            />
          )}

          {__DEV__ && useMockLocation && userLocation && (
            <Marker coordinate={userLocation} title="You (Mock)" pinColor={theme.accent} />
          )}

          {!isGuest &&
            visibleFriendMapItems.map((friend) => {
              const isSelected = selectedFriendId === friend.id

              return (
                <Marker
                  key={friend.id}
                  coordinate={{
                    latitude: friend.latitude,
                    longitude: friend.longitude,
                  }}
                  title={`${friend.firstName} ${friend.lastName}`}
                  description={friend.email}
                  onPress={() => setSelectedFriendId(friend.id)}
                >
                  <View
                    style={{
                      backgroundColor: theme.card,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? theme.accent : theme.divider,
                    }}
                  >
                    <Text style={{ color: theme.text, fontWeight: "700", fontSize: 12 }}>
                      {friend.firstName}
                    </Text>
                  </View>
                </Marker>
              )
            })}

          {routeCoords && (
            <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor={theme.text} />
          )}

          {selectedPolygon && (
            <Polygon
              coordinates={selectedPolygon}
              strokeWidth={2}
              strokeColor={theme.accent}
              fillColor="rgba(37,99,235,0.18)"
            />
          )}
        </MapView>

        <Animated.View
          pointerEvents={searchFocus ? "auto" : "none"}
          style={[
            styles.backdrop,
            {
              opacity: backdrop.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissSearch} />
        </Animated.View>

        <View style={[styles.topWrap, { paddingTop: Math.max(8, insets.top) }]}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>⌕</Text>

            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              onFocus={focusSearch}
              placeholder="Search buildings (ex: library, union, housing)"
              placeholderTextColor={theme.muted}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => searchPlaces(query)}
            />

            {query.length > 0 ? (
              <Pressable
                onPress={() => {
                  setQuery("")
                  setResults([])
                  setSelectedId(null)
                  setSelectedPlace(null)
                  setRouteCoords(null)
                  setRouteMeta(null)
                }}
                style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.65 }]}
              >
                <Text style={styles.clearText}>×</Text>
              </Pressable>
            ) : (
              <View style={{ width: 32 }} />
            )}

            <Pressable
              style={({ pressed }) => [
                styles.goBtn,
                pressed && { opacity: 0.8 },
                !selectedId && { opacity: 0.4 },
              ]}
              disabled={!selectedId || routing}
              onPress={() => {
                dismissSearch()
                goToSelectedAndRoute()
              }}
            >
              <Text style={styles.goText}>{routing ? "..." : "Go"}</Text>
            </Pressable>
          </View>

          {!isGuest && (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: theme.card,
                  borderWidth: 1,
                  borderColor: theme.divider,
                }}
              >
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "700" }}>
                  Friends on map: {visibleFriendMapItems.length}
                </Text>
              </View>
            </View>
          )}

          {__DEV__ && (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Pressable
                onPress={() => setUseMockLocation((v) => !v)}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.divider,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "700" }}>
                  {useMockLocation ? "Mock ON" : "Mock OFF"}
                </Text>
              </Pressable>

              <Pressable
                disabled={!useMockLocation}
                onPress={() =>
                  setMockPreset((p) => (p === "student_union" ? "housing" : "student_union"))
                }
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.divider,
                    opacity: !useMockLocation ? 0.5 : pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "700" }}>
                  {devPillLabel ?? "GPS"}
                </Text>
              </Pressable>
            </View>
          )}

          <Animated.View
            pointerEvents={searchFocus ? "auto" : "none"}
            style={[
              styles.sheet,
              {
                opacity: sheetOpacity,
                transform: [{ translateY: sheetY }],
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Suggestions</Text>
              <Text style={styles.sheetSub}>
                {searching
                  ? "Searching..."
                  : results.length
                    ? "Tap a result (select), then press Go"
                    : "Type to search buildings"}
              </Text>
            </View>

            {results.length === 0 && !searching ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Try: library / union / housing</Text>
                <Text style={styles.emptySub}>Results come from your campus database.</Text>
              </View>
            ) : (
              <View style={styles.list}>
                {results.map((r) => {
                  const [lng, lat] = r.center
                  const title = r.place_name
                  const isSelected = selectedId === r.id

                  return (
                    <Pressable
                      key={r.id}
                      style={({ pressed }) => [
                        styles.item,
                        pressed && { opacity: 0.75 },
                        isSelected && styles.itemSelected,
                      ]}
                      onPress={() => {
                        setSelectedId(r.id)
                        setSelectedPlace({ id: r.id, latitude: lat, longitude: lng, title })
                        setQuery(title)
                      }}
                    >
                      <Text numberOfLines={2} style={styles.itemTitle}>
                        {title}
                      </Text>
                      <Text numberOfLines={1} style={styles.itemMeta}>
                        {(r.place_type ?? []).join(" • ")}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            )}

            {routeText && (
              <View style={styles.routeChip}>
                <Text style={styles.routeChipText}>{routeText}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  )
}