import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import * as api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATIONS = [
    { id: 1, name: 'Bể nước BK-H6', location: 'Khu H6, 268 Lý Thường Kiệt', status: 'Hoạt động' },
    { id: 2, name: 'Bể nước BK-B1', location: 'Khu B1, 268 Lý Thường Kiệt', status: 'Hoạt động' },
    { id: 3, name: 'Bể nước BK-B2', location: 'Khu B2, 268 Lý Thường Kiệt', status: 'Hoạt động' },
    { id: 4, name: 'Bể nước BK-B3', location: 'Khu B3, 268 Lý Thường Kiệt', status: 'Bảo trì' },
];

export default function SettingsScreen() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [emailNotifLoading, setEmailNotifLoading] = useState(false);
    const [userName, setUserName] = useState('Người dùng');
    const [userEmail, setUserEmail] = useState('user@example.com');
    const [userPhone, setUserPhone] = useState('Chưa cập nhật');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showStationsModal, setShowStationsModal] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                // Đọc từ AsyncStorage trước (nhanh)
                const storedUserStr = await AsyncStorage.getItem('currentUser');
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser.name) setUserName(storedUser.name);
                    if (storedUser.email) setUserEmail(storedUser.email);
                    if (storedUser.phone_number) setUserPhone(storedUser.phone_number);
                }

                // Gọi API lấy thông tin mới nhất từ server
                const result = await api.getMe();
                if (result.success && result.payload) {
                    const p = result.payload;
                    if (p.name) setUserName(p.name);
                    if (p.email) setUserEmail(p.email);
                    setUserPhone(p.phone_number || 'Chưa cập nhật');
                    setEmailNotif(p.email_notifications !== 0);

                    // Cập nhật lại AsyncStorage
                    const stored = storedUserStr ? JSON.parse(storedUserStr) : {};
                    await AsyncStorage.setItem('currentUser', JSON.stringify({ ...stored, ...p }));
                }
            } catch (e) {
                console.error('Lỗi khi đọc thông tin người dùng:', e);
            }
        };
        loadUserInfo();
    }, []);

    const handleToggleEmailNotif = async (value: boolean) => {
        setEmailNotif(value);
        setEmailNotifLoading(true);
        try {
            const result = await api.updateEmailNotifications(value);
            if (!result.success) {
                // Rollback nếu thất bại
                setEmailNotif(!value);
                Alert.alert('Lỗi', result.error || 'Không thể cập nhật cài đặt');
            }
        } catch (e) {
            setEmailNotif(!value);
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
        } finally {
            setEmailNotifLoading(false);
        }
    };

    const handleLogout = async () => {
        const doLogout = async () => {
            try {
                await api.logout();
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {
                await AsyncStorage.removeItem('currentUser');
                await AsyncStorage.removeItem('rememberedUser');
                router.replace('/login');
            }
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm(t('settings.confirmLogout'));
            if (confirmed) await doLogout();
        } else {
            Alert.alert(
                t('settings.logoutConfirmText'),
                t('settings.confirmLogout'),
                [
                    { text: t('settings.cancel'), style: 'cancel' },
                    { text: t('common.logout'), onPress: doLogout, style: 'destructive' },
                ]
            );
        }
    };

    const handleFeatureNotImplemented = (featureName: string) => {
        Alert.alert(featureName, 'Tính năng này đang được phát triển.', [{ text: 'OK' }]);
    };

    const renderSettingRow = (icon: string, title: string, subtitle: string, rightElement: any, isLast = false, onPress?: () => void) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.6 : 1}
            disabled={!onPress}
        >
            <View style={[styles.settingRow, isLast && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <View style={styles.settingRowLeft}>
                    <View style={styles.settingIconBox}>
                        <Text style={styles.settingIcon}>{icon}</Text>
                    </View>
                    <View>
                        <Text style={styles.settingTitle}>{title}</Text>
                        <Text style={styles.settingSubtitle}>{subtitle}</Text>
                    </View>
                </View>
                <View style={styles.settingRowRight}>
                    {rightElement !== undefined ? rightElement : <Text style={styles.chevron}>›</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );

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
                        <Text style={styles.pageTitle}>{t('settings.title')}</Text>
                        <Text style={styles.pageSubtitle}>{t('settings.subtitle')}</Text>
                    </View>
                </View>

                {/* 2. Thẻ Thông tin tài khoản */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarBox}>
                        <Text style={styles.avatarText}>👤</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userName}</Text>
                        <Text style={styles.profileEmail}>{userEmail}</Text>
                        <View style={styles.verifyBadge}>
                            <Text style={styles.verifyText}>{t('settings.verifiedUser')}</Text>
                        </View>
                    </View>
                </View>

                {/* 3. Thẻ Thống kê nhanh */}
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>{t('settings.statistics')}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#0092B8' }]}>82</Text>
                            <Text style={styles.statLabel}>{t('settings.averageWQI')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#00A63E' }]}>4</Text>
                            <Text style={styles.statLabel}>{t('settings.activeSessions')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#45556C' }]}>2</Text>
                            <Text style={styles.statLabel}>{t('settings.unreadAlerts')}</Text>
                        </View>
                    </View>
                </View>

                {/* 4. Cài đặt chung */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.general')}</Text>
                    {renderSettingRow('👤', t('settings.profileInfo'), t('common.profile'), null, false, () => setShowProfileModal(true))}
                    {renderSettingRow(
                        '✉️',
                        t('settings.notifications'),
                        emailNotif ? 'Đang bật — cảnh báo sẽ gửi đến email' : 'Đang tắt — sẽ không nhận email cảnh báo',
                        <Switch
                            value={emailNotif}
                            onValueChange={handleToggleEmailNotif}
                            trackColor={{ false: '#E2E8F0', true: '#00B8DB' }}
                            thumbColor="#FFFFFF"
                            disabled={emailNotifLoading}
                        />,
                        true
                    )}
                </View>

                {/* 5. Cài đặt cảnh báo */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.alerts')}</Text>
                    {renderSettingRow(
                        '🔔',
                        t('settings.wqiThreshold'),
                        t('settings.thresholdSubtitle'),
                        <TouchableOpacity style={styles.thresholdBtn} onPress={() => handleFeatureNotImplemented(t('settings.wqiThreshold'))}>
                            <Text style={styles.thresholdValue}>80</Text>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>,
                        true,
                        () => handleFeatureNotImplemented(t('settings.wqiThreshold'))
                    )}
                </View>

                {/* 6. Cài đặt hệ thống */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.system')}</Text>
                    {renderSettingRow('📍', t('settings.stations'), t('settings.stationsSubtitle'), null, false, () => setShowStationsModal(true))}
                    {renderSettingRow('⚙️', t('settings.manageStations'), t('settings.manageStationsSubtitle'), null, true, () => handleFeatureNotImplemented(t('settings.manageStations')))}
                </View>

                {/* 7. Hỗ trợ & Ngôn ngữ */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
                    {renderSettingRow('❓', t('settings.faq'), t('settings.faqSubtitle'), null, false, () => handleFeatureNotImplemented(t('settings.faq')))}

                    {/* Custom Toggle Ngôn ngữ */}
                    {renderSettingRow(
                        '🌐',
                        t('common.language'),
                        t('settings.changeLanguage'),
                        <View style={styles.langToggle}>
                            <TouchableOpacity
                                style={[styles.langBtn, language === 'vi' && styles.langBtnActive]}
                                onPress={() => setLanguage('vi')}
                            >
                                <Text style={[styles.langText, language === 'vi' && styles.langTextActive]}>{t('settings.Vietnamese')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                                onPress={() => setLanguage('en')}
                            >
                                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>{t('settings.English')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {renderSettingRow('🚪', t('common.logout'), t('common.logoutSubtitle'), null, true, handleLogout)}
                </View>
            </ScrollView>

            {/* Modal: Thông tin tài khoản */}
            <Modal
                visible={showProfileModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowProfileModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Thông tin tài khoản</Text>
                            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileModalAvatar}>
                            <View style={styles.bigAvatarBox}>
                                <Text style={{ fontSize: 36 }}>👤</Text>
                            </View>
                            <Text style={styles.profileModalName}>{userName}</Text>
                        </View>

                        <View style={styles.infoList}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>👤</Text>
                                <View style={styles.infoTextBlock}>
                                    <Text style={styles.infoLabel}>Tên người dùng</Text>
                                    <Text style={styles.infoValue}>{userName}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>✉️</Text>
                                <View style={styles.infoTextBlock}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{userEmail}</Text>
                                </View>
                            </View>
                            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                                <Text style={styles.infoIcon}>📱</Text>
                                <View style={styles.infoTextBlock}>
                                    <Text style={styles.infoLabel}>Số điện thoại</Text>
                                    <Text style={styles.infoValue}>{userPhone}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowProfileModal(false)}>
                            <Text style={styles.modalCloseBtnText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal: Danh sách trạm quan trắc */}
            <Modal
                visible={showStationsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStationsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '75%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Danh sách trạm quan trắc</Text>
                            <TouchableOpacity onPress={() => setShowStationsModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={STATIONS}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <View style={[styles.stationItem, index === STATIONS.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View style={styles.stationLeft}>
                                        <View style={[styles.stationDot, { backgroundColor: item.status === 'Hoạt động' ? '#00C950' : '#F59E0B' }]} />
                                        <View>
                                            <Text style={styles.stationName}>{item.name}</Text>
                                            <Text style={styles.stationLocation}>📍 {item.location}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.stationBadge, { backgroundColor: item.status === 'Hoạt động' ? '#F0FDF4' : '#FEF9C3' }]}>
                                        <Text style={[styles.stationBadgeText, { color: item.status === 'Hoạt động' ? '#166534' : '#854D0E' }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowStationsModal(false)}>
                            <Text style={styles.modalCloseBtnText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { padding: 16 },
    appTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoPlaceholder: {
        width: 35, height: 35, backgroundColor: '#00B8DB',
        borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8,
    },
    logoText: { fontSize: 16 },
    appName: { fontSize: 16, fontWeight: '600', color: '#0F172B' },
    appSubtitle: { fontSize: 10, color: '#62748E' },
    pageTitleSection: { marginTop: 10 },
    pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172B', marginBottom: 4 },
    pageSubtitle: { fontSize: 13, color: '#45556C' },
    profileCard: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 16, padding: 16, backgroundColor: '#ECFEFF',
        borderRadius: 14, marginBottom: 20,
    },
    avatarBox: {
        width: 56, height: 56, backgroundColor: '#A2F4FD',
        borderRadius: 28, justifyContent: 'center', alignItems: 'center',
        marginRight: 14, borderWidth: 2, borderColor: '#007595',
    },
    avatarText: { fontSize: 24 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 14, fontWeight: 'bold', color: '#0F172B', marginBottom: 2 },
    profileEmail: { fontSize: 12, color: '#45556C', marginBottom: 6 },
    verifyBadge: {
        backgroundColor: '#CBFBF1', paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 12, alignSelf: 'flex-start',
    },
    verifyText: { fontSize: 10, color: '#00786F' },
    statsCard: {
        marginHorizontal: 16, backgroundColor: '#FFFFFF', borderWidth: 1,
        borderColor: '#E2E8F0', borderRadius: 14, padding: 16, marginBottom: 20,
    },
    statsTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172B', marginBottom: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
    statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    statLabel: { fontSize: 10, color: '#62748E', textAlign: 'center' },
    sectionCard: {
        marginHorizontal: 16, backgroundColor: '#FFFFFF', borderWidth: 1,
        borderColor: '#E9EDF3', borderRadius: 14, padding: 16, marginBottom: 16,
    },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172B', marginBottom: 16 },
    settingRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    settingRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    settingIconBox: {
        width: 35, height: 35, backgroundColor: '#F1F5F9',
        borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    settingIcon: { fontSize: 16 },
    settingTitle: { fontSize: 13, color: '#0F172B', marginBottom: 2 },
    settingSubtitle: { fontSize: 11, color: '#62748E' },
    settingRowRight: { justifyContent: 'center', alignItems: 'flex-end' },
    chevron: { fontSize: 20, color: '#90A1B9' },
    thresholdBtn: { flexDirection: 'row', alignItems: 'center' },
    thresholdValue: { fontSize: 14, color: '#0F172B', marginRight: 4 },
    editIcon: { fontSize: 12 },
    langToggle: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 },
    langBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
    langBtnActive: {
        backgroundColor: '#FFFFFF', shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1,
    },
    langText: { fontSize: 11, color: '#45556C' },
    langTextActive: { color: '#0092B8', fontWeight: '600' },

    // Modal chung
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingTop: 20, paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    modalTitle: { fontSize: 16, fontWeight: '700', color: '#0F172B' },
    modalClose: { fontSize: 20, color: '#90A1B9', fontWeight: 'bold' },
    modalCloseBtn: {
        marginHorizontal: 20, marginTop: 16, backgroundColor: '#00B8DB',
        borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    },
    modalCloseBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

    // Modal thông tin tài khoản
    profileModalAvatar: { alignItems: 'center', paddingVertical: 20 },
    bigAvatarBox: {
        width: 80, height: 80, backgroundColor: '#A2F4FD',
        borderRadius: 40, justifyContent: 'center', alignItems: 'center',
        marginBottom: 10, borderWidth: 2, borderColor: '#007595',
    },
    profileModalName: { fontSize: 16, fontWeight: '700', color: '#0F172B' },
    infoList: { paddingHorizontal: 20 },
    infoRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    infoIcon: { fontSize: 18, marginRight: 14 },
    infoTextBlock: { flex: 1 },
    infoLabel: { fontSize: 11, color: '#62748E', marginBottom: 2 },
    infoValue: { fontSize: 14, color: '#0F172B', fontWeight: '500' },

    // Modal danh sách trạm
    stationItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 14, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    stationLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    stationDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
    stationName: { fontSize: 13, fontWeight: '600', color: '#0F172B', marginBottom: 3 },
    stationLocation: { fontSize: 11, color: '#62748E' },
    stationBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    stationBadgeText: { fontSize: 10, fontWeight: '600' },
});