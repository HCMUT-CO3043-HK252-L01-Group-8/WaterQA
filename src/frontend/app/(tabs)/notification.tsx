import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function AlertsScreen() {
    const { t } = useTranslation();
    const [sysNotification, setSysNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [waterAlert, setWaterAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

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
                        <View style={styles.unreadBadge}>
                            <View style={styles.dotRed} />
                            <Text style={styles.unreadText}>{t('notifications.unreadCount', { count: 2 })}</Text>
                        </View>
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
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
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
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
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
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
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
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
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
                            <Text style={[styles.tabText, activeTab === 'All' && styles.tabTextActive]}>{t('notifications.filterAll')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'Warning' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Warning')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Warning' && styles.tabTextActive]}>{t('notifications.filterWarning')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'Critical' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('Critical')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Critical' && styles.tabTextActive]}>{t('notifications.filterCritical')}</Text>
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
                                <Text style={styles.notiTitle}>{t('notifications.pollutionRisk')}</Text>
                                <Text style={styles.notiDesc}>{t('notifications.pollutionRiskDesc')}{'\n'}{t('notifications.pollutionConfidence', { percentage: 99 })}</Text>
                                <Text style={styles.notiTime}>🕒 {t('notifications.agoFrom', { time: '2 giờ', location: '268 Lý Thường Kiệt' })}</Text>
                            </View>
                        </View>
                        <View style={styles.notiActions}>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFE2E2' }]}>
                                <Text style={[styles.actionBtnText, { color: '#9F0712' }]}>{t('notifications.details')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={[styles.actionLinkText, { color: '#C10007' }]}>{t('notifications.markAsRead')}</Text>
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
                                <Text style={styles.notiTitle}>{t('notifications.turbidityHigh')}</Text>
                                <Text style={styles.notiDesc}>{t('notifications.turbidityHighDesc', { value: 7 })}</Text>
                                <Text style={styles.notiTime}>🕒 {t('notifications.agoFrom', { time: '1 ngày', location: '268 Lý Thường Kiệt' })}</Text>
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
                                <Text style={styles.notiTitle}>{t('notifications.sensorMaintenance')}</Text>
                                <Text style={styles.notiDesc}>{t('notifications.sensorMaintenanceDesc')}</Text>
                                <Text style={styles.notiTime}>🕒 {t('notifications.agoFrom', { time: '3 ngày', location: 'Đông Hòa, Dĩ An' })}</Text>
                            </View>
                        </View>
                        <View style={styles.notiActions}>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}>
                                <Text style={[styles.actionBtnText, { color: '#0C5EDB' }]}>{t('notifications.details')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={[styles.actionLinkText, { color: '#0C5EDB' }]}>{t('notifications.markAsRead')}</Text>
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
                                <Text style={styles.notiTitle}>{t('notifications.newStation')}</Text>
                                <Text style={styles.notiDesc}>{t('notifications.newStationDesc', { station: '161 Võ Nguyên Giáp' })}</Text>
                                <Text style={styles.notiTime}>🕒 {t('notifications.agoFrom', { time: '04-03-2026', location: '161 Võ Nguyên Giáp' })}</Text>
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