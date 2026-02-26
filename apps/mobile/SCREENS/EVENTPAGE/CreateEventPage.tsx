import React, { useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { styles } from "./CreateEventPage.styles"

export function CreateEventPage() {
  const navigation = useNavigation()

  const [eventTitle, setEventTitle] = useState("")
  const [organization, setOrganization] = useState("")
  const [dayIndex, setDayIndex] = useState(0)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"]

  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [roomNote, setRoomNote] = useState("")

  const buildings = [
    { id: "student_union", name: "Student Union" },
    { id: "library", name: "Library" },
    { id: "sci_iii", name: "SCI III" },
    { id: "business", name: "Business Building" },
    { id: "gym", name: "Gym" },
  ]

  const selectedBuildingName =
    buildings.find((b) => b.id === buildingId)?.name ?? ""

  const canSubmit =
    eventTitle.trim().length > 0 &&
    organization.trim().length > 0 &&
    startTime.trim().length > 0 &&
    endTime.trim().length > 0 &&
    !!buildingId

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
              const active = dayIndex === idx
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayPill, active && styles.dayPillActive]}
                  activeOpacity={0.85}
                  onPress={() => setDayIndex(idx)}
                >
                  <Text
                    style={[styles.dayPillText, active && styles.dayPillTextActive]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              )
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
            <Text
              style={[styles.selectText, !buildingId && styles.selectPlaceholder]}
            >
              {buildingId ? selectedBuildingName : "Select a building…"}
            </Text>

            <Text style={styles.selectRightHint}>Pick</Text>
          </TouchableOpacity>

          <View style={styles.chipRow}>
            {buildings.map((b) => {
              const isSelected = buildingId === b.id
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
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && { color: "#2563EB" },
                    ]}
                  >
                    {b.name}
                  </Text>
                </TouchableOpacity>
              )
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
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            activeOpacity={0.85}
            disabled={!canSubmit}
            onPress={() => {
              const payload = {
                title: eventTitle.trim(),
                organization: organization.trim(),
                dayIndex,
                startTime: startTime.trim(),
                endTime: endTime.trim(),
                buildingId,
                roomNote: roomNote.trim(),
              }
              console.log("CREATE EVENT:", payload)
              navigation.goBack()
            }}
          >
            <Text style={styles.submitBtnText}>Create Event</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Fill required fields to enable Create.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
