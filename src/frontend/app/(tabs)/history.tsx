import DetailedChart from "@/components/history/DetailedChart";
import FilterAndExport from "@/components/history/FilterAndExport";
import HistoryList from "@/components/history/HistoryList";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import SummaryCards from "@/components/history/SummaryCards";
import AppHeader from "@/components/ui/AppHeader";
import LocationSelector from "@/components/ui/LocationSelector";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "@/services/apiConfig"; 
import { dataServices } from "@/services/dataServices";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

export default function HistoryScreen() {
    const tabBarHeight = useTabBarHeight();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [activeFilter, setActiveFilter] = useState("day");

    const [historyList, setHistoryList] = useState<any[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
    const [chartLabels, setChartLabels] = useState<string[]>([]);
    const [todayWqi, setTodayWqi] = useState<number | string>("--");
    const [trendValue, setTrendValue] = useState<string>("--");

    const fetchHistoryData = async () => {
        try {
            const rowLimit = activeFilter === "day" ? 10 : 30; 
            const response = await dataServices.getHistory(rowLimit);

            if (response && response.success && response.payload) {
                const rawData = Array.isArray(response.payload) 
                    ? response.payload 
                    : (response.payload.rows || []);

                if (rawData.length > 0) {
                    const formattedList = rawData.map((item: any, index: number) => {
                        const dateObj = new Date(item.timestamp);
                        const wqiScore = Number(item.wqi || Math.round((item.temperature + item.humidity) / 2) || 0);

                        let trendStr = "+0";
                        if (index < rawData.length - 1) {
                            const prevItem = rawData[index + 1];
                            const prevWqi = Number(prevItem.wqi || Math.round((prevItem.temperature + prevItem.humidity) / 2) || 0);
                            const diff = wqiScore - prevWqi;
                            trendStr = diff > 0 ? `+${diff}` : `${diff}`;
                        }

                        return {
                            id: String(item.observation_id || index),
                            wqi: String(wqiScore),
                            date: dateObj.toLocaleDateString("vi-VN"), 
                            time: dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), 
                            trend: trendStr, 
                        };
                    });

                    setTodayWqi(formattedList[0].wqi);
                    setTrendValue(formattedList[0].trend);

                    const chartRecords = rawData.slice(0, 6).reverse();
                    const newChartData = chartRecords.map((item: any) => 
                        Number(item.wqi || Math.round((item.temperature + item.humidity) / 2) || 0)
                    );
                    const newChartLabels = chartRecords.map((item: any) => {
                        const d = new Date(item.timestamp);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                    });

                    setHistoryList(formattedList);
                    setChartData(newChartData);
                    setChartLabels(newChartLabels);
                } else {
                    setHistoryList([]);
                    setChartData([]);
                    setChartLabels([]);
                    setTodayWqi("--");
                    setTrendValue("--");
                }
            }
        } catch (error) {
            console.error("Lỗi tải lịch sử quan trắc từ API:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchHistoryData();
    }, [selectedLocation, activeFilter]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistoryData();
    };

    const handleExport = async () => {
        const rowLimit = activeFilter === "day" ? 10 : 100; 
        const url = `${BASE_URL}/data/export?rowLimit=${rowLimit}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url); 
            } else {
                Alert.alert(t("common.error", "Lỗi"), "Thiết bị không hỗ trợ mở liên kết tải file.");
            }
        } catch (error) {
            Alert.alert(t("common.error", "Lỗi"), "Đã xảy ra sự cố trong quá trình xuất tập dữ liệu.");
        }
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
                    <Text style={styles.pageTitle}>{t("history.title", "Lịch sử quan trắc")}</Text>
                </View>

                <LocationSelector
                    locations={LOCATIONS}
                    selectedLocation={selectedLocation}
                    onSelect={setSelectedLocation}
                />
                
                <SummaryCards todayWqi={Number(todayWqi) || 0} trendValue={trendValue} />
                
                <DetailedChart data={chartData} labels={chartLabels} />
                <FilterAndExport activeFilter={activeFilter} onFilterChange={setActiveFilter} onExport={handleExport} />
                <HistoryList data={historyList} />
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
