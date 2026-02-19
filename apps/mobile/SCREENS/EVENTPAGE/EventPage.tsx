import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./EventPage.styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DateTime } from "luxon";

import { EventsStackParamList } from "../NAV/EventsStack";
import { getEventsForDay, getWeekCounts } from "../../src/api/eventsApi";
import { CSUB_TZ } from "../../src/utils/time";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

type EventCard = {
  id: string;
  dayIndex: number;
  title: string;
  organization: string;
  building: string;
  addressLine: string;
  timeLabel: string;
  flyerUrl?: string;
  buildingId?: string | null;
};

function getMondayLocalISO(timezone = CSUB_TZ) {
  const now = DateTime.now().setZone(timezone);
  const monday = now.minus({ days: now.weekday - 1 }).startOf("day");
  return monday.toISODate()!;
}

const BUILDING_NAME: Record<string, string> = {
  student_union: "Student Union",
  library: "Library",
  sci_iii: "SCI III",
  business: "Business Building",
  gym: "Gym",
  career_center: "Career Center",
  engineering: "Engineering",
};

export function EventPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventsStackParamList>>();

  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);

  const [weekCounts, setWeekCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [events, setEvents] = useState<EventCard[]>([]);

  const mondayISO = useMemo(() => getMondayLocalISO(CSUB_TZ), []);

  const selectedDateISO = useMemo(() => {
    return DateTime.fromISO(mondayISO, { zone: CSUB_TZ })
      .plus({ days: activeDay })
      .toISODate()!;
  }, [mondayISO, activeDay]);

  const loadWeekCounts = useCallback(async () => {
    const week = await getWeekCounts(mondayISO, CSUB_TZ);
    const counts = days.map((d) => week.days.find((x: any) => x.dow === d)?.count ?? 0);
    setWeekCounts(counts);
  }, [mondayISO]);

  // ✅ changed: no parameter; always uses selectedDateISO from closure
  // ✅ changed: removed activeDay dependency to prevent stale mapping issues
  const loadDayEvents = useCallback(async () => {
    const day = await getEventsForDay(selectedDateISO, CSUB_TZ);

    const mapped: EventCard[] = day.events.map((e: any) => {
      const buildingId = e.building_id ?? null;
      const buildingName = buildingId ? (BUILDING_NAME[buildingId] ?? buildingId) : "Location";

      return {
        id: e.id,
        dayIndex: activeDay,
        title: e.title,
        organization: e.category,
        building: buildingName,
        addressLine: e.room_detail ?? "",
        timeLabel: `${e.startLocal} – ${e.endLocal}`,
        flyerUrl: e.flyer_url ?? undefined,
        buildingId,
      };
    });

    setEvents(mapped);
  }, [selectedDateISO, activeDay]);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      await loadWeekCounts();
      await loadDayEvents();
    } catch (err: any) {
      console.error("EventPage load error:", err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [loadWeekCounts, loadDayEvents]);

  // ✅ Initial load
  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ✅ Reload when day tab changes (only fetch day events)
  React.useEffect(() => {
    loadDayEvents();
  }, [loadDayEvents]);

  // ✅ Refresh when returning from CreateEventPage
  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const dayEvents = events;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ===== Day Tabs (Mon–Fri) ===== */}
        <View style={styles.tabsRow}>
          {days.map((day, index) => {
            const isActive = activeDay === index;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveDay(index)}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ===== Section Header ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{days[activeDay]}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>
              {(weekCounts[activeDay] ?? dayEvents.length)} events
            </Text>
          </View>
        </View>

        {/* Loading indicator (small) */}
        {loading && (
          <View style={{ paddingVertical: 10 }}>
            <ActivityIndicator />
          </View>
        )}

        {/* ===== Empty State ===== */}
        {!loading && dayEvents.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No events today</Text>
            <Text style={styles.emptySub}>Try another day in this week.</Text>
          </View>
        )}

        {/* ===== Event Cards ===== */}
        {dayEvents.length > 0 &&
          dayEvents.map((event) => (
            <View key={event.id} style={styles.card}>
              {/* Flyer */}
              <View style={styles.flyer}>
                <View style={styles.flyerPlaceholder}>
                  <Text style={styles.flyerPlaceholderTitle}>Flyer Preview</Text>
                  <Text style={styles.flyerPlaceholderSub}>
                    Upload flyer to make it stand out
                  </Text>
                </View>
              </View>

              {/* Body */}
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

                {!!event.addressLine && (
                  <Text style={styles.addressText}>{event.addressLine}</Text>
                )}

                <View style={styles.footerRow}>
                  <View style={styles.timePill}>
                    <Text style={styles.timeText}>{event.timeLabel}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() =>
                      console.log("Navigate to", event.buildingId ?? event.building)
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.navBtnText}>Navigate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

        {/* ===== Add Event Button ===== */}
        <View style={styles.createBtnWrap}>
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("CreateEventPage")} // ✅ route name
          >
            <Text style={styles.createButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
