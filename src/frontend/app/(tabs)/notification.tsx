import AlertCard from "@/components/notification/AlertCard";
import NotificationSettings from "@/components/notification/NotificationSettings";
import NotificationSkeleton from "@/components/notification/NotificationSkeleton";
import AppHeader from "@/components/ui/AppHeader";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const MOCK_ALERTS = [
    {
        id: "1",
        type: "critical" as const,
        title: "Phát hiện nguy cơ ô nhiễm",
        desc: "Khả năng ô nhiễm nguồn nước tăng\nĐộ tin cậy: 99%",
        time: "2 giờ trước bởi 268 Lý Thường Kiệt",
    },
    {
        id: "2",
        type: "warning" as const,
        title: "Độ đục tăng cao",
        desc: "Chỉ số NTU vượt ngưỡng cho phép\nĐộ tin cậy: 87%",
        time: "5 giờ trước bởi 268 Lý Thường Kiệt",
    },
];

const DEFAULT_FILTER = "all";

export default function NotificationScreen() {
    const tabBarHeight = useTabBarHeight();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const { t } = useTranslation();

    const FILTER_OPTIONS = [
        { label: t("notifications.filterAll", "Tất cả"), value: "all" },
        { label: t("notifications.filterWarning", "Cảnh báo"), value: "warning" },
        { label: t("notifications.filterCritical", "Nghiêm trọng"), value: "critical" },
    ];

    const fetchNotifications = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
        } catch (error) {
            console.error("Lỗi tải cảnh báo:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
    };

    if (isLoading || refreshing) return <NotificationSkeleton />;

    const filteredAlerts = alerts.filter((alert) => alert.type === activeFilter || activeFilter === DEFAULT_FILTER);

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E7000B"]} />}
            >
                <View style={styles.header}>
                    <AppHeader />
                    <View style={styles.pageTitleSection}>
                        <Text style={styles.pageTitle}>{t("notifications.pageTitle", "Cảnh báo")}</Text>
                        <View style={styles.unreadContainer}>
                            <AntDesign name="bell" size={14} color="#E7000B" />
                            <Text style={styles.unreadBadge}>
                                {t("notifications.unreadCount", { count: filteredAlerts.length }).replace(
                                    "{{count}}",
                                    filteredAlerts.length.toString(),
                                )}
                            </Text>
                        </View>
                    </View>
                </View>

                <NotificationSettings />

                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>{t("notifications.filterTitle", "Bộ lọc")}</Text>
                    <CustomFilterTab
                        options={FILTER_OPTIONS}
                        activeOption={activeFilter}
                        onOptionChange={setActiveFilter}
                    />
                </View>

                <View style={styles.alertList}>
                    {filteredAlerts.length ? (
                        filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                {t("notifications.emptyState", "Trạng thái cảm biến đang ổn định.")}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    pageTitleSection: { marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    unreadContainer: { flexDirection: "row", alignItems: "center" },
    unreadBadge: { fontSize: 13, color: "#E7000B", fontFamily: "Inter-SemiBold", marginLeft: 7 },
    filterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 16,
    },
    filterLabel: { fontSize: 14, color: "#45556C", fontFamily: "Inter-SemiBold" },
    alertList: { marginHorizontal: 16, gap: 12 },
    emptyState: { paddingVertical: 30, alignItems: "center", justifyContent: "center" },
    emptyStateText: { color: "#90A1B9", fontFamily: "Inter-Regular", fontSize: 13 },
});
