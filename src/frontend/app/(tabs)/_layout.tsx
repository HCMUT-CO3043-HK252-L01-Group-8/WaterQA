import CustomNavBar from "@/components/ui/CustomNavBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#00A89D",
                tabBarInactiveTintColor: "#000000",
            }}
            tabBar={(props) => <CustomNavBar {...props} />}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                }}
            />
            <Tabs.Screen
                name="iot-dashboard"
                options={{
                    title: "IoT",
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: "Notification",
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                }}
            />
        </Tabs>
    );
}
