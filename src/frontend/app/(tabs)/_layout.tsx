import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // Tắt chữ
                tabBarActiveTintColor: "#00A89D", // Màu khi chọn
                tabBarInactiveTintColor: "#000000", // Màu khi không chọn
                tabBarStyle: {
                    position: "absolute",
                    bottom: Platform.OS === "ios" ? 30 : 16, // Hạ thấp xuống một chút trên Android
                    left: 24, // Tăng lề 2 bên để thanh ngắn lại một chút (nhìn thon gọn hơn)
                    right: 24,
                    elevation: 0,
                    backgroundColor: "#EDFAFA",
                    borderRadius: 30, // Giảm bo góc tương ứng với chiều cao mới
                    height: 60, // GIẢM CHIỀU CAO TỪ 70 XUỐNG 60
                    borderTopWidth: 0,
                    paddingBottom: 0, // QUAN TRỌNG: Ép padding dưới bằng 0 để bỏ khoảng trắng thừa mặc định
                    paddingTop: 0,
                    ...styles.shadow,
                },
                tabBarItemStyle: {
                    justifyContent: "center", // Căn giữa icon theo chiều dọc
                    alignItems: "center", // Căn giữa icon theo chiều ngang
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Feather name="home" size={22} color={color} /> // Có thể giảm size icon xuống 22 nếu thích nhỏ hơn nữa
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={22} color={color} />,
                }}
            />

            <Tabs.Screen
                name="notification"
                options={{
                    tabBarIcon: ({ color }) => <Feather name="bell" size={22} color={color} />,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#00A89D",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4, // Giảm bóng đổ xuống một chút cho nhẹ nhàng
    },
});
