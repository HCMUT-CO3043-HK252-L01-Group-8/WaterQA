import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import AppHeader from "@/components/AppHeader";
import { Feather } from "@expo/vector-icons";

export default function HomeDashboard() {
    const tabBarHeight = useTabBarHeight();

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight }}
            >
                {/* 1. Header & Lời chào */}
                <View style={styles.header}>
                    <AppHeader />

                    <View style={styles.greetingSection}>
                        <Text style={styles.greetingTitle}>
                            Xin chào, <Text style={styles.userName}>Đậu Minh Khôi</Text>
                        </Text>
                        <Text style={styles.greetingSubtitle}>Hãy kiểm tra chất lượng nước của bạn</Text>
                    </View>
                </View>

                {/* 2. Cảnh báo bất thường */}
                <View style={styles.alertCard}>
                    <View style={styles.alertTitleRow}>
                        <Feather name="alert-triangle" size={14} color="#FF6467" />
                        <Text style={styles.alertTitle}> Đã phát hiện bất thường với cảm biến pH</Text>
                    </View>
                    <Text style={styles.alertDescription}>
                        Đã phát hiện hoạt động bất thường của cảm biến pH vào 06-03-2026 20:36 UTC+7.
                        Kiểm tra cảm biến hoặc liên hệ với chúng tôi.
                    </Text>
                    <View style={styles.alertActions}>
                        <TouchableOpacity style={styles.detailButton}>
                            <Text style={styles.detailButtonText}>Chi tiết</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.readButtonText}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. Chọn vị trí */}
                <View style={styles.locationSection}>
                    <Text style={styles.sectionTitle}>Vị trí</Text>
                    <TouchableOpacity style={styles.pickerBox}>
                        <Text style={styles.pickerText}>Select Location</Text>
                        <Feather name="chevron-down" size={16} color="#666666" />
                    </TouchableOpacity>
                </View>

                {/* 4. Thẻ Chỉ số WQI chính */}
                <View style={styles.wqiCard}>
                    <Text style={styles.wqiTitle}>An toàn</Text>
                    <Text style={styles.wqiSubtitle}>Chỉ số chất lượng nước (WQI)</Text>

                    <View style={styles.wqiScoreBadge}>
                        <Text style={styles.wqiScoreText}>96</Text>
                    </View>

                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>7.0</Text>
                            <Text style={styles.metricLabel}>pH</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>67</Text>
                            <Text style={styles.metricLabel}>Hardness (mg/l)</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>0.5</Text>
                            <Text style={styles.metricLabel}>Clo (mg/l)</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>1</Text>
                            <Text style={styles.metricLabel}>NTU</Text>
                        </View>
                    </View>

                    <Text style={styles.updateTime}>Cập nhật lần cuối: 06-03-2026 20:36 UTC+7</Text>
                </View>

                {/* 5. Thẻ Trạng thái phụ */}
                <View style={styles.statusRow}>
                    <View style={styles.statusCard}>
                        <Text style={styles.statusCardLabel}>so với 05-03-2026</Text>
                        <Text style={styles.statusCardValuePositive}>+2</Text>
                        <Text style={styles.statusCardDesc}>Chỉ số WQI</Text>
                    </View>

                    <View style={styles.statusCard}>
                        <Text style={styles.statusCardLabel}>Trạng thái cảm biến</Text>
                        <Text style={styles.statusCardValueNegative}>3/4</Text>
                        <Text style={styles.statusCardDesc}>Vui lòng kiểm tra cảm biến pH</Text>
                    </View>
                </View>

                {/* 6. Biểu đồ Thống kê */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Thống kê chất lượng nước</Text>
                        <View style={styles.filterTabs}>
                            <TouchableOpacity style={styles.activeTab}>
                                <Text style={styles.activeTabText}>Theo tuần</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inactiveTab}>
                                <Text style={styles.inactiveTabText}>Theo tháng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.chartPlaceholder}>
                        <View style={styles.mockLine} />
                        <View style={styles.chartXAxis}>
                            <Text style={styles.axisText}>2</Text>
                            <Text style={styles.axisText}>3</Text>
                            <Text style={styles.axisText}>4</Text>
                            <Text style={styles.axisText}>5</Text>
                            <Text style={[styles.axisText, styles.axisTextHighlight]}>6</Text>
                            <Text style={styles.axisText}>7</Text>
                            <Text style={styles.axisText}>CN</Text>
                        </View>
                    </View>
                    <Text style={styles.chartFooter}>Biểu đồ dự đoán WQI</Text>
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
    greetingSection: {
        marginTop: 10,
    },
    greetingTitle: {
        fontSize: 20,
        color: "#0F172B",
        marginBottom: 4,
        fontFamily: "Inter-Regular", // "Xin chào" dùng font thường
    },
    userName: {
        fontFamily: "Inter-Bold", // "Đậu Minh Khôi" dùng font đậm
    },
    greetingSubtitle: {
        fontSize: 13,
        color: "#45556C",
        fontFamily: "Inter-Regular",
    },
    alertCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#FFF7ED",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#FF6467",
    },
    alertTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    alertTitle: {
        fontSize: 13,
        color: "#9F0712",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    alertDescription: {
        fontSize: 11,
        color: "#C10007",
        lineHeight: 18,
        marginBottom: 12,
        fontFamily: "Inter-Regular", // Thêm font
    },
    alertActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailButton: {
        backgroundColor: "#FFE2E2",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 16,
    },
    detailButtonText: {
        color: "#9F0712",
        fontSize: 11,
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    readButtonText: {
        color: "#C10007",
        fontSize: 11,
        textDecorationLine: "underline",
        fontFamily: "Inter-Regular", // Thêm font
    },
    locationSection: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        color: "#0F172B",
        marginRight: 16,
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    pickerBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pickerText: {
        fontSize: 14,
        color: "#333333",
        fontFamily: "Inter-Regular", // Thêm font
    },
    wqiCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#E8FEED",
        borderWidth: 1,
        borderColor: "#00C950",
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
    },
    wqiTitle: {
        fontSize: 36,
        color: "#0F172B",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    wqiSubtitle: {
        fontSize: 15,
        color: "#45556C",
        marginTop: 4,
        marginBottom: 12,
        fontFamily: "Inter-Regular", // Thêm font
    },
    wqiScoreBadge: {
        backgroundColor: "rgba(0, 201, 80, 0.2)",
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 20,
    },
    wqiScoreText: {
        fontSize: 16,
        color: "#159600",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    metricItem: {
        alignItems: "center",
    },
    metricValue: {
        fontSize: 18,
        color: "#314158",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    metricLabel: {
        fontSize: 12,
        color: "#62748E",
        marginTop: 4,
        fontFamily: "Inter-Regular", // Thêm font
    },
    updateTime: {
        fontSize: 11,
        color: "#45556C",
        fontFamily: "Inter-Regular", // Thêm font
    },
    statusRow: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 20,
        gap: 14,
    },
    statusCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#FFFFFF",
    },
    statusCardLabel: {
        fontSize: 11,
        color: "#45556C",
        marginBottom: 8,
        fontFamily: "Inter-Regular", // Thêm font
    },
    statusCardValuePositive: {
        fontSize: 16,
        color: "#00A63E",
        marginBottom: 4,
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    statusCardValueNegative: {
        fontSize: 16,
        color: "#E7000B",
        marginBottom: 4,
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    statusCardDesc: {
        fontSize: 10,
        color: "#62748E",
        fontFamily: "Inter-Regular", // Thêm font
    },
    chartCard: {
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 13,
        color: "#1D293D",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    filterTabs: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
        padding: 4,
    },
    activeTab: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    activeTabText: {
        fontSize: 11,
        color: "#0092B8",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    inactiveTab: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    inactiveTabText: {
        fontSize: 11,
        color: "#45556C",
        fontFamily: "Inter-Regular", // Thêm font
    },
    chartPlaceholder: {
        height: 100,
        justifyContent: "flex-end",
    },
    mockLine: {
        position: "absolute",
        top: 30,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#0891B2",
    },
    chartXAxis: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
    },
    axisText: {
        fontSize: 12,
        color: "#64748B",
        fontFamily: "Inter-Regular", // Thêm font
    },
    axisTextHighlight: {
        color: "#0891B2",
        fontFamily: "Inter-SemiBold", // Thêm font
    },
    chartFooter: {
        fontSize: 10,
        color: "#62748E",
        textAlign: "center",
        marginTop: 12,
        fontFamily: "Inter-Regular", // Thêm font
    },
});