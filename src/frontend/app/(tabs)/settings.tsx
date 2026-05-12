import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import * as api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [userName, setUserName] = useState('Người dùng');
    const [userEmail, setUserEmail] = useState('user@example.com');
    const router = useRouter();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        // Đọc thông tin người dùng từ AsyncStorage
        const loadUserInfo = async () => {
            try {
                const storedUserStr = await AsyncStorage.getItem('currentUser');
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser.name) setUserName(storedUser.name);
                    if (storedUser.email) setUserEmail(storedUser.email);
                }
            } catch (e) {
                console.error('Lỗi khi đọc thông tin người dùng:', e);
            }
        };
        loadUserInfo();
    }, []);

    const handleLogout = async () => {
        const doLogout = async () => {
            try {
                await api.logout();
            } catch (error) {
                console.error('Logout API error:', error);
                // Even if API call fails, still clear local state and go to login
            } finally {
                // Clear active session data
                await AsyncStorage.removeItem('currentUser');
                await AsyncStorage.removeItem('rememberedUser');
                // Always redirect to login page
                router.replace('/login');
            }
        };

        // On web, Alert.alert may not block - use platform-aware confirm
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(t('settings.confirmLogout'));
            if (confirmed) {
                await doLogout();
            }
        } else {
            Alert.alert(
                t('settings.logoutConfirmText'),
                t('settings.confirmLogout'),
                [
                    {
                        text: t('settings.cancel'),
                        style: 'cancel',
                    },
                    {
                        text: t('common.logout'),
                        onPress: doLogout,
                        style: 'destructive',
                    },
                ]
            );
        }
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
                    {rightElement ? rightElement : <Text style={styles.chevron}>›</Text>}
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
                    {renderSettingRow('👤', t('settings.profileInfo'), t('common.profile'), null)}
                    {renderSettingRow(
                        '✉️', 
                        t('settings.notifications'), 
                        t('settings.notificationsSubtitle'), 
                        <Switch
                            value={emailNotif}
                            onValueChange={setEmailNotif}
                            trackColor={{ false: "#E2E8F0", true: "#00B8DB" }}
                            thumbColor="#FFFFFF"
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
                        <TouchableOpacity style={styles.thresholdBtn}>
                            <Text style={styles.thresholdValue}>80</Text>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>,
                        true
                    )}
                </View>

                {/* 6. Cài đặt hệ thống */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.system')}</Text>
                    {renderSettingRow('📍', t('settings.stations'), t('settings.stationsSubtitle'), null)}
                    {renderSettingRow('⚙️', t('settings.manageStations'), t('settings.manageStationsSubtitle'), null, true)}
                </View>

                {/* 7. Hỗ trợ & Ngôn ngữ */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
                    {renderSettingRow('❓', t('settings.faq'), t('settings.faqSubtitle'), null)}
                    
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
    logoText: { fontSize: 16 },
    appName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172B',
    },
    appSubtitle: {
        fontSize: 10,
        color: '#62748E',
    },
    pageTitleSection: { marginTop: 10 },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 13,
        color: '#45556C',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#ECFEFF',
        borderRadius: 14,
        marginBottom: 20,
    },
    avatarBox: {
        width: 56,
        height: 56,
        backgroundColor: '#A2F4FD',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 2,
        borderColor: '#007595',
    },
    avatarText: { fontSize: 24 },
    profileInfo: { flex: 1 },
    profileName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 12,
        color: '#45556C',
        marginBottom: 6,
    },
    verifyBadge: {
        backgroundColor: '#CBFBF1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    verifyText: {
        fontSize: 10,
        color: '#00786F',
    },
    statsCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
    },
    statsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E2E8F0',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#62748E',
        textAlign: 'center',
    },
    sectionCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9EDF3',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 14,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    settingRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIconBox: {
        width: 35,
        height: 35,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingIcon: { fontSize: 16 },
    settingTitle: {
        fontSize: 13,
        color: '#0F172B',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 11,
        color: '#62748E',
    },
    settingRowRight: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    chevron: {
        fontSize: 20,
        color: '#90A1B9',
    },
    thresholdBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thresholdValue: {
        fontSize: 14,
        color: '#0F172B',
        marginRight: 4,
    },
    editIcon: { fontSize: 12 },
    langToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 4,
    },
    langBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    langBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    langText: {
        fontSize: 11,
        color: '#45556C',
    },
    langTextActive: {
        color: '#0092B8',
        fontWeight: '600',
    },
});