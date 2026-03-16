import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EventPage } from "../EVENTPAGE/EventPage"
import { CreateEventPage } from "../EVENTPAGE/CreateEventPage"

export type EventsStackParamList = {
  EventHome: undefined
  CreateEvent: { weekStartISO: string }
}

const Stack = createNativeStackNavigator<EventsStackParamList>()

export function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventHome" component={EventPage} />
      <Stack.Screen name="CreateEvent" component={CreateEventPage} />
    </Stack.Navigator>
  )
}