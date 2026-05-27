import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Mỗi thông báo có: id, loại (Critical/Warning/Info/Success), và trạng thái đã đọc
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: 'Critical',
        icon: '🚨',
        bgColor: '#FEF2F2',
        titleKey: 'notifications.pollutionRisk',
        descKey: 'notifications.pollutionRiskDesc',
        extraDesc: (t: any) => '\n' + t('notifications.pollutionConfidence', { percentage: 99 }),
        timeKey: 'notifications.agoFrom',
        timeArgs: { time: '2 giờ', location: '268 Lý Thường Kiệt' },
        accentColor: '#9F0712',
        accentBg: '#FFE2E2',
        read: false,
    },
    {
        id: 2,
        type: 'Warning',
        icon: '⚠️',
        bgColor: '#FEFCE8',
        titleKey: 'notifications.turbidityHigh',
        descKey: 'notifications.turbidityHighDesc',
        descArgs: { value: 7 },
        extraDesc: null,
        timeKey: 'notifications.agoFrom',
        timeArgs: { time: '1 ngày', location: '268 Lý Thường Kiệt' },
        accentColor: '#854D0E',
        accentBg: '#FEF9C3',
        read: false,
    },
    {
        id: 3,
        type: 'Warning',
        icon: 'ℹ️',
        bgColor: '#EFF6FF',
        titleKey: 'notifications.sensorMaintenance',
        descKey: 'notifications.sensorMaintenanceDesc',
        extraDesc: null,
        timeKey: 'notifications.agoFrom',
        timeArgs: { time: '3 ngày', location: 'Đông Hòa, Dĩ An' },
        accentColor: '#0C5EDB',
        accentBg: '#EFF6FF',
        read: false,
    },
    {
        id: 4,
        type: 'Info',
        icon: '✅',
        bgColor: '#F0FDF4',
        titleKey: 'notifications.newStation',
        descKey: 'notifications.newStationDesc',
        descArgs: { station: '161 Võ Nguyên Giáp' },
        extraDesc: null,
        timeKey: 'notifications.agoFrom',
        timeArgs: { time: '04-03-2026', location: '161 Võ Nguyên Giáp' },
        accentColor: '#166534',
        accentBg: '#DCFCE7',
        read: true, // mục này đã đọc sẵn
    },
];

export default function AlertsScreen() {
    const { t } = useTranslation();
    const [sysNotification, setSysNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [waterAlert, setWaterAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleDetails = (titleKey: string) => {
        Alert.alert(
            t(titleKey),
            'Đang xem chi tiết thông báo này.',
            [{ text: 'Đóng' }]
        );
    };

    // Lọc theo tab và trạng thái chưa đọc/ẩn đi nếu đã đọc
    const visibleNotifications = notifications.filter(n => {
        if (n.read) return false; // ẩn thông báo đã đánh dấu đọc
        if (activeTab === 'All') return true;
        if (activeTab === 'Critical') return n.type === 'Critical';
        if (activeTab === 'Warning') return n.type === 'Warning';
        return false;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* 1. Header */}
                <View style={styles.header}>
                    <View style={styles.appTitleRow}>
                        <View style={styles.logoPlaceholder}>
                            <Text style={styles.logoText}>💧</Text>
                        </View>
                        <View>
                            <Text style={styles.appName}>{t('app.name')}</Text>
                            <Text style={styles.appSubtitle}>{t('app.subtitle')}</Text>
                        </View>
                    </View>

                    <View style={styles.pageTitleSection}>
                        <Text style={styles.pageTitle}>{t('notifications.pageTitle')}</Text>
                        {unreadCount > 0 ? (
                            <View style={styles.unreadBadge}>
                                <View style={styles.dotRed} />
                                <Text style={styles.unreadText}>{t('notifications.unreadCount', { count: unreadCount })}</Text>
                            </View>
                        ) : (
                            <Text style={styles.allReadText}>✅ Tất cả đã được đọc</Text>
                        )}
                    </View>
                </View>

                {/* 2. Cài đặt cảnh báo */}
                <View style={styles.settingsCard}>
                    <Text style={styles.settingsTitle}>{t('notifications.settingsTitle')}</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingLabel}>{t('notifications.systemNotification')}</Text>
                            <Text style={styles.settingDesc}>{t('notifications.systemNotificationDesc')}</Text>
                        </View>
                        <Switch
                            value={sysNotification}
                            onValueChange={setSysNotification}
                            trackColor={{ false: '#E2E8F0', true: '#00B8DB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingLabel}>{t('notifications.sensorAlert')}</Text>
                            <Text style={styles.settingDesc}>{t('notifications.sensorAlertDesc')}</Text>
                        </View>
                        <Switch
                            value={sensorAlert}
                            onValueChange={setSensorAlert}
                            trackColor={{ false: '#E2E8F0', true: '#00B8DB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingLabel}>{t('notifications.waterAlert')}</Text>
                            <Text style={styles.settingDesc}>{t('notifications.waterAlertDesc')}</Text>
                        </View>
                        <Switch
                            value={waterAlert}
                            onValueChange={setWaterAlert}
                            trackColor={{ false: '#E2E8F0', true: '#00B8DB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={[styles.settingRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingLabel}>{t('notifications.dailyReport')}</Text>
                            <Text style={styles.settingDesc}>{t('notifications.dailyReportDesc')}</Text>
                        </View>
                        <Switch
                            value={dailyReport}
                            onValueChange={setDailyReport}
                            trackColor={{ false: '#E2E8F0', true: '#00B8DB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* 3. Bộ lọc */}
                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>{t('notifications.filterTitle')}</Text>
                    <View style={styles.filterTabs}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'All' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('All')}
                        >
                            <Text style={[styles.tabText, activeTab === 'All' && styles.tabTextActive]}>
                                {t('notifications.filterAll')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Warning' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Warning')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Warning' && styles.tabTextActive]}>
                                {t('notifications.filterWarning')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'Critical' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Critical')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Critical' && styles.tabTextActive]}>
                                {t('notifications.filterCritical')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Danh sách thông báo */}
                <View style={styles.notificationList}>
                    {visibleNotifications.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🎉</Text>
                            <Text style={styles.emptyText}>Không có thông báo nào</Text>
                        </View>
                    ) : (
                        visibleNotifications.map((item, index) => {
                            const isLast = index === visibleNotifications.length - 1;
                            const showActions = item.type === 'Critical' || item.type === 'Warning';
                            return (
                                <View
                                    key={item.id}
                                    style={[styles.notiItem, isLast && { borderBottomWidth: 0, marginBottom: 0 }]}
                                >
                                    <View style={styles.notiHeader}>
                                        <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                                            <Text>{item.icon}</Text>
                                        </View>
                                        <View style={styles.notiContent}>
                                            <Text style={styles.notiTitle}>{t(item.titleKey)}</Text>
                                            <Text style={styles.notiDesc}>
                                                {t(item.descKey, (item as any).descArgs || {})}
                                                {item.extraDesc ? item.extraDesc(t) : ''}
                                            </Text>
                                            <Text style={styles.notiTime}>
                                                🕒 {t(item.timeKey, item.timeArgs)}
                                            </Text>
                                        </View>
                                    </View>
                                    {showActions && (
                                        <View style={styles.notiActions}>
                                            <TouchableOpacity
                                                style={[styles.actionBtn, { backgroundColor: item.accentBg }]}
                                                onPress={() => handleDetails(item.titleKey)}
                                            >
                                                <Text style={[styles.actionBtnText, { color: item.accentColor }]}>
                                                    {t('notifications.details')}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                                                <Text style={[styles.actionLinkText, { color: item.accentColor }]}>
                                                    {t('notifications.markAsRead')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 16,
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
    allReadText: {
        fontSize: 12,
        color: '#00A63E',
        fontWeight: '500',
    },
    settingsCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
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
        paddingBottom: 14,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyIcon: {
        fontSize: 36,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#62748E',
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
        marginLeft: 47,
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