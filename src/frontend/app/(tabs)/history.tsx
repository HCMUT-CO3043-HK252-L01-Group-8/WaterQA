import React, { useEffect, useState, useMemo } from "react";
import DetailedChart from "@/components/history/DetailedChart";
import FilterAndExport from "@/components/history/FilterAndExport";
import HistoryList, { HistoryItem } from "@/components/history/HistoryList";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import SummaryCards from "@/components/history/SummaryCards";
import OverviewChart from "@/components/history/OverviewChart";
import AppHeader from "@/components/ui/AppHeader";
import LocationSelector from "@/components/ui/LocationSelector";
import ParamSelector from "@/components/ui/ParamSelector";
import WebDatePicker from "@/components/ui/WebDatePicker";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { dataServices } from "@/services/dataServices";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

// Tất cả các trạm đều sử dụng chung 1 bộ dữ liệu từ station_id = 1
const SHARED_STATION_ID = 1;

const PARAMETERS = [
    { label: "Độ pH", value: "ph" },
    { label: "Độ cứng (mg/L)", value: "hardness" },
    { label: "Độ đục (NTU)", value: "turbidity" },
    { label: "Chất rắn TDS (mg/L)", value: "solids" },
    { label: "Cloramin (mg/L)", value: "chloramines" },
    { label: "Sunfat (mg/L)", value: "sulfate" },
    { label: "Độ dẫn điện (μS/cm)", value: "conductivity" },
    { label: "Carbon hữu cơ (mg/L)", value: "organic_carbon" },
    { label: "Trihalomethanes (μg/L)", value: "trihalomethanes" },
    { label: "Tổng quan", value: "overview" }
];

const PARAM_UI_CONFIG: Record<string, { name: string; unit: string }> = {
    ph: { name: "Độ pH", unit: "" },
    hardness: { name: "Độ cứng", unit: "mg/L" },
    turbidity: { name: "Độ đục", unit: "NTU" },
    solids: { name: "Chất rắn", unit: "mg/L" },
    chloramines: { name: "Cloramin", unit: "mg/L" },
    sulfate: { name: "Sunfat", unit: "mg/L" },
    conductivity: { name: "Độ dẫn điện", unit: "μS/cm" },
    organic_carbon: { name: "Carbon hữu cơ", unit: "mg/L" },
    trihalomethanes: { name: "Trihalomethanes", unit: "μg/L" },
    overview: { name: "Tổng quan", unit: "" }
};

export default function HistoryScreen() {
    const tabBarHeight = useTabBarHeight();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [activeFilter, setActiveFilter] = useState("day");

    const [selectedParam, setSelectedParam] = useState("ph");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<"start" | "end" | null>(null);

    const [selectedHourData, setSelectedHourData] = useState<{ date: string, hour: number } | null>(null);

    const [historyList, setHistoryList] = useState<any[]>([]);

    const fetchHistoryData = async () => {
        try {
            const limit = 1000;
            // Tất cả các trạm đều dùng chung dữ liệu từ station_id = 1
            const response = await dataServices.getStationHistory(SHARED_STATION_ID, limit);

            let rawData: any[] = [];
            if (response.payload && typeof response.payload === "object" && Array.isArray(response.payload.data)) {
                rawData = response.payload.data;
            } else if (Array.isArray(response.payload)) {
                rawData = response.payload;
            }

            const parseSafeDate = (dateStr: string) => {
                if (!dateStr) return new Date();
                // SQLite lưu timestamp theo UTC (không có timezone info)
                // Cần thêm "Z" để JS parse đúng là UTC, tránh bị lệch múi giờ
                let safeStr = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
                if (!safeStr.endsWith("Z") && !safeStr.includes("+")) {
                    safeStr += "Z"; // Đánh dấu là UTC
                }
                return new Date(safeStr);
            };

            const formattedList = rawData.map(item => {
                const dateObj = parseSafeDate(item.timestamp);
                return {
                    ...item,
                    timestampValue: dateObj.getTime(),
                    dateObj,
                };
            });
            
            setHistoryList(formattedList);
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
    }, [selectedLocation]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedHourData) {
            interval = setInterval(() => {
                fetchHistoryData();
            }, 10000); // 10 seconds auto-refresh when viewing 5-min drill
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHourData, selectedLocation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistoryData();
    };

    const handleSortDate = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const displayList = useMemo(() => {
        let validData = historyList.filter(item => {
            if (selectedParam === "overview") return true;
            return item[selectedParam] !== null && item[selectedParam] !== undefined;
        });

        // 1. Filter by date
        if (startDate) {
            const startLimit = new Date(startDate).setHours(0, 0, 0, 0);
            validData = validData.filter(item => item.timestampValue >= startLimit);
        }
        if (endDate) {
            const endLimit = new Date(endDate).setHours(23, 59, 59, 999);
            validData = validData.filter(item => item.timestampValue <= endLimit);
        }

        // 1.5 Filter by selectedHour if active (5-min drill-down)
        if (activeFilter === "day" && selectedHourData) {
            validData = validData.filter(item => {
                const d = item.dateObj as Date;
                const dString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return dString === selectedHourData.date && d.getHours() === selectedHourData.hour;
            });
        }

        let processedData: any[] = [];

        // 2. Group and aggregate
        if (activeFilter === "month") {
            const groups: Record<string, { latestValue: number; maxTimestamp: number; count: number; timestamp: number }> = {};
            validData.forEach(item => {
                const d = item.dateObj as Date;
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (!groups[key]) groups[key] = { latestValue: 0, maxTimestamp: 0, count: 0, timestamp: new Date(d.getFullYear(), d.getMonth(), 1).getTime() };
                const ts = item.timestampValue;
                const val = Number(item[selectedParam]);
                if (!isNaN(val)) {
                    if (ts >= groups[key].maxTimestamp) {
                        groups[key].maxTimestamp = ts;
                        groups[key].latestValue = val;
                    }
                    groups[key].count += 1;
                }
            });

            processedData = Object.entries(groups).map(([key, val]) => {
                const actualVal = val.latestValue;
                const [year, month] = key.split('-');
                return {
                    id: key,
                    rawWqi: actualVal,
                    wqi: actualVal.toFixed(2),
                    date: `Tháng ${month}/${year}`,
                    time: "",
                    trend: "+0",
                    timestampValue: val.timestamp,
                    isGroup: true,
                    groupType: "month",
                    groupYear: Number(year),
                    groupMonth: Number(month) - 1,
                };
            });
        } else if (activeFilter === "year") {
            const groups: Record<string, { latestValue: number; maxTimestamp: number; count: number; timestamp: number }> = {};
            validData.forEach(item => {
                const d = item.dateObj as Date;
                const key = `${d.getFullYear()}`;
                if (!groups[key]) groups[key] = { latestValue: 0, maxTimestamp: 0, count: 0, timestamp: new Date(d.getFullYear(), 0, 1).getTime() };
                const ts = item.timestampValue;
                const val = Number(item[selectedParam]);
                if (!isNaN(val)) {
                    if (ts >= groups[key].maxTimestamp) {
                        groups[key].maxTimestamp = ts;
                        groups[key].latestValue = val;
                    }
                    groups[key].count += 1;
                }
            });

            processedData = Object.entries(groups).map(([key, val]) => {
                const actualVal = val.latestValue;
                return {
                    id: key,
                    rawWqi: actualVal,
                    wqi: actualVal.toFixed(2),
                    date: `Năm ${key}`,
                    time: "",
                    trend: "+0",
                    timestampValue: val.timestamp,
                    isGroup: true,
                    groupType: "year",
                    groupYear: Number(key),
                };
            });
        } else if (activeFilter === "day" && !selectedHourData) {
            // Show 24 hourly slots for the selected day
            let targetDate = new Date();
            if (startDate) {
                targetDate = new Date(startDate);
            }
            
            // Filter validData to only include targetDate
            const startLimit = new Date(targetDate).setHours(0, 0, 0, 0);
            const endLimit = new Date(targetDate).setHours(23, 59, 59, 999);
            const singleDayData = validData.filter(item => item.timestampValue >= startLimit && item.timestampValue <= endLimit);

            const dateString = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
            
            // Group by hour - pick the latest record per hour
            const groups: Record<number, { latestValue: number; maxTimestamp: number; count: number }> = {};
            for (let i = 0; i < 24; i++) groups[i] = { latestValue: 0, maxTimestamp: 0, count: 0 };

            singleDayData.forEach(item => {
                const d = item.dateObj as Date;
                const h = d.getHours();
                const ts = item.timestampValue;
                const val = Number(item[selectedParam]);
                if (!isNaN(val)) {
                    if (ts >= groups[h].maxTimestamp) {
                        groups[h].maxTimestamp = ts;
                        groups[h].latestValue = val;
                    }
                    groups[h].count += 1;
                }
            });

            processedData = Object.keys(groups).map(key => {
                const hour = parseInt(key, 10);
                const val = groups[hour];
                
                // Only show actual data — no backfill
                const actualVal = val.count > 0 ? val.latestValue : null;
                
                const isFuture = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour).getTime() > Date.now();
                const showEmpty = isFuture || actualVal === null;

                return {
                    id: `${dateString} ${String(hour).padStart(2, '0')}:00`,
                    rawWqi: showEmpty ? null : actualVal,
                    wqi: showEmpty ? "-" : (actualVal as number).toFixed(2),
                    date: dateString.split("-").reverse().join("/"),
                    time: `${String(hour).padStart(2, '0')}:00`,
                    trend: "+0",
                    timestampValue: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour).getTime(),
                    isGroup: true,
                    groupType: "hour",
                    groupDate: dateString,
                    groupHour: hour,
                    hasData: val.count > 0,
                    isFuture: isFuture
                };
            });

        } else {
            // Drill down: 5-min intervals for the selected hour
            const targetDateStr = selectedHourData?.date || '';
            const targetHour = selectedHourData?.hour || 0;
            const targetYear = parseInt(targetDateStr.split('-')[0] || "2026", 10);
            const targetMonth = parseInt(targetDateStr.split('-')[1] || "1", 10) - 1;
            const targetDay = parseInt(targetDateStr.split('-')[2] || "1", 10);
            
            // 5-min buckets: 0=:00, 1=:05, 2=:10 ... 11=:55
            const groups: Record<number, { latestValue: number; maxTimestamp: number; count: number }> = {};
            for (let i = 0; i < 12; i++) groups[i] = { latestValue: 0, maxTimestamp: 0, count: 0 };
            
            validData.forEach(item => {
                const d = item.dateObj as Date;
                const min = d.getMinutes();
                const bucket = Math.floor(min / 5);
                if (bucket >= 0 && bucket < 12) {
                    const ts = item.timestampValue;
                    const val = Number(item[selectedParam]);
                    if (!isNaN(val)) {
                        if (ts >= groups[bucket].maxTimestamp) {
                            groups[bucket].maxTimestamp = ts;
                            groups[bucket].latestValue = val;
                        }
                        groups[bucket].count += 1;
                    }
                }
            });

            processedData = Object.keys(groups).map(key => {
                const bucket = parseInt(key, 10);
                const val = groups[bucket];
                const minuteStr = String(bucket * 5).padStart(2, '0');
                
                // Only actual data — no backfill
                const actualVal = val.count > 0 ? val.latestValue : null;
                
                const timestampValue = new Date(targetYear, targetMonth, targetDay, targetHour, bucket * 5).getTime();
                const isFuture = timestampValue > Date.now();
                
                const showEmpty = isFuture || actualVal === null;

                return {
                    id: `${targetDateStr} ${String(targetHour).padStart(2, '0')}:${minuteStr}`,
                    rawWqi: showEmpty ? null : actualVal,
                    wqi: showEmpty ? "-" : (actualVal as number).toFixed(2),
                    date: targetDateStr.split("-").reverse().join("/"),
                    time: `${String(targetHour).padStart(2, '0')}:${minuteStr}`,
                    trend: "+0",
                    timestampValue: timestampValue,
                    isGroup: true,
                    groupType: "minute",
                    hasData: val.count > 0,
                    isFuture: isFuture
                };
            });
        }

        // 3. Sort ascending first to calculate trend
        const ascData = [...processedData].sort((a, b) => a.timestampValue - b.timestampValue);
        
        ascData.forEach((item, idx) => {
            if (idx === 0) item.trend = "+0";
            else {
                if (item.isFuture || item.wqi === "-") {
                    item.trend = "-";
                } else {
                    // find last valid item
                    let lastValidItem = null;
                    for (let i = idx - 1; i >= 0; i--) {
                        if (ascData[i].wqi !== "-") {
                            lastValidItem = ascData[i];
                            break;
                        }
                    }
                    if (lastValidItem) {
                        const diff = item.rawWqi - lastValidItem.rawWqi;
                        item.trend = diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
                    } else {
                        item.trend = "+0";
                    }
                }
            }
        });

        // 4. Return sorted by user preference
        return sortOrder === "asc" ? ascData : ascData.reverse();

    }, [historyList, selectedParam, startDate, endDate, activeFilter, sortOrder, selectedHourData]);

    const handleDrillDown = (item: HistoryItem) => {
        if (item.groupType === 'year' && item.groupYear !== undefined) {
            setActiveFilter('month');
            setStartDate(new Date(item.groupYear, 0, 1));
            setEndDate(new Date(item.groupYear, 11, 31, 23, 59, 59));
        } else if (item.groupType === 'month' && item.groupYear !== undefined && item.groupMonth !== undefined) {
            setActiveFilter('day');
            setSelectedHourData(null);
            setStartDate(new Date(item.groupYear, item.groupMonth, 1));
            setEndDate(new Date(item.groupYear, item.groupMonth + 1, 0, 23, 59, 59));
        } else if (item.groupType === 'hour' && item.groupDate !== undefined && item.groupHour !== undefined) {
            setSelectedHourData({ date: item.groupDate, hour: item.groupHour });
        }
    };

    const handlePointClick = (index: number, chartDataSlice: any[]) => {
        const item = chartDataSlice[index];
        if (item && item.isGroup && item.groupType === 'hour') {
            setSelectedHourData({ date: item.groupDate, hour: item.groupHour });
        }
    };

    const handleExport = async () => {
        try {
            const limit = 100;
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
            Alert.alert(t("common.error", "Lỗi"), "Không thể xuất dữ liệu lúc này. Xin vui lòng thử lại sau.");
        }
    };

    const resetDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedHourData(null);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(null);
        if (selectedDate && event.type !== "dismissed") {
            setSelectedHourData(null);
            if (showDatePicker === "start") setStartDate(selectedDate);
            if (showDatePicker === "end") setEndDate(selectedDate);
        }
    };

    if (isLoading && !refreshing) return <HistorySkeleton />;

    const currentUi = PARAM_UI_CONFIG[selectedParam] || PARAM_UI_CONFIG.ph;

    // Get the latest non-empty value for the summary card
    const latestValidItem = [...displayList].sort((a, b) => b.timestampValue - a.timestampValue).find(item => item.rawWqi !== null);
    const dynamicTodayValue = latestValidItem ? `${latestValidItem.wqi} ${currentUi.unit}` : `- ${currentUi.unit}`;
    const trendValue = latestValidItem ? latestValidItem.trend : "+0";

    const dynamicHistoryList = displayList.map(item => ({
        ...item,
        wqi: `${item.wqi} ${currentUi.unit}`
    }));

    // Build chronological chart data (sorted asc)
    const chartDataSlice = activeFilter === 'day' && !selectedHourData ? displayList.slice(0, 24) : displayList.slice(0, 40);
    const chronologicalChartData = [...chartDataSlice].sort((a, b) => a.timestampValue - b.timestampValue);

    // For day view: always build a full 24-slot axis with null for missing hours
    // For other views: use actual data points
    let filteredChartValues: (number | null)[];
    let filteredChartLabels: string[];

    if (activeFilter === 'day' && !selectedHourData) {
        // Build 24-slot array; index = hour
        const valueByHour: (number | null)[] = Array(24).fill(null);
        chronologicalChartData.forEach(item => {
            if (item.groupType === 'hour' && !item.isFuture && item.rawWqi !== null) {
                valueByHour[item.groupHour] = item.rawWqi as number;
            }
        });
        filteredChartValues = valueByHour;
        filteredChartLabels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
    } else if (activeFilter === 'day' && selectedHourData) {
        // 5-min drill: 12 slots (00 to 55), null for missing
        const valueByBucket: (number | null)[] = Array(12).fill(null);
        chronologicalChartData.forEach(item => {
            if (item.groupType === 'minute' && !item.isFuture && item.rawWqi !== null) {
                const min = parseInt(item.time.split(':')[1] || '0', 10);
                const bucket = Math.floor(min / 5);
                if (bucket >= 0 && bucket < 12) valueByBucket[bucket] = item.rawWqi as number;
            }
        });
        filteredChartValues = valueByBucket;
        filteredChartLabels = Array.from({ length: 12 }, (_, b) =>
            `${String(selectedHourData.hour).padStart(2, '0')}:${String(b * 5).padStart(2, '0')}`
        );
    } else {
        // Month / Year view: actual data points only (no null-padding needed)
        filteredChartValues = chronologicalChartData.map(item => item.rawWqi as number | null);
        filteredChartLabels = chronologicalChartData.map((item, idx, arr) => {
            if (idx === 0 || idx === arr.length - 1 || (arr.length > 10 && idx === Math.floor(arr.length / 2))) {
                const parts = item.date.split("/");
                return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : item.date.substring(0, 5);
            }
            return "";
        });
    }

    const onFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setSelectedHourData(null);
        if (filter === 'month' || filter === 'year') {
            resetDateFilter();
        }
    };

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
                    avgDesc={activeFilter === 'day' && !selectedHourData ? `${currentUi.name} tại giờ gần nhất` : `${currentUi.name} gần nhất`}
                    trendDesc={`Biến động ${currentUi.name}`}
                />

                {selectedHourData && (
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8 }} 
                        onPress={() => setSelectedHourData(null)}
                    >
                        <Feather name="arrow-left" size={16} color="#00A89D" />
                        <Text style={{ marginLeft: 6, color: "#00A89D", fontFamily: "Inter-Medium", fontSize: 14 }}>Trở về biểu đồ 24 giờ</Text>
                    </TouchableOpacity>
                )}

                {selectedParam === "overview" ? (
                    chronologicalChartData.length > 0 && <OverviewChart data={chronologicalChartData} labels={filteredChartLabels} />
                ) : (
                    filteredChartValues.filter(v => v !== null).length > 0 && (
                        <DetailedChart 
                            data={filteredChartValues} 
                            labels={filteredChartLabels} 
                            paramName={currentUi.name}
                            onPointClick={activeFilter === 'day' && !selectedHourData ? (index) => {
                                // index = giờ (0-23) trong mảng 24 slot
                                if (filteredChartValues[index] !== null) {
                                    const targetDate = startDate || new Date();
                                    const dateString = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
                                    setSelectedHourData({ date: dateString, hour: index });
                                }
                            } : undefined}
                        />
                    )
                )}
                
                <FilterAndExport activeFilter={activeFilter} onFilterChange={onFilterChange} onExport={handleExport} />
                
                <View style={styles.toolsContainer}>
                    {activeFilter === "day" && (
                        <View style={styles.dateFilterContainer}>
                            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker("start")}>
                                <Feather name="calendar" size={14} color="#64748B" />
                                <Text style={styles.dateBtnText}>
                                    {startDate ? startDate.toLocaleDateString("vi-VN") : "Hôm nay"}
                                </Text>
                            </TouchableOpacity>

                            {(startDate || selectedHourData) && (
                                <TouchableOpacity style={styles.resetBtn} onPress={resetDateFilter}>
                                    <Feather name="x-circle" size={18} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity style={styles.sortBtnActive} onPress={handleSortDate}>
                        <Text style={styles.sortBtnTextActive}>Sắp xếp</Text>
                        <Feather name={sortOrder === "asc" ? "chevron-up" : "chevron-down"} size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>


                {showDatePicker === "start" && Platform.OS === 'web' && (
                    <WebDatePicker value={startDate || new Date()} onChange={(d) => { setStartDate(d); setShowDatePicker(null); }} />
                )}

                {showDatePicker === "start" && Platform.OS !== 'web' && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {dynamicHistoryList.length > 0 ? (
                    <HistoryList data={dynamicHistoryList} onItemPress={handleDrillDown} />
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
    toolsContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 12, gap: 8 },
    dateFilterContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
    dateBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "#F8FAFC", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
        borderWidth: 1, borderColor: "#E2E8F0"
    },
    dateBtnText: { fontSize: 13, color: "#475569", fontFamily: "Inter-Regular" },
    resetBtn: { padding: 4 },
    sortBtnActive: {
        flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 7,
        borderRadius: 8, backgroundColor: "#00A89D"
    },
    sortBtnTextActive: { fontSize: 13, color: "#FFFFFF", fontFamily: "Inter-Medium" },
    emptyContainer: { alignItems: "center", paddingVertical: 40 },
    emptyText: { fontSize: 14, color: "#94A3B8", fontFamily: "Inter-Regular" },
});
