import DetailedChart from "@/components/history/DetailedChart";
import FilterAndExport from "@/components/history/FilterAndExport";
import HistoryList from "@/components/history/HistoryList";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import SummaryCards from "@/components/history/SummaryCards";
import AppHeader from "@/components/ui/AppHeader";
import LocationSelector from "@/components/ui/LocationSelector";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

const HISTORY_LIST = [
    { id: "1", wqi: "92", date: "06-03-2026", time: "20:36", trend: "+3" },
    { id: "2", wqi: "89", date: "05-03-2026", time: "14:20", trend: "+1" },
    { id: "3", wqi: "88", date: "04-03-2026", time: "09:15", trend: "+2" },
    { id: "4", wqi: "86", date: "03-03-2026", time: "18:45", trend: "+4" },
    { id: "5", wqi: "82", date: "02-03-2026", time: "11:10", trend: "-3" },
    { id: "6", wqi: "85", date: "01-03-2026", time: "08:30", trend: "+5" },
];

const CHART_DATA = [85, 82, 86, 88, 89, 92];
const CHART_LABELS = ["01/03", "02/03", "03/03", "04/03", "05/03", "06/03"];

export default function HistoryScreen() {
    const tabBarHeight = useTabBarHeight();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [activeFilter, setActiveFilter] = useState("day");

    const fetchHistoryData = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (error) {
            console.error("Lỗi tải lịch sử:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchHistoryData();
    }, [selectedLocation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistoryData();
    };

    const handleExport = () => {
        console.log("Xuất báo cáo cho:", selectedLocation, activeFilter);
    };

    if (isLoading && !refreshing) return <HistorySkeleton />;

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A89D"]} />}
            >
                <View style={styles.header}>
                    <AppHeader />
                    <Text style={styles.pageTitle}>Lịch sử quan trắc</Text>
                </View>

                <LocationSelector
                    locations={LOCATIONS}
                    selectedLocation={selectedLocation}
                    onSelect={setSelectedLocation}
                />

                <SummaryCards todayWqi={92} trendValue={"+3"} />
                <DetailedChart data={CHART_DATA} labels={CHART_LABELS} />
                <FilterAndExport activeFilter={activeFilter} onFilterChange={setActiveFilter} onExport={handleExport} />
                <HistoryList data={HISTORY_LIST} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold" },
});
