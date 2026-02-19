import React from "react";
import { View, Text, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomePage.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, TouchableOpacity, Alert  } from "react-native";

const categories = ["Libraries", "Cafeterias", "Parking", "Gym", "Events"] as const;
type EventCards ={
    id: string;
    title: string;
    department?: string;
    time: string;
    location: string;
    icon?: string;
    isLive: boolean;
};
type Building ={
    id: string
    name: string
    subtitle: string 
    distance: string 
    icon: string
}
const buildingsData: Building[] = [
    {
      id: "1",
      name: "Library",
      subtitle: "Main Campus Library",
      distance: "200m",
      icon: "📚",   
    },
    {
        id: "2",
        name: "Cafeteria",
        subtitle: "Student Union Cafeteria",
        distance: "150m",
        icon: "🍽️",
    },
    {
        id: "3",
        name: "Parking Lot A",
        subtitle: "Near Science Building",
        distance: "300m",
        icon: "🅿️",
    },
    {
        id: "4",
        name: "Campus Gym",
        subtitle: "Fitness Center",
        distance: "400m",
        icon: "🏋️‍♂️",
    },
    {
        id: "5",
        name: "SCIENCE 3",
        subtitle: "NSME",
        distance: "500m",
        icon: "🔬",
    },
    {
        id: "6",
        name: "SCIENCE 1",
        subtitle: "NSME",
        distance: "400m",
        icon: "🔬",
    }
];
const EventCardData: EventCards[] = [
    {
      id: "1",
      title: "Yoga Workshop",
      department: "SEC",
      time: "10:00 AM - 11:00 AM",
      location: "Campus Gym",
      icon: "🧘‍♀️",
      isLive: true,
    },
    {
      id: "2",
      title: "Art Workshop",
      department: "Arts Department",
      time: "1:00 PM - 3:00 PM",
      location: "Art Center",
      icon: "🎨",
      isLive: false,
    },
    {
      id: "3",
      title: "Tech Talk",
      department: "NSME",
      time: "4:00 PM - 5:00 PM",
      location: "Auditorium",
      icon: "💻",
      isLive: true,
    },
    {
      id: "4",
      title: "DATA SCIENCE SEMINAR",
      department: "NSME",
      time: "3:00 PM - 1:00 PM",
      location: "Auditorium",
      icon: "📊",
      isLive: true,
    },
  ];

export function HomePage() {
    const [category, setCategory] = useState<(typeof categories)[number]>("Libraries");
    const [query, setQuery] = useState("");
    const placeholder = "Search for classes, buildings,...";
    const handleNavigate = (ev: EventCards) => {
        // tạm thời chỉ alert / log — sau này bạn đổi thành navigation
        Alert.alert("Navigate", `${ev.title}\n${ev.location}`);
        console.log("Navigate ->", ev.id, ev.location);
      };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
    <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
    >
        {/* HEADER */}
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

        {/* NOTICATION AREA */}
        <View style={styles.locationBanner}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#2563EB" style={styles.locationIcon}/>
            <Text style={styles.locationText}>You are near .... </Text>
        </View>

        {/*SCROLL AREA*/}
        {/*SEARCH BAR*/}
        <View style={styles.searchRow}>
            <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color="#000000" />
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    value={query}
                    onChangeText={setQuery}
                    placeholderTextColor="#000000"
                />
            </View>
        </View>

        {/* CHIPS */}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {categories.map((c) => {
            const active = category === c;
            return (
            <TouchableOpacity
                key={c}
                onPress={() => {setCategory(c);
                                setQuery(c);}
                }
                style={[styles.chip, active && styles.chipActive]}
            >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
            );
        })}
        </ScrollView>

        {/* QUICKACTION DU MA MET QUAAAAAAAAA */}
        <View style={styles.quickRow}>
            <TouchableOpacity style={styles.primaryCard}>
                <Text style={styles.primaryCardTitle}>Get Directions</Text>
                <Text style={styles.primaryCardSub}> Places around you</Text>
                <MaterialCommunityIcons name="arrow-right-circle" size={32} color="#FFFFFF" style={styles.primaryCardIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCard}>
                <MaterialCommunityIcons name="map-marker-radius" size={32} color="#000000" />
                <Text style={styles.secondaryCardTitle}> My Location</Text>
            </TouchableOpacity>
        </View>
        
        {/* TODAY EVENTS */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Events</Text>
            <View style={styles.livePill}>
                <Text style={styles.livePillText}>LIVE</Text>    
            </View> 
            <View style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>View All</Text>
            </View>
        </View>        

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsRow}
        >
            {EventCardData.map((ev) => (
            <View key={ev.id} style={styles.eventCard}>
                <View style={styles.eventTop}>
                        <View style={styles.eventIconCircle}>
                            <Text style={styles.eventIconEmoji}>{ev.icon}</Text>
                        </View>
                        <View style={[styles.badge, ev.isLive ? styles.badgeLive : styles.badgeNow]}>
                            <Text style={styles.badgeText}>{ev.isLive ? "LIVE" : "OPEN NOW"}</Text>
                        </View>
                </View>
                <Text style={styles.eventTitle} numberOfLines={1}>{ev.title}</Text>
                {!!ev.department && (
                        <Text style={styles.eventSubtitle} numberOfLines={1}>{ev.department}</Text>
                )}

                
                <View style={styles.metaRow}>
                    <Text style={styles.metaIcon}>🕒</Text>
                    <Text style={styles.metaText} numberOfLines={1}>{ev.time}</Text>
                </View>

               
                <View style={styles.metaRow}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.metaText} numberOfLines={1}>{ev.location}</Text>
                </View>


                <TouchableOpacity style={styles.eventBtn}>
                    <Text style={styles.eventBtnText}>Navigate There</Text>
                </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* BUILDINGS GRID */}
        <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favorite Buildings</Text>
        <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
        </View>


        <View style={styles.grid}>
        {buildingsData.map((building) => (
            <TouchableOpacity key={building.id} style={styles.buildingCard}>
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
                {building.distance}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    </ScrollView>

    </SafeAreaView>
  );
}
