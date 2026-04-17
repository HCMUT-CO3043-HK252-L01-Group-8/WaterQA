import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

export default function SettingsScreen() {
    // States quản lý cài đặt
    const [emailNotif, setEmailNotif] = useState(true);
    const [language, setLanguage] = useState('vi'); // 'vi' hoặc 'en'

    // Hàm tiện ích để render một dòng cài đặt (Tái sử dụng)
    const renderSettingRow = (icon, title, subtitle, rightElement, isLast = false) => (
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
    );

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
                    <Text style={styles.pageTitle}>Cài đặt</Text>
                    <Text style={styles.pageSubtitle}>Điều chỉnh theo sở thích cá nhân của bạn</Text>
                </View>
            </View>

            {/* 2. Thẻ Thông tin tài khoản */}
            <View style={styles.profileCard}>
                <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>👤</Text>
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
                {renderSettingRow('👤', 'Thông tin cá nhân', 'Quản lý thông tin tài khoản', null)}
                {renderSettingRow(
                    '✉️', 
                    'Nhận thông báo qua email', 
                    'Cho phép gửi thông báo qua email', 
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
                <Text style={styles.sectionTitle}>Cài đặt cảnh báo</Text>
                {renderSettingRow(
                    '🔔', 
                    'Ngưỡng cảnh báo WQI', 
                    'Thay đổi ngưỡng cảnh báo', 
                    <TouchableOpacity style={styles.thresholdBtn}>
                        <Text style={styles.thresholdValue}>80</Text>
                        <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>,
                    true
                )}
            </View>

            {/* 6. Cài đặt hệ thống */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
                {renderSettingRow('📍', 'Danh sách trạm quan trắc', 'Hiển thị vị trí và thông tin các trạm', null)}
                {renderSettingRow('⚙️', 'Quản lý trạm của bạn', 'Quản lý trạm quan trắc của bạn', null, true)}
            </View>

            {/* 7. Hỗ trợ & Ngôn ngữ */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Hỗ trợ</Text>
                {renderSettingRow('❓', 'FAQ', 'Nhận trợ giúp về ứng dụng', null)}
                
                {/* Custom Toggle Ngôn ngữ */}
                {renderSettingRow(
                    '🌐', 
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
                
                {renderSettingRow('🚪', 'Đăng xuất', 'Đăng xuất khỏi tài khoản của bạn', null, true)}
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