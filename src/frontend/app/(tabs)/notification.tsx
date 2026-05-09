import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import AppHeader from "@/components/AppHeader";

export default function NotificationScreen() {
    const [systemNotif, setSystemNotif] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [qualityAlert, setQualityAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const tabBarHeight = useTabBarHeight();

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight }}
            >
                {/* 1. Header */}
                <View style={styles.header}>
                    <AppHeader />

                    <View style={styles.pageTitleSection}>
                        <Text style={styles.pageTitle}>Cảnh báo</Text>
                        <Text style={styles.unreadBadge}>● Có 2 cảnh báo chưa đọc</Text>
                    </View>
                </View>

                {/* 2. Cài đặt cảnh báo */}
                <View style={styles.settingsCard}>
                    <Text style={styles.settingsTitle}>Cài đặt cảnh báo</Text>

                    <View style={styles.settingRow}>
                        <View>
                            <Text style={styles.settingName}>Thông báo hệ thống</Text>
                            <Text style={styles.settingDesc}>Cho phép ứng dụng gửi thông báo</Text>
                        </View>
                        <Switch
                            value={systemNotif}
                            onValueChange={setSystemNotif}
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View>
                            <Text style={styles.settingName}>Cảnh báo cảm biến</Text>
                            <Text style={styles.settingDesc}>Nhận cảnh báo khi cảm biến gặp sự cố</Text>
                        </View>
                        <Switch
                            value={sensorAlert}
                            onValueChange={setSensorAlert}
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View>
                            <Text style={styles.settingName}>Cảnh báo chất lượng nước</Text>
                            <Text style={styles.settingDesc}>Nhận thông báo khi có dữ liệu mới từ cảm biến</Text>
                        </View>
                        <Switch
                            value={qualityAlert}
                            onValueChange={setQualityAlert}
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={[styles.settingRow, styles.settingRowLast]}>
                        <View>
                            <Text style={styles.settingName}>Báo cáo quan trắc hằng ngày</Text>
                            <Text style={styles.settingDesc}>Nhận thông báo thống kê dữ liệu hằng ngày</Text>
                        </View>
                        <Switch
                            value={dailyReport}
                            onValueChange={setDailyReport}
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* 3. Bộ lọc */}
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Bộ lọc</Text>
                    <View style={styles.filterTabs}>
                        {["All", "Warning", "Critical"].map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
                                onPress={() => setActiveFilter(f)}
                            >
                                <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 4. Danh sách cảnh báo */}
                <View style={styles.alertList}>
                    {/* Critical alert */}
                    <View style={styles.alertCard}>
                        <View style={styles.alertIconBox}>
                            <Text style={styles.alertIcon}>🚨</Text>
                        </View>
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Phát hiện nguy cơ ô nhiễm</Text>
                            <Text style={styles.alertDesc}>Khả năng ô nhiễm nguồn nước tăng</Text>
                            <Text style={styles.alertDesc}>Độ tin cậy: 99%</Text>
                            <Text style={styles.alertTime}>⏱ 2 giờ trước bởi 268 Lý Thường Kiệt</Text>
                            <View style={styles.alertActions}>
                                <TouchableOpacity style={styles.detailBtn}>
                                    <Text style={styles.detailBtnText}>Chi tiết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.markReadText}>Đánh dấu đã đọc</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Warning alert */}
                    <View style={styles.alertCard}>
                        <View style={[styles.alertIconBox, styles.alertIconWarning]}>
                            <Text style={styles.alertIcon}>⚠️</Text>
                        </View>
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Độ đục tăng cao</Text>
                            <Text style={styles.alertDesc}>Chỉ số NTU vượt ngưỡng cho phép</Text>
                            <Text style={styles.alertDesc}>Độ tin cậy: 87%</Text>
                            <Text style={styles.alertTime}>⏱ 5 giờ trước bởi 268 Lý Thường Kiệt</Text>
                            <View style={styles.alertActions}>
                                <TouchableOpacity style={styles.detailBtn}>
                                    <Text style={styles.detailBtnText}>Chi tiết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.markReadText}>Đánh dấu đã đọc</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        padding: 16,
    },
    appTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    logoPlaceholder: {
        width: 35,
        height: 35,
        backgroundColor: "#00B8DB",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    logoText: { fontSize: 16 },
    appName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172B",
    },
    appSubtitle: {
        fontSize: 10,
        color: "#62748E",
    },
    pageTitleSection: { marginTop: 10 },
    pageTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0F172B",
        marginBottom: 6,
    },
    unreadBadge: {
        fontSize: 13,
        color: "#E7000B",
        fontWeight: "500",
    },
    settingsCard: {
        marginHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 20,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    settingsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#0F172B",
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    settingRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
        marginBottom: 0,
    },
    settingName: {
        fontSize: 13,
        color: "#0F172B",
        marginBottom: 2,
        maxWidth: 220,
    },
    settingDesc: {
        fontSize: 11,
        color: "#62748E",
        maxWidth: 220,
    },
    filterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#0F172B",
    },
    filterTabs: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 10,
        padding: 4,
    },
    filterTab: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    filterTabActive: {
        backgroundColor: "#FFFFFF",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    filterTabText: {
        fontSize: 12,
        color: "#45556C",
    },
    filterTabTextActive: {
        color: "#0092B8",
        fontWeight: "600",
    },
    alertList: {
        marginHorizontal: 16,
        gap: 12,
    },
    alertCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
    },
    alertIconBox: {
        width: 44,
        height: 44,
        backgroundColor: "#FFF0F0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    alertIconWarning: {
        backgroundColor: "#FFFBEB",
    },
    alertIcon: { fontSize: 20 },
    alertContent: { flex: 1 },
    alertTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#0F172B",
        marginBottom: 4,
    },
    alertDesc: {
        fontSize: 12,
        color: "#45556C",
        marginBottom: 2,
    },
    alertTime: {
        fontSize: 11,
        color: "#90A1B9",
        marginTop: 4,
        marginBottom: 10,
    },
    alertActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    detailBtn: {
        backgroundColor: "#FFE2E2",
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    detailBtnText: {
        fontSize: 12,
        color: "#9F0712",
        fontWeight: "500",
    },
    markReadText: {
        fontSize: 12,
        color: "#C10007",
        textDecorationLine: "underline",
    },
});
