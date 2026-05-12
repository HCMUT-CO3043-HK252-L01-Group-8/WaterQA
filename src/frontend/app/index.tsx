import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Kiểm tra xem user đã chọn "Ghi nhớ đăng nhập" lần trước chưa
        const checkRememberedUser = async () => {
            try {
                const rememberedUser = await AsyncStorage.getItem("rememberedUser");
                if (rememberedUser) {
                    // Có dữ liệu đã lưu → vào thẳng màn hình Home
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkRememberedUser();
    }, []);

    // Hiện loading spinner trong khi đang kiểm tra AsyncStorage
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#00A89D" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/welcome" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
