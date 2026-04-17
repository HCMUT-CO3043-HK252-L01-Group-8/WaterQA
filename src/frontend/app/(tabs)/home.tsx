import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeDashboard() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 1. Header & Lời chào */}
            <View style={styles.header}>
                <View style={styles.appTitleRow}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>💧</Text>
                    </View>
                    <View>
                        <Text style={styles.appName}>Theo dõi chất lượng nước thông minh</Text>
                        <Text style={styles.appSubtitle}>Ứng dụng hàng đầu Việt Nam</Text>
                    </View>
                </View>
                
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingTitle}>Xin chào, Đậu Minh Khôi</Text>
                    <Text style={styles.greetingSubtitle}>Hãy kiểm tra chất lượng nước của bạn</Text>
                </View>
            </View>

            {/* 2. Cảnh báo bất thường */}
            <View style={styles.alertCard}>
                <Text style={styles.alertTitle}>⚠️ Đã phát hiện bất thường với cảm biến pH</Text>
                <Text style={styles.alertDescription}>
                    Đã phát hiện hoạt động bất thường của cảm biến pH vào 06-03-2026 20:36 UTC+7. Kiểm tra cảm biến hoặc liên hệ với chúng tôi.
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
                    <Text style={styles.pickerIcon}>▼</Text>
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
                
                {/* Placeholder cho Biểu đồ */}
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

            {/* Tạo khoảng trống ở dưới cùng cho dễ cuộn */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 16,
        paddingTop: 40, // Cách top cho các dòng điện thoại tai thỏ
    },
    appTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoPlaceholder: {
        width: 35,
        height: 35,
        backgroundColor: '#00B8DB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    logoText: {
        fontSize: 16,
    },
    appName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172B',
    },
    appSubtitle: {
        fontSize: 10,
        color: '#62748E',
    },
    greetingSection: {
        marginTop: 10,
    },
    greetingTitle: {
        fontSize: 20,
        color: '#0F172B',
        marginBottom: 4,
    },
    greetingSubtitle: {
        fontSize: 13,
        color: '#45556C',
    },
    alertCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: '#FFF7ED', // Thay thế cho gradient
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6467',
    },
    alertTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#9F0712',
        marginBottom: 6,
    },
    alertDescription: {
        fontSize: 11,
        color: '#C10007',
        lineHeight: 18,
        marginBottom: 12,
    },
    alertActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailButton: {
        backgroundColor: '#FFE2E2',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 16,
    },
    detailButtonText: {
        color: '#9F0712',
        fontSize: 11,
    },
    readButtonText: {
        color: '#C10007',
        fontSize: 11,
        textDecorationLine: 'underline',
    },
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 16,
    },
    pickerBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pickerText: {
        fontSize: 14,
        color: '#333333',
    },
    pickerIcon: {
        fontSize: 12,
        color: '#666666',
    },
    wqiCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: '#E8FEED', // Thay thế cho gradient
        borderWidth: 1,
        borderColor: '#00C950',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
    },
    wqiTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#0F172B',
    },
    wqiSubtitle: {
        fontSize: 15,
        color: '#45556C',
        marginTop: 4,
        marginBottom: 12,
    },
    wqiScoreBadge: {
        backgroundColor: 'rgba(0, 201, 80, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 20,
    },
    wqiScoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#159600',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    metricItem: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#314158',
    },
    metricLabel: {
        fontSize: 12,
        color: '#62748E',
        marginTop: 4,
    },
    updateTime: {
        fontSize: 11,
        color: '#000000',
    },
    statusRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 20,
        gap: 14,
    },
    statusCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#FFFFFF',
    },
    statusCardLabel: {
        fontSize: 11,
        color: '#45556C',
        marginBottom: 8,
    },
    statusCardValuePositive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00A63E',
        marginBottom: 4,
    },
    statusCardValueNegative: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E7000B',
        marginBottom: 4,
    },
    statusCardDesc: {
        fontSize: 10,
        color: '#62748E',
    },
    chartCard: {
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1D293D',
    },
    filterTabs: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 4,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    activeTabText: {
        fontSize: 11,
        color: '#0092B8',
    },
    inactiveTab: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    inactiveTabText: {
        fontSize: 11,
        color: '#45556C',
    },
    chartPlaceholder: {
        height: 100,
        justifyContent: 'flex-end',
    },
    mockLine: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#0891B2',
    },
    chartXAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 8,
    },
    axisText: {
        fontSize: 12,
        color: '#64748B',
    },
    axisTextHighlight: {
        fontWeight: 'bold',
        color: '#0891B2',
    },
    chartFooter: {
        fontSize: 10,
        color: '#62748E',
        textAlign: 'center',
        marginTop: 12,
    },
});