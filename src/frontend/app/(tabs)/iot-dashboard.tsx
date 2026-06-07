import { useEffect, useCallback, useRef, useState } from "react";
import { Alert, ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { Feather } from "@expo/vector-icons";
import AppHeader from "@/components/ui/AppHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import { telemetryServices } from "@/services/telemetryServices";
import { THRESHOLDS, REFRESH_INTERVALS } from "@/configs/feeds";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REFRESH_INTERVAL_MS = REFRESH_INTERVALS.DASHBOARD_REFRESH_MS;
const ALERT_THROTTLE_MS = REFRESH_INTERVALS.ALERT_THROTTLE_MS;
const ALERTS_STORAGE_KEY = "local_alerts_database";

type SensorData = {
    ph: string | number | null;
    hardness: string | number | null;
    turbidity: string | number | null;
    solids: string | number | null;
    chloramines: string | number | null;
    sulfate: string | number | null;
    conductivity: string | number | null;
    organic_carbon: string | number | null;
    trihalomethanes: string | number | null;
};

export default function IotDashboard() {
    const { t } = useTranslation();
    const tabBarHeight = useTabBarHeight();
    const [data, setData] = useState<SensorData>({
        ph: null, hardness: null, turbidity: null, solids: null,
        chloramines: null, sulfate: null, conductivity: null, organic_carbon: null, trihalomethanes: null
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showPhBanner, setShowPhBanner] = useState(false);
    const requestSeq = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const lastAlertAt = useRef<number>(0);

    const loadData = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
            setError(null);
            const thisReq = ++requestSeq.current;
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const snap = await telemetryServices.getLatestTelemetrySnapshot(controller.signal);
                if (thisReq !== requestSeq.current) return;

                setData({
                    ph: snap.ph?.value || null,
                    hardness: snap.hardness?.value || null,
                    turbidity: snap.turbidity?.value || null,
                    solids: snap.solids?.value || null,
                    chloramines: snap.chloramines?.value || null,
                    sulfate: snap.sulfate?.value || null,
                    conductivity: snap.conductivity?.value || null,
                    organic_carbon: snap.organic_carbon?.value || null,
                    trihalomethanes: snap.trihalomethanes?.value || null,
                });
            } catch (err) {
                if ((err as any)?.name === "AbortError") return;
                console.log(err);
                setError(t("common.error", "Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra mạng."));
            } finally {
                if (thisReq === requestSeq.current) {
                    setLoading(false);
                    if (isRefresh) setRefreshing(false);
                }
            }
        },
        [t],
    );

    useEffect(() => {
        loadData();
        const intervalId = setInterval(() => {
            loadData();
        }, REFRESH_INTERVAL_MS);

        return () => {
            abortRef.current?.abort();
            clearInterval(intervalId);
        };
    }, [loadData]);

    const onRefresh = () => loadData(true);

    const phValue = data.ph !== null ? Number(data.ph) : null;
    const isPhWarning = phValue !== null && (phValue < THRESHOLDS.PH_WARNING_LOW || phValue > THRESHOLDS.PH_WARNING_HIGH);

    const saveAlertToLocal = async (type: "warning" | "critical", title: string, desc: string) => {
        try {
            const savedAlerts = await AsyncStorage.getItem(ALERTS_STORAGE_KEY);
            const alerts = savedAlerts ? JSON.parse(savedAlerts) : [];
            const newAlert = {
                id: Date.now().toString(),
                type,
                title,
                desc,
                time: "Vừa xong",
            };
            alerts.unshift(newAlert);
            await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
        } catch (e) {
            console.log("Lỗi lưu cảnh báo:", e);
        }
    };

    useEffect(() => {
        const now = Date.now();
        if (isPhWarning) setShowPhBanner(true);

        if (isPhWarning && now - lastAlertAt.current > ALERT_THROTTLE_MS) {
            lastAlertAt.current = now;
            const title = t("iot.phWarningTitle", "Cảnh báo: Độ pH bất thường");
            const desc = `${t("iot.ph", "Độ pH")} hiện tại: ${phValue}.`;
            Alert.alert(title, desc);
            saveAlertToLocal("warning", title, desc);
        }
    }, [isPhWarning, phValue, t]);

    const isEmpty = Object.values(data).every(val => val === null);

    const renderMetricCard = (title: string, value: any, unit: string, color: string, isWarning: boolean = false) => (
        <View style={[styles.metricCard, isWarning && styles.metricCardWarning]}>
            <View style={[styles.metricColorBar, { backgroundColor: isWarning ? "#EF4444" : color }]} />
            <View style={styles.metricContent}>
                <Text style={styles.metricTitle}>{title}</Text>
                <View style={styles.metricValueContainer}>
                    <Text style={[styles.metricValue, isWarning && styles.metricValueWarning]}>
                        {value !== null ? Number(value).toFixed(2) : "--"}
                    </Text>
                    <Text style={styles.metricUnit}>{unit}</Text>
                </View>
            </View>
        </View>
    );

    if (loading && !refreshing) return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.centerBox}>
                <ActivityIndicator size="large" color="#00A89D" />
                <Text style={styles.loadingText}>{t("Đang tải dữ liệu...")}</Text>
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A89D"]} />}
            >
                <View style={styles.header}>
                    <AppHeader />
                    <Text style={styles.pageTitle}>{t("iot.title", "IoT Dashboard")}</Text>
                    <Text style={styles.pageSubtitle}>
                        {t("iot.subtitle", "Dữ liệu hóa học nước theo thời gian thực")}
                    </Text>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Feather name="alert-circle" size={16} color="#991B1B" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : isEmpty ? (
                    <View style={styles.emptyBox}>
                        <Feather name="inbox" size={24} color="#94A3B8" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>{t("iot.noData", "Không có dữ liệu quan trắc.")}</Text>
                    </View>
                ) : (
                    <View style={styles.dashboardContainer}>
                        <AlertBanner
                            visible={showPhBanner}
                            type="warning"
                            title={t("iot.phWarningTitle", "Cảnh báo: Độ pH bất thường")}
                            message={t(
                                "iot.phWarningDesc",
                                "Độ pH hiện tại vượt ngưỡng an toàn ({{ph}}).",
                            ).replace("{{ph}}", String(data.ph))}
                            onClose={() => setShowPhBanner(false)}
                        />

                        <View style={styles.gridContainer}>
                            {renderMetricCard("Độ pH / pH", data.ph, "", "#10B981", isPhWarning)}
                            {renderMetricCard("Độ cứng / Hardness", data.hardness, "mg/L", "#3B82F6", data.hardness !== null && Number(data.hardness) > THRESHOLDS.HARDNESS_WARNING)}
                            {renderMetricCard("Độ đục / Turbidity", data.turbidity, "NTU", "#8B5CF6")}
                            {renderMetricCard("Chất rắn / Solids", data.solids, "mg/L", "#F59E0B")}
                            {renderMetricCard("Cloramin / Chloramines", data.chloramines, "mg/L", "#EF4444")}
                            {renderMetricCard("Sunfat / Sulfate", data.sulfate, "mg/L", "#06B6D4")}
                            {renderMetricCard("Độ dẫn điện / Conductivity", data.conductivity, "μS/cm", "#F97316")}
                            {renderMetricCard("Carbon hữu cơ / Organic Carbon", data.organic_carbon, "mg/L", "#14B8A6")}
                            {renderMetricCard("Trihalomethanes / THMs", data.trihalomethanes, "μg/L", "#EC4899")}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16, marginBottom: 8 },
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold", marginTop: 5, marginBottom: 4 },
    pageSubtitle: { fontSize: 13, color: "#45556C", fontFamily: "Inter-Regular" },
    centerBox: { flex: 1, padding: 40, alignItems: "center", justifyContent: "center" },
    loadingText: { marginTop: 12, color: "#64748B", fontSize: 14, fontFamily: "Inter-Regular" },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEF2F2",
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        gap: 8,
    },
    errorText: { color: "#991B1B", fontSize: 14, fontFamily: "Inter-Medium" },
    emptyBox: {
        padding: 40,
        alignItems: "center",
        marginHorizontal: 16,
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    emptyText: { color: "#94A3B8", fontSize: 14, fontFamily: "Inter-Regular" },

    dashboardContainer: {
        paddingHorizontal: 16,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    metricCard: {
        width: "48%", // Sẽ tạo thành 2 cột
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    metricCardWarning: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FCA5A5",
    },
    metricColorBar: {
        width: 6,
        height: "100%",
    },
    metricContent: {
        flex: 1,
        padding: 12,
    },
    metricTitle: {
        fontSize: 12,
        color: "#64748B",
        fontFamily: "Inter-Medium",
        marginBottom: 6,
    },
    metricValueContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    metricValue: {
        fontSize: 20,
        color: "#0F172B",
        fontFamily: "Inter-Bold",
        marginRight: 4,
    },
    metricValueWarning: {
        color: "#991B1B",
    },
    metricUnit: {
        fontSize: 11,
        color: "#94A3B8",
        fontFamily: "Inter-Regular",
    },
});
