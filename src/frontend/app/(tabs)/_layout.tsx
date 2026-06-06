import CustomNavBar from "@/components/ui/CustomNavBar";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
    const { t } = useTranslation();
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
            <Tabs.Screen
                name="ai-predict"
                options={{
                    title: t("aiPredict.tabTitle", "Dự đoán"),
                }}
            />
        </Tabs>
    );
}
