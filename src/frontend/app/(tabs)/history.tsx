import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HistoryScreen() {
    // State giả lập cho bộ lọc thời gian
    const [activeFilter, setActiveFilter] = useState('Ngày');

    // Hàm render 1 thẻ lịch sử để tái sử dụng cho gọn code
    const renderHistoryCard = (wqi, date, time, trend) => (
        <View style={styles.historyCard}>
            <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                    <Text>📊</Text>
                </View>
                <View>
                    <Text style={styles.wqiText}>{wqi} WQI</Text>
                    <Text style={styles.dateText}>{date}</Text>
                </View>
            </View>
            <View style={styles.cardRight}>
                <View style={styles.trendBadge}>
                    <Text style={styles.trendIcon}>↗</Text>
                    <Text style={styles.trendText}>+{trend}</Text>
                </View>
                <Text style={styles.timeText}>{time}</Text>
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
                    <Text style={styles.pageTitle}>Lịch sử quang trắc</Text>
                </View>
            </View>

            {/* 2. Chọn vị trí */}
            <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Vị trí</Text>
                <TouchableOpacity style={styles.pickerBox}>
                    <Text style={styles.pickerText}>Select Location</Text>
                    <Text style={styles.pickerIcon}>▼</Text>
                </TouchableOpacity>
            </View>

            {/* 3. Thẻ thống kê nhanh */}
            <View style={styles.summarySection}>
                <View style={[styles.summaryCard, { backgroundColor: '#ECFEFF', borderColor: '#0092B8' }]}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.smallIcon}><Text style={{fontSize: 10}}>💧</Text></View>
                        <Text style={styles.summaryLabel}>Hôm nay</Text>
                    </View>
                    <Text style={styles.summaryValueMain}>92</Text>
                    <Text style={styles.summaryDesc}>WQI trung bình</Text>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4', borderColor: '#00A63E' }]}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.smallIcon}><Text style={{fontSize: 10}}>📈</Text></View>
                        <Text style={styles.summaryLabel}>so với Hôm qua</Text>
                    </View>
                    <Text style={styles.summaryValuePositive}>+3</Text>
                    <Text style={styles.summaryDesc}>Chỉ số WQI</Text>
                </View>
            </View>

            {/* 4. Bộ lọc & Xuất báo cáo */}
            <View style={styles.filterActionSection}>
                <View style={styles.filterTabs}>
                    {['Ngày', 'Tháng', 'Năm'].map((filter) => (
                        <TouchableOpacity 
                            key={filter}
                            style={[styles.tabButton, activeFilter === filter && styles.tabButtonActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.tabText, activeFilter === filter && styles.tabTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.exportBtn}>
                    <Text style={styles.exportIcon}>⬇</Text>
                    <Text style={styles.exportText}>Xuất báo cáo</Text>
                </TouchableOpacity>
            </View>

            {/* 5. Danh sách lịch sử */}
            <View style={styles.historyListContainer}>
                {renderHistoryCard('92', '06-03-2026', '20:36', '3')}
                {renderHistoryCard('89', '05-03-2026', '14:20', '1')}
                {renderHistoryCard('88', '04-03-2026', '09:15', '2')}
                {renderHistoryCard('86', '03-03-2026', '18:45', '4')}
                {renderHistoryCard('82', '02-03-2026', '11:10', '1')}
                {renderHistoryCard('81', '01-03-2026', '08:30', '5')}
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
    summarySection: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 24,
        gap: 14,
    },
    summaryCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    smallIcon: {
        marginRight: 6,
    },
    summaryLabel: {
        fontSize: 11,
        color: '#45556C',
    },
    summaryValueMain: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172B',
        marginBottom: 2,
    },
    summaryValuePositive: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#008236',
        marginBottom: 2,
    },
    summaryDesc: {
        fontSize: 10,
        color: '#62748E',
    },
    filterActionSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
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
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    exportIcon: {
        color: '#209FC1',
        marginRight: 6,
        fontSize: 12,
    },
    exportText: {
        fontSize: 12,
        color: '#209FC1',
    },
    historyListContainer: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    historyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 35,
        height: 35,
        backgroundColor: '#ECFEFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    wqiText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0F172B',
    },
    dateText: {
        fontSize: 11,
        color: '#62748E',
        marginTop: 2,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendIcon: {
        color: '#00A63E',
        fontSize: 12,
        marginRight: 2,
    },
    trendText: {
        fontSize: 12,
        color: '#00A63E',
        fontWeight: '600',
    },
    timeText: {
        fontSize: 11,
        color: '#62748E',
        marginTop: 2,
    },
});