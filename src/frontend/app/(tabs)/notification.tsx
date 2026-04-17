import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

export default function AlertsScreen() {
    // State cho phần cài đặt cảnh báo
    const [sysNotification, setSysNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [waterAlert, setWaterAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);

    // State cho Tab bộ lọc
    const [activeTab, setActiveTab] = useState('All');

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 1. Header */}
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
                
                <View style={styles.pageTitleSection}>
                    <Text style={styles.pageTitle}>Cảnh báo</Text>
                    <View style={styles.unreadBadge}>
                        <View style={styles.dotRed} />
                        <Text style={styles.unreadText}>Có 2 cảnh báo chưa đọc</Text>
                    </View>
                </View>
            </View>

            {/* 2. Cài đặt cảnh báo (Giống SettingsTest của bạn) */}
            <View style={styles.settingsCard}>
                <Text style={styles.settingsTitle}>Cài đặt cảnh báo</Text>
                
                <View style={styles.settingRow}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>Thông báo hệ thống</Text>
                        <Text style={styles.settingDesc}>Cho phép ứng dụng gửi thông báo</Text>
                    </View>
                    <Switch
                        value={sysNotification}
                        onValueChange={setSysNotification}
                        trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>Cảnh báo cảm biến</Text>
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
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>Cảnh báo chất lượng nước</Text>
                        <Text style={styles.settingDesc}>Nhận thông báo khi có dữ liệu mới từ cảm biến</Text>
                    </View>
                    <Switch
                        value={waterAlert}
                        onValueChange={setWaterAlert}
                        trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <View style={[styles.settingRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>Báo cáo quan trắc hằng ngày</Text>
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
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Bộ lọc</Text>
                <View style={styles.filterTabs}>
                    <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'All' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('All')}
                    >
                        <Text style={[styles.tabText, activeTab === 'All' && styles.tabTextActive]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'Warning' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('Warning')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Warning' && styles.tabTextActive]}>Warning</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'Critical' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('Critical')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Critical' && styles.tabTextActive]}>Critical</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 4. Danh sách thông báo */}
            <View style={styles.notificationList}>
                {/* Item 1: Critical (Đỏ) */}
                <View style={styles.notiItem}>
                    <View style={styles.notiHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                            <Text>🚨</Text>
                        </View>
                        <View style={styles.notiContent}>
                            <Text style={styles.notiTitle}>Phát hiện nguy cơ ô nhiễm</Text>
                            <Text style={styles.notiDesc}>Khả năng ô nhiễm nguồn nước tăng{'\n'}Độ tin cậy: 99%</Text>
                            <Text style={styles.notiTime}>🕒 2 giờ trước bởi 268 Lý Thường Kiệt</Text>
                        </View>
                    </View>
                    <View style={styles.notiActions}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFE2E2' }]}>
                            <Text style={[styles.actionBtnText, { color: '#9F0712' }]}>Chi tiết</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={[styles.actionLinkText, { color: '#C10007' }]}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Item 2: Warning (Vàng) */}
                <View style={[styles.notiItem, { opacity: 0.7 }]}>
                    <View style={styles.notiHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEFCE8' }]}>
                            <Text>⚠️</Text>
                        </View>
                        <View style={styles.notiContent}>
                            <Text style={styles.notiTitle}>Độ đục tăng cao</Text>
                            <Text style={styles.notiDesc}>Turbidity = 7 NTU{'\n'}Có thể có tạp chất trong nước</Text>
                            <Text style={styles.notiTime}>🕒 1 ngày trước bởi 268 Lý Thường Kiệt</Text>
                        </View>
                    </View>
                </View>

                {/* Item 3: Info (Xanh dương) */}
                <View style={[styles.notiItem, { opacity: 0.7 }]}>
                    <View style={styles.notiHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                            <Text>ℹ️</Text>
                        </View>
                        <View style={styles.notiContent}>
                            <Text style={styles.notiTitle}>Kiểm tra cảm biến pH</Text>
                            <Text style={styles.notiDesc}>Cảm biến pH đã đến kỳ kiểm tra</Text>
                            <Text style={styles.notiTime}>🕒 3 ngày trước bởi Đông Hòa, Dĩ An</Text>
                        </View>
                    </View>
                    <View style={styles.notiActions}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}>
                            <Text style={[styles.actionBtnText, { color: '#0C5EDB' }]}>Chi tiết</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={[styles.actionLinkText, { color: '#0C5EDB' }]}>Đánh dấu đã đọc</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Item 4: Success (Xanh lá) */}
                <View style={[styles.notiItem, { opacity: 0.7 }]}>
                    <View style={styles.notiHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                            <Text>✅</Text>
                        </View>
                        <View style={styles.notiContent}>
                            <Text style={styles.notiTitle}>Cập nhật trạm quan sát mới</Text>
                            <Text style={styles.notiDesc}>161 Võ Nguyên Giáp đã được thiết lập</Text>
                            <Text style={styles.notiTime}>🕒 04-03-2026 bởi 161 Võ Nguyên Giáp</Text>
                        </View>
                    </View>
                </View>
            </View>

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
        paddingTop: 40,
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
    pageTitleSection: {
        marginTop: 10,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 6,
    },
    unreadBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotRed: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FB2C36',
        marginRight: 6,
    },
    unreadText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FB2C36',
    },
    settingsCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    settingTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    settingLabel: {
        fontSize: 12,
        color: '#0F172B',
        marginBottom: 2,
    },
    settingDesc: {
        fontSize: 10,
        color: '#62748E',
    },
    filterSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#45556C',
    },
    filterTabs: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 4,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    tabButtonActive: {
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabText: {
        fontSize: 11,
        color: '#45556C',
    },
    tabTextActive: {
        color: '#0092B8',
        fontWeight: '600',
    },
    notificationList: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        paddingTop: 14,
    },
    notiItem: {
        paddingHorizontal: 14,
        paddingBottom: 14,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    notiHeader: {
        flexDirection: 'row',
    },
    iconBox: {
        width: 35,
        height: 35,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notiContent: {
        flex: 1,
    },
    notiTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#0F172B',
        marginBottom: 4,
    },
    notiDesc: {
        fontSize: 11,
        color: '#45556C',
        lineHeight: 16,
        marginBottom: 6,
    },
    notiTime: {
        fontSize: 10,
        color: '#62748E',
    },
    notiActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 47, // Canh lề với text bên trên
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 16,
    },
    actionBtnText: {
        fontSize: 11,
        fontWeight: '500',
    },
    actionLinkText: {
        fontSize: 11,
        textDecorationLine: 'underline',
    },
});