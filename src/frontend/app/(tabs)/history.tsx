import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

export default function HistoryScreen() {
    const [activeFilter, setActiveFilter] = useState('Ngày');
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const SERVER_URL = 'http://192.168.1.21:3000';

    useEffect(() => {
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = `${SERVER_URL}/data/history?rowLimit=4`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            const json = await response.json();
            
            if (json && json.success && json.payload) {
                setHistoryData(json.payload.data);
            }
        } catch (error) {
            console.error("Error while fetching: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportReport = async () => {
        try {
            const exportUrl = `${SERVER_URL}/data/export`;
            
            const supported = await Linking.canOpenURL(exportUrl);
            
            if (supported) {
                await Linking.openURL(exportUrl);
            } else {
                Alert.alert("Error");
            }
        } catch (error) {
            Alert.alert("Error");
            console.error(error);
        }
    };

    const renderHistoryCard = (item: any, index: number) => {
        const dateString = dayjs(item.timestamp).format('DD-MM-YYYY');
        const timeString = dayjs(item.timestamp).format('HH:mm');
        
        const temp = item.temperature ? `Nhiệt độ: ${item.temperature}°C` : 'Nhiệt độ: --°C';
        const hum = item.humidity ? `Độ ẩm: ${item.humidity}%` : 'Độ ẩm: --%';
        const waterLevel = item.water_level ? `Mực nước: ${item.water_level}m` : 'Mực nước: --m';

        return (
            <View key={index} style={styles.historyCard}>
                <View style={styles.cardLeft}>
                    <View style={styles.iconBox}>
                        <Text></Text>
                    </View>
                    <View>
                        <Text style={styles.wqiText}>{temp}</Text>
                        <Text style={[styles.wqiText, { fontSize: 12, color: '#45556C', marginTop: 2, fontWeight: '500' }]}>{hum}</Text>
                        <Text style={styles.dateText}>Trạm {item.station_id} • {dateString}</Text>
                    </View>
                </View>
                <View style={styles.cardRight}>
                    <View style={styles.trendBadge}>
                        <Text style={[styles.trendIcon, { color: '#0092B8' }]}></Text>
                        <Text style={[styles.trendText, { color: '#0092B8' }]}>{waterLevel}</Text>
                    </View>
                    <Text style={styles.timeText}>{timeString}</Text>
                </View>
            </View>
        );
    };

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

                    {/* ĐÃ GẮN SỰ KIỆN onPress VÀO ĐÂY */}
                    <TouchableOpacity style={styles.exportBtn} onPress={handleExportReport}>
                        <Text style={styles.exportIcon}>⬇</Text>
                        <Text style={styles.exportText}>Xuất báo cáo</Text>
                    </TouchableOpacity>

                </View>

                {/* 5. Danh sách lịch sử */}
                <View style={styles.historyListContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0092B8" style={{ marginVertical: 20 }} />
                    ) : historyData.length > 0 ? (
                        historyData.map((item, index) => renderHistoryCard(item, index))
                    ) : (
                        <Text style={{ textAlign: 'center', padding: 20, color: '#62748E' }}>
                            Không có dữ liệu
                        </Text>
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