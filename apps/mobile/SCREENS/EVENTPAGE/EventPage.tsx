import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { styles } from "./EventPage.styles"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { EventsStackParamList } from "../NAV/EventsStack"
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
export function EventPage() {
  const [activeDay, setActiveDay] = useState(0);
  type EventCard ={
    id: string;
    dayIndex: number;
    title: string;
    organization: string;
    building: string;
    addressLine: string;
    timeLabel: string;
    flyerUrl?: string;
};
const mockEvents: EventCard[] = [
  {
    id: "1",
    dayIndex: 0,
    title: "Welcome Fair",
    organization: "Admissions",
    building: "Student Union",
    addressLine: "Student Union - Main Hall",
    timeLabel: "10:00 AM – 12:00 PM",
  },
  {
    id: "2",
    dayIndex: 0,
    title: "Photography Club Meetup",
    organization: "Photo Club",
    building: "SCI III",
    addressLine: "Science III - Lobby",
    timeLabel: "2:00 PM – 4:00 PM",
  },
]
const dayEvents = mockEvents.filter(
  event => event.dayIndex === activeDay
);
const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList>>()
return (
  <SafeAreaView style={styles.screen}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* ===== Day Tabs (Mon–Fri) ===== */}
      <View style={styles.tabsRow}>
        {days.map((day, index) => {
          const isActive = activeDay === index
          return (
            <TouchableOpacity
              key={day}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveDay(index)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* ===== Section Header ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{days[activeDay]}</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>
            {dayEvents.length} events
          </Text>
        </View>
      </View>
     

      {/* ===== Empty State ===== */}
      {dayEvents.length === 0 && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No events today</Text>
          <Text style={styles.emptySub}>
            Try another day in this week.
          </Text>
        </View>
      )}

      {/* ===== Event Cards ===== */}
      {dayEvents.length > 0 &&
        dayEvents.map((event) => (
          <View key={event.id} style={styles.card}>
            {/* Flyer */}
            <View style={styles.flyer}>
              <View style={styles.flyerPlaceholder}>
                <Text style={styles.flyerPlaceholderTitle}>
                  Flyer Preview
                </Text>
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

              <Text style={styles.orgText}>
                {event.organization}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>
                    {event.building}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>
                    {event.timeLabel}
                  </Text>
                </View>
              </View>

              <Text style={styles.addressText}>
                {event.addressLine}
              </Text>

              <View style={styles.footerRow}>
                <View style={styles.timePill}>
                  <Text style={styles.timeText}>
                    {event.timeLabel}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() =>
                    console.log("Navigate to", event.building)
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.navBtnText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
          <View style={styles.createBtnWrap}>
            <TouchableOpacity
              style={styles.createButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("CreateEvent")}
            >
              <Text style={styles.createButtonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 24 }} />
    </ScrollView>
  </SafeAreaView>
)
}