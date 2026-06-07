import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface HistoryItem {
    id: string;
    wqi: string;
    date: string;
    time: string;
    trend: string;
    isGroup?: boolean;
    groupType?: string;
    groupYear?: number;
    groupMonth?: number;
}

export default function HistoryList({ data, onItemPress }: { data: HistoryItem[], onItemPress?: (item: HistoryItem) => void }) {
    return (
        <View style={styles.historyListContainer}>
            {data.map((item, index) => {
                const isLast = index === data.length - 1;
                const isPositive = item.trend.includes("+");
                const trendColor = isPositive ? "#00A63E" : "#E7000B";
                const trendIcon = isPositive ? "arrow-up-right" : "arrow-down-right";

                const CardComponent = (onItemPress && item.isGroup) ? TouchableOpacity : View;

                return (
                    <CardComponent 
                        style={[styles.historyCard, isLast && { borderBottomWidth: 0 }, item.isGroup && { backgroundColor: '#F8FAFC', paddingHorizontal: 8, borderRadius: 8 }]} 
                        key={item.id}
                        onPress={onItemPress && item.isGroup ? () => onItemPress(item) : undefined}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconBox, item.isGroup && { backgroundColor: '#E0F2FE' }]}>
                                <Feather name={item.isGroup ? "folder" : "activity"} size={16} color="#0092B8" />
                            </View>
                            <View>
                                <Text style={styles.wqiText}>{item.wqi}</Text>
                                <Text style={styles.dateText}>{item.date}</Text>
                            </View>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={[styles.trendText, { color: trendColor }]}>
                                <Feather name={trendIcon as any} size={12} /> {item.trend}
                            </Text>
                            <Text style={styles.timeText}>{item.time || "Trung bình"}</Text>
                        </View>
                    </CardComponent>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    historyListContainer: {
        marginHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    historyCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    cardLeft: { flexDirection: "row", alignItems: "center" },
    iconBox: {
        width: 35,
        height: 35,
        backgroundColor: "#ECFEFF",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    wqiText: { fontSize: 13, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    dateText: { fontSize: 11, color: "#62748E", marginTop: 2, fontFamily: "Inter-Regular" },
    cardRight: { alignItems: "flex-end" },
    trendText: { fontSize: 13, fontFamily: "Inter-SemiBold" },
    timeText: { fontSize: 11, color: "#62748E", marginTop: 2, fontFamily: "Inter-Regular" },
});
