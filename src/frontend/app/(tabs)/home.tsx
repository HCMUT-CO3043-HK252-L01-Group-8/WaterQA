import HomeSkeleton from "@/components/home/HomeSkeleton";
import StatusSummary from "@/components/home/StatusSummary";
import WaterChart from "@/components/home/WaterChart";
import WqiCard from "@/components/home/WqiCard";
import AlertBanner from "@/components/ui/AlertBanner";
import AppHeader from "@/components/ui/AppHeader";
import CustomToast from "@/components/ui/CustomToast";
import LocationSelector from "@/components/ui/LocationSelector";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

export default function HomeDashboard() {
    const tabBarHeight = useTabBarHeight();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [userName] = useState("Đậu Minh Khôi");
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [waterMetrics, setWaterMetrics] = useState({ wqi: 0, pH: 0, hardness: 0, clo: 0, ntu: 0, lastUpdated: "" });
    const [statusData, setStatusData] = useState({ wqiChange: "", sensorStatus: "", sensorIssue: "" });
    const [showAlertBanner, setShowAlertBanner] = useState(false);

    const fetchDashboardData = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const randomWqi = Math.floor(Math.random() * 100);

            setWaterMetrics({
                wqi: randomWqi,
                pH: 7.0,
                hardness: 67,
                clo: 0.5,
                ntu: 1,
                lastUpdated: "06-03-2026 20:36 UTC+7",
            });
            setStatusData({
                wqiChange: randomWqi >= 80 ? "+2" : "-15",
                sensorStatus: randomWqi >= 80 ? "Hoạt động tốt" : "3/4",
                sensorIssue: randomWqi >= 80 ? "Tất cả cảm biến ổn định" : "Vui lòng kiểm tra cảm biến",
            });

            setShowAlertBanner(randomWqi < 80);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDashboardData();
    }, [selectedLocation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (isLoading && !refreshing) return <HomeSkeleton userName={userName} />;

    return (
        <View style={styles.mainContainer}>
            <CustomToast visible={showToast} topInset={insets.top} message="Đã cập nhật dữ liệu mới!" type="success" />

            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A89D"]} />
                    }
                >
                    <View style={styles.header}>
                        <AppHeader />
                        <View style={styles.greetingSection}>
                            <Text style={styles.greetingTitle}>
                                Xin chào, <Text style={styles.userName}>{userName}</Text>
                            </Text>
                            <Text style={styles.greetingSubtitle}>Hãy kiểm tra chất lượng nước của bạn</Text>
                        </View>
                    </View>

                    <AlertBanner
                        visible={showAlertBanner}
                        type="error"
                        title="Đã phát hiện bất thường với cảm biến pH"
                        message="Đã phát hiện hoạt động bất thường của cảm biến pH. Kiểm tra cảm biến hoặc liên hệ với chúng tôi."
                        dateText={waterMetrics.lastUpdated}
                        onClose={() => setShowAlertBanner(false)}
                        onPressDetail={() => console.log("Xem chi tiết")}
                    />

                    <LocationSelector
                        locations={LOCATIONS}
                        selectedLocation={selectedLocation}
                        onSelect={setSelectedLocation}
                    />

                    <WqiCard metrics={waterMetrics} />

                    <StatusSummary
                        wqiChange={statusData.wqiChange}
                        sensorStatus={statusData.sensorStatus}
                        sensorIssue={statusData.sensorIssue}
                        isSafe={waterMetrics.wqi >= 80}
                    />

                    <WaterChart />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    header: { padding: 16 },
    greetingSection: { marginBottom: 4 },
    greetingTitle: { fontSize: 20, color: "#0F172B", marginBottom: 4, fontFamily: "Inter-Regular" },
    userName: { fontFamily: "Inter-Bold" },
    greetingSubtitle: { fontSize: 13, color: "#45556C", fontFamily: "Inter-Regular" },
});
