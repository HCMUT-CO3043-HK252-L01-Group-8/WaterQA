import React, { useEffect, useState } from "react";
import DetailedChart from "@/components/history/DetailedChart";
import FilterAndExport from "@/components/history/FilterAndExport";
import HistoryList from "@/components/history/HistoryList";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import SummaryCards from "@/components/history/SummaryCards";
import AppHeader from "@/components/ui/AppHeader";
import LocationSelector from "@/components/ui/LocationSelector";
import ParamSelector from "@/components/ui/ParamSelector";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { dataServices } from "@/services/dataServices";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

const STATION_MAP: Record<string, number> = {
    "268 Lý Thường Kiệt": 1,
    "KTX Khu A - ĐHQG": 2,
    "Khu Công Nghệ Cao": 3,
    "Hồ Đá - Làng Đại Học": 4,
};

const PARAMETERS = [
    { label: "Nhiệt độ (°C)", value: "temperature" },
    { label: "Độ ẩm (%)", value: "humidity" },
    { label: "Độ pH", value: "ph" },
    { label: "Ánh sáng (Lux)", value: "light_intensity" },
    { label: "Mực nước (cm)", value: "water_level" },
    { label: "Độ đục (NTU)", value: "turbidity" }
];

const PARAM_UI_CONFIG: Record<string, { name: string; unit: string }> = {
    temperature: { name: "Nhiệt độ", unit: "°C" },
    humidity: { name: "Độ ẩm", unit: "%" },
    ph: { name: "Độ pH", unit: "" },
    light_intensity: { name: "Ánh sáng", unit: "Lux" },
    water_level: { name: "Mực nước", unit: "cm" },
    turbidity: { name: "Độ đục", unit: "NTU" }
};

export default function HistoryScreen() {
    const tabBarHeight = useTabBarHeight();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [activeFilter, setActiveFilter] = useState("day");

    const [selectedParam, setSelectedParam] = useState("temperature");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<"start" | "end" | null>(null);

    const [historyList, setHistoryList] = useState<any[]>([]);
    const [trendValue, setTrendValue] = useState<string>("+0");

    const fetchHistoryData = async () => {
        try {
            const limit = activeFilter === "day" ? 24 : 30;
            const stationId = STATION_MAP[selectedLocation] || 1;
            const response = await dataServices.getStationHistory(stationId, limit);

            let rawData: any[] = [];
            if (response.payload && typeof response.payload === "object" && Array.isArray(response.payload.data)) {
                rawData = response.payload.data;
            } else if (Array.isArray(response.payload)) {
                rawData = response.payload;
            }

            const validData = rawData.filter((item: any) => item[selectedParam] !== null && item[selectedParam] !== undefined);

            if (validData.length > 0) {
                const parseSafeDate = (dateStr: string) => {
                    if (!dateStr) return new Date();
                    const safeStr = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
                    return new Date(safeStr);
                };

                const sortedData = [...validData].sort(
                    (a, b) => parseSafeDate(a.timestamp).getTime() - parseSafeDate(b.timestamp).getTime(),
                );

                const formattedList = [...sortedData].reverse().map((item: any, index: number, arr: any[]) => {
                    const dateObj = parseSafeDate(item.timestamp);
                    const dateStr = dateObj.toLocaleDateString("vi-VN");

                    const timeStr = dateObj.toLocaleTimeString("vi-VN", { 
                        hour: "2-digit", 
                        minute: "2-digit",
                        hour12: false 
                    });

                    const currentValue = Number(item[selectedParam]) || 0; 

                    let trendStr = "+0";
                    if (index < arr.length - 1) {
                        const prevItem = arr[index + 1];
                        const prevValue = Number(prevItem[selectedParam]) || 0;
                        const diff = Number((currentValue - prevValue).toFixed(1)); 
                        trendStr = diff > 0 ? `+${diff}` : `${diff}`;
                    }

                    return {
                        id: String(item.observation_id || Math.random()),
                        wqi: currentValue.toFixed(1), 
                        date: dateStr,
                        time: timeStr,
                        trend: trendStr,
                        timestampValue: dateObj.getTime(),
                    };
                });
                
                setHistoryList(formattedList);

                if (formattedList.length > 0) {
                    setTrendValue(formattedList[0].trend || "+0");
                }
            } else {
                setTrendValue("+0");
                setHistoryList([]);
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
    }, [selectedLocation, activeFilter, selectedParam]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistoryData();
    };

    const handleSortDate = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const getFilteredAndSortedData = () => {
        let filteredData = [...historyList];

        if (startDate) {
            const startLimit = new Date(startDate).setHours(0, 0, 0, 0);
            filteredData = filteredData.filter(item => item.timestampValue >= startLimit);
        }
        if (endDate) {
            const endLimit = new Date(endDate).setHours(23, 59, 59, 999);
            filteredData = filteredData.filter(item => item.timestampValue <= endLimit);
        }

        return filteredData.sort((a, b) => {
            return sortOrder === "asc" 
                ? a.timestampValue - b.timestampValue 
                : b.timestampValue - a.timestampValue;
        });
    };

    const displayList = getFilteredAndSortedData();

    const filteredChartValues = [...displayList].reverse().map(item => Number(item.wqi) || 0);
    
    const filteredChartLabels = [...displayList].reverse().map((item, idx, arr) => {
        if (idx === 0 || idx === arr.length - 1) {
            if (activeFilter === "day") {
                return item.time;
            } else {
                const parts = item.date.split("/");
                return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : item.date.substring(0, 5);
            }
        }
        return "";
    });

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(null);
        if (selectedDate && event.type !== "dismissed") {
            if (showDatePicker === "start") setStartDate(selectedDate);
            if (showDatePicker === "end") setEndDate(selectedDate);
        }
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
                Alert.alert(t("common.error", "Lỗi"), "Tính năng đang phát triển.");
            }
        } catch (error) {
            console.log("Lỗi export CSV:", error);
            Alert.alert(t("common.error", "Lỗi"), "Không thể xuất dữ liệu lúc này. Xin vui lòng thử lại sau.");
        }
    };

    const resetDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
    };

    if (isLoading && !refreshing) return <HistorySkeleton />;

    const currentUi = PARAM_UI_CONFIG[selectedParam] || PARAM_UI_CONFIG.temperature;

    const dynamicTodayValue = displayList.length > 0 ? `${displayList[0].wqi} ${currentUi.unit}` : `0.0 ${currentUi.unit}`;

    const dynamicHistoryList = displayList.map(item => ({
        ...item,
        wqi: `${item.wqi} ${currentUi.unit}`
    }));

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

                <LocationSelector locations={LOCATIONS} selectedLocation={selectedLocation} onSelect={setSelectedLocation} />
                <ParamSelector parameters={PARAMETERS} selectedParam={selectedParam} onSelect={setSelectedParam} />

                <SummaryCards 
                    todayWqi={dynamicTodayValue} 
                    trendValue={trendValue} 
                    avgDesc={`${currentUi.name} trung bình`}
                    trendDesc={`Biến động ${currentUi.name}`}
                />

                {filteredChartValues.length > 0 && (
                    <DetailedChart 
                        data={filteredChartValues} 
                        labels={filteredChartLabels} 
                        paramName={currentUi.name}
                    />
                )}
                
                <FilterAndExport activeFilter={activeFilter} onFilterChange={setActiveFilter} onExport={handleExport} />
                
                <View style={styles.toolsContainer}>
                    <View style={styles.dateFilterContainer}>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker("start")}>
                            <Feather name="calendar" size={14} color="#64748B" />
                            <Text style={styles.dateBtnText}>
                                {startDate ? startDate.toLocaleDateString("vi-VN") : "Từ ngày"}
                            </Text>
                        </TouchableOpacity>
                        
                        <Text style={styles.dateSeparator}>-</Text>
                        
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker("end")}>
                            <Feather name="calendar" size={14} color="#64748B" />
                            <Text style={styles.dateBtnText}>
                                {endDate ? endDate.toLocaleDateString("vi-VN") : "Đến ngày"}
                            </Text>
                        </TouchableOpacity>

                        {(startDate || endDate) && (
                            <TouchableOpacity style={styles.resetBtn} onPress={resetDateFilter}>
                                <Feather name="x-circle" size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.sortBtnActive} onPress={handleSortDate}>
                        <Text style={styles.sortBtnTextActive}>Sắp xếp</Text>
                        <Feather name={sortOrder === "asc" ? "chevron-up" : "chevron-down"} size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>

                {showDatePicker && Platform.OS !== 'web' && (
                    <DateTimePicker
                        value={showDatePicker === "start" ? (startDate || new Date()) : (endDate || new Date())}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {dynamicHistoryList.length > 0 ? (
                    <HistoryList data={dynamicHistoryList} />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Feather name="inbox" size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>Không có dữ liệu trong khoảng thời gian này.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    
    toolsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dateFilterContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
    },
    dateBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    dateBtnText: {
        fontSize: 12,
        color: "#45556C",
        fontFamily: "Inter-Medium",
        marginLeft: 6,
    },
    dateSeparator: {
        marginHorizontal: 6,
        color: "#94A3B8",
        fontFamily: "Inter-Medium",
    },
    resetBtn: {
        marginLeft: 8,
        padding: 4,
    },
    sortBtnActive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00A89D",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sortBtnTextActive: {
        fontSize: 12,
        color: "#FFFFFF",
        fontFamily: "Inter-Medium",
    },

    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderStyle: "dashed",
    },
    emptyText: {
        fontSize: 14,
        color: "#94A3B8",
        fontFamily: "Inter-Medium",
        textAlign: "center",
    },
});
