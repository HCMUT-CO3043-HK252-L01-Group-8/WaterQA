import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { deviceServices } from "@/services/deviceServices";
import { thresholdServices } from "@/services/thresholdServices";

export default function ManageIotScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const tabBarHeight = useTabBarHeight();
    const [activeTab, setActiveTab] = useState("devices");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [devices, setDevices] = useState<any[]>([]);
    const [thresholds, setThresholds] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            if (activeTab === "devices") {
                const res = await deviceServices.getAllDevices();
                if (res.success && res.payload) setDevices(res.payload);
            } else {
                const res = await thresholdServices.getAllThresholds();
                if (res.success && res.payload) setThresholds(res.payload);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu IoT:", error);
            Alert.alert(t("common.error", "Lỗi"), "Không thể tải dữ liệu từ máy chủ.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleDelete = (id: number, type: string) => {
        Alert.alert(t("common.cancel", "Cảnh báo"), `Bạn muốn xóa ${type} #${id}?`, [
            { text: t("common.cancel", "Hủy"), style: "cancel" },
            { text: t("common.delete", "Xóa"), style: "destructive", onPress: () => console.log("Deleted", id) },
        ]);
    };

    const TABS = [
        { label: t("iotManagement.tabDevices", "Thiết bị"), value: "devices" },
        { label: t("iotManagement.tabThresholds", "Ngưỡng cảnh báo"), value: "thresholds" },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <View style={styles.backIconCircle}>
                        <Ionicons name="chevron-back" size={20} color="#333" />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleWrapper}>
                    <Text style={styles.pageTitle}>{t("iotManagement.title", "Hệ thống IoT")}</Text>
                    <Text style={styles.pageSubtitle}>{t("iotManagement.subtitle", "Quản lý thiết bị & ngưỡng")}</Text>
                </View>
                <TouchableOpacity style={styles.addBtn}>
                    <Feather name="plus" size={20} color="#0891B2" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <CustomFilterTab options={TABS} activeOption={activeTab} onOptionChange={setActiveTab} />
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#0891B2" />
                </View>
            ) : (
                <ScrollView
                    style={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0891B2"]} />
                    }
                >
                    {activeTab === "devices" ? (
                        devices.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Feather name="cpu" size={32} color="#CBD5E1" style={{ marginBottom: 12 }} />
                                <Text style={styles.emptyText}>
                                    {t("iotManagement.emptyDevices", "Chưa có thiết bị nào.")}
                                </Text>
                            </View>
                        ) : (
                            devices.map((device) => (
                                <View key={device.id} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{device.sensor_name}</Text>
                                        <View
                                            style={[
                                                styles.badge,
                                                device.status === "active" ? styles.badgeActive : styles.badgeInactive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.badgeText,
                                                    device.status === "active"
                                                        ? styles.textActive
                                                        : styles.textInactive,
                                                ]}
                                            >
                                                {device.status}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <Text style={styles.infoText}>
                                            {t("iotManagement.deviceType", "Loại:")}{" "}
                                            <Text style={styles.infoBold}>{device.sensor_type}</Text>
                                        </Text>
                                        <Text style={styles.infoText}>
                                            {t("iotManagement.station", "Trạm:")}{" "}
                                            <Text style={styles.infoBold}>#{device.station_id}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.cardFooter}>
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <Feather name="edit" size={16} color="#64748B" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionBtn}
                                            onPress={() => handleDelete(device.id, "Thiết bị")}
                                        >
                                            <Feather name="trash-2" size={16} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )
                    ) : thresholds.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Feather name="sliders" size={32} color="#CBD5E1" style={{ marginBottom: 12 }} />
                            <Text style={styles.emptyText}>
                                {t("iotManagement.emptyThresholds", "Chưa có ngưỡng nào.")}
                            </Text>
                        </View>
                    ) : (
                        thresholds.map((thr) => (
                            <View key={thr.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>
                                        {String(t(`sensorNames.${thr.parameter}`, thr.parameter.toUpperCase()))}
                                    </Text>
                                    <View
                                        style={[
                                            styles.badge,
                                            thr.severity === "high" ? styles.badgeDanger : styles.badgeWarning,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.badgeText,
                                                thr.severity === "high" ? styles.textDanger : styles.textWarning,
                                            ]}
                                        >
                                            {thr.severity.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.cardBody}>
                                    <Text style={styles.infoText}>
                                        {t("iotManagement.range", "Khoảng an toàn:")}{" "}
                                        <Text style={styles.infoBold}>
                                            {thr.lower_threshold} - {thr.upper_threshold}
                                        </Text>
                                    </Text>
                                    <Text style={styles.infoText}>
                                        {t("iotManagement.station", "Trạm áp dụng:")}{" "}
                                        <Text style={styles.infoBold}>#{thr.station || "Tất cả"}</Text>
                                    </Text>
                                </View>
                                <View style={styles.cardFooter}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Feather name="edit" size={16} color="#64748B" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => handleDelete(thr.id, "Ngưỡng")}
                                    >
                                        <Feather name="trash-2" size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    backButton: { marginRight: 16 },
    backIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },
    titleWrapper: { flex: 1 },
    pageTitle: { fontSize: 20, color: "#0F172B", fontFamily: "Inter-SemiBold", marginBottom: 2 },
    pageSubtitle: { fontSize: 13, color: "#64748B", fontFamily: "Inter-Regular" },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ECFEFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#A5F3FC",
    },

    tabContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
    listContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

    emptyBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    emptyText: { color: "#94A3B8", fontSize: 14, fontFamily: "Inter-Regular" },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    cardTitle: { fontSize: 16, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    cardBody: { marginBottom: 14, gap: 4 },
    infoText: { fontSize: 13, color: "#64748B", fontFamily: "Inter-Regular" },
    infoBold: { color: "#0F172B", fontFamily: "Inter-Medium" },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        paddingTop: 12,
    },
    actionBtn: { padding: 4 },

    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontFamily: "Inter-SemiBold" },

    badgeActive: { backgroundColor: "#F0FDF4" },
    textActive: { color: "#16A34A" },
    badgeInactive: { backgroundColor: "#F1F5F9" },
    textInactive: { color: "#64748B" },
    badgeWarning: { backgroundColor: "#FEFCE8" },
    textWarning: { color: "#CA8A04" },
    badgeDanger: { backgroundColor: "#FEF2F2" },
    textDanger: { color: "#DC2626" },
});
