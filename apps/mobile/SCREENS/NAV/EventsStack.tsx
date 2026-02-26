import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EventPage } from "../EVENTPAGE/EventPage"
import { CreateEventPage } from "../EVENTPAGE/CreateEventPage"

export type EventsStackParamList = { EventsHome: undefined; CreateEvent: undefined }
const Stack = createNativeStackNavigator<EventsStackParamList>()
export function EventsStack() { 
    return (
     <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="EventsHome" component={EventPage} />
        <Stack.Screen name="CreateEvent" component={CreateEventPage} />
     </Stack.Navigator> 
    )     
}