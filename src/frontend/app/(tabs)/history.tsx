import DetailedChart from "@/components/history/DetailedChart";
import FilterAndExport from "@/components/history/FilterAndExport";
import HistoryList from "@/components/history/HistoryList";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import SummaryCards from "@/components/history/SummaryCards";
import AppHeader from "@/components/ui/AppHeader";
import LocationSelector from "@/components/ui/LocationSelector";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
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
    const [todayWqi, setTodayWqi] = useState<number>(0);
    const [trendValue, setTrendValue] = useState<string>("+0");

    const fetchHistoryData = async () => {
        try {
            const limit = activeFilter === "day" ? 24 : 30;
            const response = await dataServices.getHistory(limit);

            if (response.success && response.payload?.data) {
                const rawData = response.payload.data;
                const sortedData = [...rawData].sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                );

                const formattedList = [...sortedData].reverse().map((item: any, index: number, arr: any[]) => {
                    const dateObj = new Date(item.timestamp);
                    const dateStr = dateObj.toLocaleDateString("vi-VN");
                    const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

                    const wqi = Math.round(item.temperature || 0);

                    let trendStr = "+0";
                    if (index < arr.length - 1) {
                        const prevWqi = Math.round(arr[index + 1].temperature || 0);
                        const diff = wqi - prevWqi;
                        trendStr = diff > 0 ? `+${diff}` : `${diff}`;
                    }

                    return {
                        id: String(item.observation_id),
                        wqi: String(wqi),
                        date: dateStr,
                        time: timeStr,
                        trend: trendStr,
                    };
                });
                setHistoryList(formattedList);

                const cData = sortedData.map((item: any) => Math.round(item.temperature || 0));
                const cLabels = sortedData.map((item: any) => {
                    const d = new Date(item.timestamp);
                    return activeFilter === "day" ? `${d.getHours()}:00` : `${d.getDate()}/${d.getMonth() + 1}`;
                });
                setChartData(cData);
                setChartLabels(cLabels);

                if (formattedList.length > 0) {
                    setTodayWqi(Number(formattedList[0].wqi));
                    setTrendValue(formattedList[0].trend);
                }
            }
        } catch (error) {
            console.log("Lỗi lấy lịch sử:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation, activeFilter]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistoryData();
    };

    const handleExport = async () => {
        try {
            const limit = activeFilter === "day" ? 24 : 30;
            const response = await dataServices.exportData(limit);
            const fileName = `WaterQA_History_${new Date().getTime()}.csv`;

            if (Platform.OS === "web") {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // const FileSystem = await import("expo-file-system");
                // const Sharing = await import("expo-sharing");

                // const fileReader = new FileReader();
                // fileReader.onload = async () => {
                //     try {
                //         const base64Data = (fileReader.result as string).split(",")[1];
                //         const fileUri = `${FileSystem.documentDirectory}${fileName}`;

                //         await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                //             encoding: FileSystem.EncodingType.Base64,
                //         });

                //         const isAvailable = await Sharing.isAvailableAsync();
                //         if (isAvailable) {
                //             await Sharing.shareAsync(fileUri, {
                //                 mimeType: "text/csv",
                //                 dialogTitle: t("history.export", "Xuất báo cáo"),
                //                 UTI: "public.comma-separated-values-text",
                //             });
                //         } else {
                //             Alert.alert(t("common.error", "Lỗi"), "Thiết bị không hỗ trợ tính năng chia sẻ/lưu file.");
                //         }
                //     } catch (error) {
                //         console.error("Lỗi export CSV:", error);
                //         Alert.alert(t("common.error", "Lỗi"), "Lỗi khi lưu file vào hệ thống.");
                //     }
                // };
                // fileReader.readAsDataURL(new Blob([response]));
                Alert.alert(t("common.error", "Lỗi"), "Tính năng đang phát triển.");
            }
        } catch (error) {
            console.log("Lỗi export CSV:", error);
            Alert.alert(t("common.error", "Lỗi"), "Không thể xuất dữ liệu lúc này. Xin vui lòng thử lại sau.");
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
