import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { styles } from "./CreateEventPage.styles";

// ✅ Import your Supabase createEvent helper
import { createEvent } from "../../src/api/eventsApi"; // <-- adjust path if needed

const CSUB_TZ = "America/Los_Angeles";

/**
 * Accepts inputs like:
 * "10:00 AM", "2:15 pm", "14:30"
 * Returns "HH:mm" (24-hour) or null if invalid
 */
function parseTimeTo24h(input: string): string | null {
  const s = input.trim();

  // Try "h:mm a"
  let dt = DateTime.fromFormat(s.toUpperCase(), "h:mm A", { zone: CSUB_TZ });
  if (dt.isValid) return dt.toFormat("HH:mm");

  // Try "h a" (e.g. "2 PM")
  dt = DateTime.fromFormat(s.toUpperCase(), "h A", { zone: CSUB_TZ });
  if (dt.isValid) return dt.toFormat("HH:mm");

  // Try 24-hour "HH:mm"
  dt = DateTime.fromFormat(s, "HH:mm", { zone: CSUB_TZ });
  if (dt.isValid) return dt.toFormat("HH:mm");

  return null;
}

/**
 * Returns the Monday date (YYYY-MM-DD) for the current week in LA time.
 */
function getMondayISO(timezone = CSUB_TZ): string {
  const now = DateTime.now().setZone(timezone);
  const monday = now.minus({ days: now.weekday - 1 }).startOf("day");
  return monday.toISODate()!;
}

export function CreateEventPage() {
  const navigation = useNavigation<any>();

  const [eventTitle, setEventTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [roomNote, setRoomNote] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const buildings = [
    { id: "student_union", name: "Student Union" },
    { id: "library", name: "Library" },
    { id: "sci_iii", name: "SCI III" },
    { id: "business", name: "Business Building" },
    { id: "gym", name: "Gym" },
  ];

  const selectedBuildingName =
    buildings.find((b) => b.id === buildingId)?.name ?? "";

  const canSubmit =
    eventTitle.trim().length > 0 &&
    organization.trim().length > 0 &&
    startTime.trim().length > 0 &&
    endTime.trim().length > 0 &&
    !!buildingId &&
    !submitting;

  // Compute the actual date for selected day (this week in LA)
  const selectedDateISO = useMemo(() => {
    const monday = DateTime.fromISO(getMondayISO(CSUB_TZ), { zone: CSUB_TZ });
    return monday.plus({ days: dayIndex }).toISODate()!;
  }, [dayIndex]);

  async function handleCreate() {
    if (!buildingId) return;

    const start24 = parseTimeTo24h(startTime);
    const end24 = parseTimeTo24h(endTime);

    if (!start24) {
      Alert.alert("Invalid Start Time", "Use formats like 10:00 AM or 14:30.");
      return;
    }
    if (!end24) {
      Alert.alert("Invalid End Time", "Use formats like 12:00 PM or 16:00.");
      return;
    }

    // quick validation: end must be after start (same day)
    const startDT = DateTime.fromFormat(`${selectedDateISO} ${start24}`, "yyyy-MM-dd HH:mm", { zone: CSUB_TZ });
    const endDT = DateTime.fromFormat(`${selectedDateISO} ${end24}`, "yyyy-MM-dd HH:mm", { zone: CSUB_TZ });
    if (!startDT.isValid || !endDT.isValid) {
      Alert.alert("Invalid date/time", "Double-check your time inputs.");
      return;
    }
    if (endDT <= startDT) {
      Alert.alert("Time error", "End time must be after start time.");
      return;
    }

    try {
      setSubmitting(true);

      // Map your UI fields -> backend fields
      await createEvent({
        title: eventTitle.trim(),
        category: organization.trim(),         // shown like "Photo Club" in your UI
        buildingId,
        roomDetail: roomNote.trim() || undefined,

        startDate: selectedDateISO,            // YYYY-MM-DD (LA)
        startTime: start24,                    // HH:mm
        endDate: selectedDateISO,
        endTime: end24,

        timezone: CSUB_TZ,
      });

      Alert.alert("Created ✅", "Your event was added.");
      navigation.goBack(); // Events page should refresh (see note below)
    } catch (e: any) {
      console.error(e);
      Alert.alert("Create failed", e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.fieldLabel}>Day</Text>
            <Text style={styles.required}>Required</Text>
          </View>

          <View style={styles.dayPillsRow}>
            {dayLabels.map((d, idx) => {
              const active = dayIndex === idx;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayPill, active && styles.dayPillActive]}
                  activeOpacity={0.85}
                  onPress={() => setDayIndex(idx)}
                >
                  <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 12 }} />

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Start Time</Text>
                <Text style={styles.required}>Required</Text>
              </View>
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="e.g., 10:00 AM"
              />
            </View>

            <View style={styles.col}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>End Time</Text>
                <Text style={styles.required}>Required</Text>
              </View>
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="e.g., 12:00 PM"
              />
            </View>
          </View>

          {/* optional: show the computed date so you can debug */}
          <Text style={{ marginTop: 10, opacity: 0.55 }}>
            Will be scheduled on: {selectedDateISO} ({dayLabels[dayIndex]})
          </Text>
        </View>

        {/* ===== Location ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Building</Text>
            <Text style={styles.required}>Required</Text>
          </View>

          <TouchableOpacity
            style={styles.selectBtn}
            activeOpacity={0.85}
            onPress={() => console.log("Pick a building below")}
          >
            <Text style={[styles.selectText, !buildingId && styles.selectPlaceholder]}>
              {buildingId ? selectedBuildingName : "Select a building…"}
            </Text>
            <Text style={styles.selectRightHint}>Pick</Text>
          </TouchableOpacity>

          <View style={styles.chipRow}>
            {buildings.map((b) => {
              const isSelected = buildingId === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.chip,
                    isSelected && { borderColor: "rgba(37, 99, 235, 0.45)" },
                  ]}
                  onPress={() => setBuildingId(b.id)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, isSelected && { color: "#2563EB" }]}>
                    {b.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
            style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]}
            activeOpacity={0.85}
            disabled={!canSubmit || submitting}
            onPress={handleCreate}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? "Creating…" : "Create Event"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Fill required fields to enable Create.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
