import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'; // Thêm Linking vào đây
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import AppHeader from '@/components/AppHeader';
import { Feather } from '@expo/vector-icons';
import CustomSwitch from '@/components/ui/CustomSwitch';

export default function SettingsScreen() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [language, setLanguage] = useState('vi');
    const tabBarHeight = useTabBarHeight();

    // 1. SỬA LẠI HÀM NÀY: Chuyển View ngoài cùng thành TouchableOpacity và thêm biến onPress
    const renderSettingRow = (iconName: keyof typeof Feather.glyphMap, title: string, subtitle: string, rightElement: any, isLast = false, onPress?: () => void) => (
        <TouchableOpacity 
            style={[styles.settingRow, isLast && { borderBottomWidth: 0, paddingBottom: 0 }]}
            onPress={onPress} // Kích hoạt hành động khi bấm
            activeOpacity={onPress ? 0.7 : 1} // Nếu có link thì khi bấm mới có hiệu ứng mờ
        >
            <View style={styles.settingRowLeft}>
                <View style={styles.settingIconBox}>
                    <Feather name={iconName} size={18} color="#45556C" />
                </View>
                <View>
                    <Text style={styles.settingTitle}>{title}</Text>
                    <Text style={styles.settingSubtitle}>{subtitle}</Text>
                </View>
            </View>
            <View style={styles.settingRowRight}>
                {rightElement ? rightElement : <Feather name="chevron-right" size={20} color="#90A1B9" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight }}
            >
                {/* 1. Header */}
                <View style={styles.header}>
                    <AppHeader />

                    <View style={styles.pageTitleSection}>
                        <Text style={styles.pageTitle}>Cài đặt</Text>
                        <Text style={styles.pageSubtitle}>Điều chỉnh theo sở thích cá nhân của bạn</Text>
                    </View>
                </View>

                {/* 2. Thẻ Thông tin tài khoản */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarBox}>
                        <Feather name="user" size={24} color="#007595" />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Đậu Minh Khôi</Text>
                        <Text style={styles.profileEmail}>khoidau123@gmail.com</Text>
                        <View style={styles.verifyBadge}>
                            <Text style={styles.verifyText}>Người dùng đã xác minh</Text>
                        </View>
                    </View>
                </View>

                {/* 3. Thẻ Thống kê nhanh */}
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Thống kê</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#0092B8' }]}>82</Text>
                            <Text style={styles.statLabel}>WQI trung bình</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#00A63E' }]}>4</Text>
                            <Text style={styles.statLabel}>Phiên hoạt động</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#45556C' }]}>2</Text>
                            <Text style={styles.statLabel}>Cảnh báo chưa đọc</Text>
                        </View>
                    </View>
                </View>

                {/* 4. Cài đặt chung */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Cài đặt chung</Text>
                    {renderSettingRow('user', 'Thông tin cá nhân', 'Quản lý thông tin tài khoản', null)}
                    {renderSettingRow(
                        'mail',
                        'Nhận thông báo qua email',
                        'Cho phép gửi thông báo qua email',
                        <CustomSwitch
                            value={emailNotif}
                            onValueChange={setEmailNotif}
                        />,
                        true
                    )}
                </View>

                {/* 5. Cài đặt cảnh báo */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Cài đặt cảnh báo</Text>
                    {renderSettingRow(
                        'bell',
                        'Ngưỡng cảnh báo WQI',
                        'Thay đổi ngưỡng cảnh báo',
                        <TouchableOpacity style={styles.thresholdBtn}>
                            <Text style={styles.thresholdValue}>80</Text>
                            <Feather name="edit-2" size={14} color="#62748E" />
                        </TouchableOpacity>,
                        true
                    )}
                </View>

                {/* 6. Cài đặt hệ thống */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
                    {renderSettingRow('map-pin', 'Danh sách trạm quan trắc', 'Hiển thị vị trí và thông tin các trạm', null)}
                    {renderSettingRow('settings', 'Quản lý trạm của bạn', 'Quản lý trạm quan trắc của bạn', null, true)}
                </View>

                {/* 7. Hỗ trợ & Ngôn ngữ */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Hỗ trợ</Text>
                    
                    {/* 2. CHÈN LINK VÀO MỤC FAQ Ở ĐÂY NÈ */}
                    {renderSettingRow(
                        'help-circle', 
                        'FAQ', 
                        'Nhận trợ giúp về ứng dụng', 
                        null, 
                        false, 
                        () => Linking.openURL('https://github.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA')
                    )}

                    {renderSettingRow(
                        'globe',
                        'Ngôn ngữ',
                        'Thay đổi ngôn ngữ',
                        <View style={styles.langToggle}>
                            <TouchableOpacity
                                style={[styles.langBtn, language === 'vi' && styles.langBtnActive]}
                                onPress={() => setLanguage('vi')}
                            >
                                <Text style={[styles.langText, language === 'vi' && styles.langTextActive]}>Tiếng Việt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                                onPress={() => setLanguage('en')}
                            >
                                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>Tiếng Anh</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {renderSettingRow('log-out', 'Đăng xuất', 'Đăng xuất khỏi tài khoản của bạn', null, true)}
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
    pageTitleSection: { marginTop: 10 },
    pageTitle: {
        fontSize: 20,
        color: '#0F172B',
        marginBottom: 4,
        fontFamily: 'Inter-SemiBold',
    },
    pageSubtitle: {
        fontSize: 13,
        color: '#45556C',
        fontFamily: 'Inter-Regular',
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
    profileInfo: { flex: 1 },
    profileName: {
        fontSize: 14,
        color: '#0F172B',
        marginBottom: 2,
        fontFamily: 'Inter-SemiBold',
    },
    profileEmail: {
        fontSize: 12,
        color: '#45556C',
        marginBottom: 6,
        fontFamily: 'Inter-Regular',
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
        fontFamily: 'Inter-SemiBold',
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
        color: '#0F172B',
        marginBottom: 16,
        fontFamily: 'Inter-SemiBold',
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
        marginBottom: 4,
        fontFamily: 'Inter-SemiBold',
    },
    statLabel: {
        fontSize: 10,
        color: '#62748E',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
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
        color: '#0F172B',
        marginBottom: 16,
        fontFamily: 'Inter-SemiBold',
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
    settingTitle: {
        fontSize: 14,
        color: '#0F172B',
        marginBottom: 2,
        fontFamily: 'Inter-SemiBold',
    },
    settingSubtitle: {
        fontSize: 11,
        color: '#62748E',
        fontFamily: 'Inter-Regular',
    },
    settingRowRight: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    thresholdBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thresholdValue: {
        fontSize: 14,
        color: '#0F172B',
        marginRight: 4,
        fontFamily: 'Inter-SemiBold',
    },
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
        fontFamily: 'Inter-Regular',
    },
    langTextActive: {
        color: '#0092B8',
        fontFamily: 'Inter-SemiBold',
    },
});