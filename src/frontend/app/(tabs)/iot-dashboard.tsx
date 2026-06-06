import { useEffect, useCallback, useRef, useState } from "react";
import { Alert, ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { Feather } from "@expo/vector-icons";
import AppHeader from "@/components/ui/AppHeader";
import AlertBanner from "@/components/ui/AlertBanner";
import GaugeChart from "@/components/ui/GaugeChart";
import { telemetryServices } from "@/services/telemetryServices";
import { THRESHOLDS, REFRESH_INTERVALS } from "@/configs/feeds";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REFRESH_INTERVAL_MS = REFRESH_INTERVALS.DASHBOARD_REFRESH_MS;
const TEMP_WARNING_THRESHOLD = THRESHOLDS.TEMP_WARNING;
const HUMI_WARNING_THRESHOLD = THRESHOLDS.HUMIDITY_WARNING;
const LIGHT_WARNING = THRESHOLDS.LIGHT_WARNING;
const LIGHT_NORMAL = THRESHOLDS.LIGHT_NORMAL;
const LIGHT_CHECK_DURATION = THRESHOLDS.LIGHT_CHECK_DURATION_MS;
const ALERT_THROTTLE_MS = REFRESH_INTERVALS.ALERT_THROTTLE_MS;
const ALERTS_STORAGE_KEY = "local_alerts_database";

type SensorData = {
    temp: string | number | null;
    humi: string | number | null;
    light: string | number | null;
};

type LightHistory = {
    timestamp: number;
    value: number;
};

export default function IotDashboard() {
    const { t } = useTranslation();
    const tabBarHeight = useTabBarHeight();
    const [data, setData] = useState<SensorData>({ temp: null, humi: null, light: null });
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showTempBanner, setShowTempBanner] = useState(false);
    const [showLightBanner, setShowLightBanner] = useState(false);
    const requestSeq = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const lastTempAlertAt = useRef<number>(0);
    const lastLightAlertAt = useRef<number>(0);
    const lightHistoryRef = useRef<LightHistory[]>([]);

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

                const newLightValue = snap.leakage.value ? Number(snap.leakage.value) : null;

                setData({
                    temp: snap.temp.value,
                    humi: snap.humi.value,
                    light: newLightValue,
                });

                if (newLightValue !== null) {
                    const now = Date.now();
                    lightHistoryRef.current.push({ timestamp: now, value: newLightValue });
                    lightHistoryRef.current = lightHistoryRef.current.filter(
                        (entry) => now - entry.timestamp < LIGHT_CHECK_DURATION,
                    );
                }
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

    const isTempHigh = data.temp !== null && Number(data.temp) > TEMP_WARNING_THRESHOLD;
    const isHumiHigh = data.humi !== null && Number(data.humi) > HUMI_WARNING_THRESHOLD;
    const lightValue = data.light !== null ? Number(data.light) : null;
    const isLightHigh = lightValue !== null && lightValue >= LIGHT_WARNING;
    const isLightNormal = lightValue !== null && lightValue < LIGHT_NORMAL;

    const isLidOpened = useCallback(() => {
        if (lightHistoryRef.current.length === 0) return false;
        const now = Date.now();
        const recentReadings = lightHistoryRef.current.filter((entry) => now - entry.timestamp < LIGHT_CHECK_DURATION);

        if (recentReadings.length === 0) return false;
        const allReadingsHigh = recentReadings.every((entry) => entry.value >= LIGHT_WARNING);
        const oldestReading = Math.min(...recentReadings.map((r) => r.timestamp));
        const readingDuration = now - oldestReading;

        return allReadingsHigh && readingDuration >= LIGHT_CHECK_DURATION;
    }, []);

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
        if (isTempHigh) setShowTempBanner(true);
        if (isLidOpened()) setShowLightBanner(true);

        if (isTempHigh && now - lastTempAlertAt.current > ALERT_THROTTLE_MS) {
            lastTempAlertAt.current = now;
            const title = t("iot.tempWarningTitle", "Cảnh báo: Nhiệt độ cao");
            const desc = `${t("iot.temperature", "Nhiệt độ")} ${String(data.temp)}°C.`;
            Alert.alert(title, desc);
            saveAlertToLocal("warning", title, desc);
        }

        if (isLidOpened() && now - lastLightAlertAt.current > ALERT_THROTTLE_MS) {
            lastLightAlertAt.current = now;
            const title = t("iot.lidDangerTitle", "Nguy hiểm: Mở nắp bồn!");
            const desc = `${t("iot.lightLevel", "Ánh sáng")} ${lightValue}.`;
            Alert.alert(title, desc);
            saveAlertToLocal("critical", title, desc);
        }
    }, [data.temp, isTempHigh, lightValue, isLidOpened, t]);

    const isEmpty = data.temp === null && data.humi === null && data.light === null;

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
                        {t("iot.subtitle", "Dữ liệu quan trắc theo thời gian thực")}
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
                    <View>
                        <AlertBanner
                            visible={showTempBanner}
                            type="warning"
                            title={t("iot.tempWarningTitle", "Cảnh báo: Nhiệt độ cao")}
                            message={t(
                                "iot.tempWarningDesc",
                                "Nhiệt độ hiện tại cao hơn mức bình thường ({{temp}}°C).",
                            ).replace("{{temp}}", String(data.temp))}
                            onClose={() => setShowTempBanner(false)}
                        />

                        <AlertBanner
                            visible={showLightBanner}
                            type="error"
                            title={t("iot.lidDangerTitle", "Nguy hiểm: Mở nắp bồn!")}
                            message={t(
                                "iot.lidDangerDesc",
                                "Phát hiện mức ánh sáng cao ({{light}}). Vui lòng kiểm tra ngay!",
                            ).replace("{{light}}", String(lightValue))}
                            onClose={() => setShowLightBanner(false)}
                        />

                        <View style={styles.gaugeGrid}>
                            <View style={styles.gaugeColumnLeft}>
                                <GaugeChart
                                    title={t("iot.temperature", "Nhiệt độ")}
                                    value={data.temp !== null ? Number(data.temp) : 0}
                                    min={0}
                                    max={100}
                                    unit="°C"
                                    activeColor={isTempHigh ? "#991B1B" : "#0891B2"}
                                />
                                <Text style={styles.gridStatusText}>
                                    {isTempHigh ? t("iot.aboveNormal", "Cao") : t("iot.normal", "Bình thường")}
                                </Text>
                            </View>
                            <View style={styles.gaugeColumnRight}>
                                <GaugeChart
                                    title={t("iot.humidity", "Độ ẩm")}
                                    value={data.humi !== null ? Number(data.humi) : 0}
                                    min={0}
                                    max={100}
                                    unit="%"
                                    activeColor={isHumiHigh ? "#991B1B" : "#00A63E"}
                                />
                                <Text style={styles.gridStatusText}>
                                    {isHumiHigh ? t("iot.high", "Cao") : t("iot.normal", "Bình thường")}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.lightSectionContainer}>
                            <GaugeChart
                                title={t("iot.lightLevel", "Ánh sáng")} 
                                value={lightValue !== null ? lightValue : 0}
                                min={0}
                                max={100}
                                unit="Lux"
                                activeColor={isLidOpened() ? "#991B1B" : isLightHigh ? "#EAB308" : "#0891B2"}
                            />
                            <Text style={styles.lightStatusText}>
                                {isLidOpened()
                                    ? t("iot.lidOpenedAlert", "Mở nắp! (≥60 trong 5s)")
                                    : isLightHigh
                                      ? t("iot.highLight", "Cao ({{light}} ≥ {{threshold}})")
                                            .replace("{{light}}", String(lightValue))
                                            .replace("{{threshold}}", String(LIGHT_WARNING))
                                      : isLightNormal
                                        ? t("iot.normalLight", "Bình thường (< 50)")
                                        : t("iot.lowLight", "Ánh sáng yếu")}
                            </Text>
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

    gaugeGrid: { flexDirection: "row", paddingHorizontal: 16, width: "100%", marginTop: 8 },
    gaugeColumnLeft: { flex: 1, marginRight: 8, alignItems: "center" },
    gaugeColumnRight: { flex: 1, marginLeft: 8, alignItems: "center" },
    
    gridStatusText: {
        fontSize: 12,
        color: "#64748B",
        fontFamily: "Inter-Medium",
        marginTop: 10,
        textAlign: "center"
    },

    lightSectionContainer: { 
        paddingHorizontal: 16, 
        marginTop: 20, 
        alignItems: "center" 
    },
    lightStatusText: { 
        fontSize: 12, 
        color: "#64748B", 
        fontFamily: "Inter-Medium",
        textAlign: "center", 
        marginTop: 10,
        marginBottom: 10,
    },

    cardWarning: { borderColor: "#FDBA74", backgroundColor: "#FFF7ED" },
    cardDanger: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
});
