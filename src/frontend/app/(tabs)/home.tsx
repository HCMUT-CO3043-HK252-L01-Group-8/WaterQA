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
import { RefreshControl, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { telemetryServices } from "@/services/telemetryServices";
import { dataServices } from "@/services/dataServices";
import { aiServices } from "@/services/aiServices";
import { useTranslation } from "react-i18next";

const LOCATIONS = ["268 Lý Thường Kiệt", "KTX Khu A - ĐHQG", "Khu Công Nghệ Cao", "Hồ Đá - Làng Đại Học"];

export default function HomeDashboard() {
    const tabBarHeight = useTabBarHeight();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [userName, setUserName] = useState("Người dùng");
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [waterMetrics, setWaterMetrics] = useState({ wqi: 0, pH: 0, hardness: 0, clo: 0, ntu: 0, lastUpdated: "" });
    const [statusData, setStatusData] = useState({ wqiChange: "", sensorStatus: "", sensorIssue: "" });
    const [showAlertBanner, setShowAlertBanner] = useState(false);
    
    // States for sample selection
    const [stationHistory, setStationHistory] = useState<any[]>([]);
    const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
    const [isSampleModalVisible, setSampleModalVisible] = useState(false);
    const [latestSnapshot, setLatestSnapshot] = useState<any>(null);
    
    const { t } = useTranslation();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUserStr = await AsyncStorage.getItem("currentUser");
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser.name) setUserName(storedUser.name);
                }
            } catch (error) {
                console.log("Lỗi load user:", error);
            }
        };
        loadUser();
    }, []);

    const processPrediction = async (snapshot: any) => {
        const tempVal = snapshot ? Number(snapshot.temp?.value) || 0 : 34.3;
        const humiVal = snapshot ? Number(snapshot.humi?.value) || 0 : 60;
        const lightVal = snapshot ? Number(snapshot.leakage?.value) || 0 : 62;
        
        let wqiResult = tempVal; // Mặc định
        let isSafeWater = tempVal >= 80;
        
        let aiParams = {
            ph: snapshot?.ph?.value ? Number(snapshot.ph.value) : 7.2,
            hardness: snapshot?.hardness?.value ? Number(snapshot.hardness.value) : humiVal,
            solids: snapshot?.solids?.value ? Number(snapshot.solids.value) : 20000,
            chloramines: snapshot?.chloramines?.value ? Number(snapshot.chloramines.value) : 0.5,
            sulfate: snapshot?.sulfate?.value ? Number(snapshot.sulfate.value) : 300,
            conductivity: snapshot?.conductivity?.value ? Number(snapshot.conductivity.value) : 400,
            organic_carbon: snapshot?.organic_carbon?.value ? Number(snapshot.organic_carbon.value) : 10,
            trihalomethanes: snapshot?.trihalomethanes?.value ? Number(snapshot.trihalomethanes.value) : 60,
            turbidity: snapshot?.turbidity?.value ? Number(snapshot.turbidity.value) : lightVal
        };

        try {
            const aiRes = await aiServices.predictPotability({
                ph: aiParams.ph,
                Hardness: aiParams.hardness,
                Solids: aiParams.solids,
                Chloramines: aiParams.chloramines,
                Sulfate: aiParams.sulfate,
                Conductivity: aiParams.conductivity,
                Organic_carbon: aiParams.organic_carbon,
                Trihalomethanes: aiParams.trihalomethanes,
                Turbidity: aiParams.turbidity
            });
            
            if (aiRes.success) {
                const prob = aiRes.result.probability;
                wqiResult = Math.round(prob * 100);
                isSafeWater = prob >= 0.5;
            }
        } catch (e) {
            console.log("Lỗi AI predict:", e);
        }

        setWaterMetrics({
            wqi: wqiResult,
            pH: Number(aiParams.ph.toFixed(2)),
            hardness: Number(aiParams.hardness.toFixed(1)),
            clo: Number(aiParams.chloramines.toFixed(2)),
            ntu: Number(aiParams.turbidity.toFixed(2)),
            lastUpdated: snapshot?.fetchedAt ? new Date(snapshot.fetchedAt).toLocaleString("vi-VN") : new Date().toLocaleString("vi-VN"),
        });

        setStatusData({
            wqiChange: isSafeWater ? "+2" : "-15",
            sensorStatus: snapshot?.temp?.value
                ? t("home.sensorGood", "Hoạt động tốt")
                : t("home.sensorDisconnect", "Mất kết nối"),
            sensorIssue: isSafeWater
                ? t("home.sensorStable", "Tất cả cảm biến ổn định")
                : t("home.sensorCheck", "Cảnh báo chất lượng nước từ AI"),
        });

        setShowAlertBanner(!isSafeWater);
    };

    const fetchDashboardData = async () => {
        try {
            const snapshot = await telemetryServices.getLatestTelemetrySnapshot();
            setLatestSnapshot(snapshot);
            
            const stationId = LOCATIONS.indexOf(selectedLocation) + 1;
            const historyRes = await dataServices.getStationHistory(stationId, 8);
            
            if (historyRes.success && historyRes.payload && historyRes.payload.length > 0) {
                setStationHistory(historyRes.payload);
                setSelectedSampleIndex(0);
            } else {
                setStationHistory([]);
            }

            await processPrediction(snapshot);
        } catch (error) {
            console.log("Lỗi fetch data IoT:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
    
    const handleSelectSample = (index: number) => {
        setSelectedSampleIndex(index);
        setSampleModalVisible(false);
        if (latestSnapshot) {
            processPrediction(latestSnapshot);
        }
    };

    if (isLoading && !refreshing) return <HomeSkeleton userName={userName} />;

    return (
        <View style={styles.mainContainer}>
            <CustomToast
                visible={showToast}
                topInset={insets.top}
                message={t("common.success", "Đã cập nhật dữ liệu mới!")}
                type="success"
            />

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
                                {t("home.greeting", "Xin chào, ").replace("{{name}}", "")}
                                <Text style={styles.userName}>{userName}</Text>
                            </Text>
                            <Text style={styles.greetingSubtitle}>
                                {t("home.greetingSubtitle", "Hãy kiểm tra chất lượng nước của bạn")}
                            </Text>
                        </View>
                    </View>

                    <AlertBanner
                        visible={showAlertBanner}
                        type="error"
                        title={t("home.alertDetected", "Đã phát hiện bất thường với chất lượng nước")}
                        message={t(
                            "home.alertDescription",
                            "Dữ liệu quan trắc cho thấy nguồn nước có dấu hiệu bất thường. Vui lòng kiểm tra.",
                        )}
                        dateText={waterMetrics.lastUpdated}
                        onClose={() => setShowAlertBanner(false)}
                        onPressDetail={() => console.log("Xem chi tiết")}
                    />

                    <LocationSelector
                        locations={LOCATIONS}
                        selectedLocation={selectedLocation}
                        onSelect={setSelectedLocation}
                    />

                    <WqiCard 
                        metrics={waterMetrics} 
                        onSelectSamplePress={() => setSampleModalVisible(true)} 
                    />

                    <StatusSummary
                        wqiChange={statusData.wqiChange}
                        sensorStatus={statusData.sensorStatus}
                        sensorIssue={statusData.sensorIssue}
                        isSafe={waterMetrics.wqi >= 80}
                    />

                    <WaterChart />
                </ScrollView>
            </SafeAreaView>
            
            <Modal visible={isSampleModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("home.selectSampleTitle", "Chọn bộ dữ liệu mẫu")}</Text>
                            <TouchableOpacity onPress={() => setSampleModalVisible(false)}>
                                <Text style={styles.closeText}>{t("home.close", "Đóng")}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.sampleList}>
                            {stationHistory.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={[
                                        styles.sampleItem, 
                                        selectedSampleIndex === index && styles.sampleItemSelected
                                    ]}
                                    onPress={() => handleSelectSample(index)}
                                >
                                    <View>
                                        <Text style={styles.sampleName}>{t("home.sampleData", "Mẫu dữ liệu")} {index + 1}</Text>
                                        <Text style={styles.sampleDetail}>pH: {Number(item.ph).toFixed(2)} | {t("home.wqiData", "WQI Data:")} {new Date(item.timestamp).toLocaleString("vi-VN")}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {stationHistory.length === 0 && (
                                <Text style={styles.emptyText}>{t("home.noSampleData", "Chưa có dữ liệu mẫu cho trạm này")}</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "70%" },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    modalTitle: { fontSize: 18, fontFamily: "Inter-Bold", color: "#0F172B" },
    closeText: { fontSize: 16, color: "#00A89D", fontFamily: "Inter-Medium" },
    sampleList: { marginBottom: 20 },
    sampleItem: { padding: 16, borderRadius: 12, backgroundColor: "#F8FAFC", marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" },
    sampleItemSelected: { borderColor: "#00A89D", backgroundColor: "#E6F6F5" },
    sampleName: { fontSize: 16, fontFamily: "Inter-Bold", color: "#0F172B", marginBottom: 4 },
    sampleDetail: { fontSize: 12, fontFamily: "Inter-Regular", color: "#64748B" },
    emptyText: { textAlign: "center", color: "#64748B", marginTop: 20 }
});
