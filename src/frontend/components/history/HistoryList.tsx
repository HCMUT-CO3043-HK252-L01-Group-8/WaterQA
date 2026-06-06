import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface HistoryItem {
    id: string;
    wqi: string;
    date: string;
    time: string;
    trend: string;
}

export default function HistoryList({ data }: { data: HistoryItem[] }) {
    return (
        <View style={styles.historyListContainer}>
            {data.map((item, index) => {
                const isLast = index === data.length - 1;
                const isPositive = item.trend.includes("+");
                const trendColor = isPositive ? "#00A63E" : "#E7000B";
                const trendIcon = isPositive ? "arrow-up-right" : "arrow-down-right";

                return (
                    <View style={[styles.historyCard, isLast && { borderBottomWidth: 0 }]} key={item.id}>
                        <View style={styles.cardLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="activity" size={16} color="#0092B8" />
                            </View>
                            <View>
                                <Text style={styles.wqiText}>{item.wqi} °C</Text>
                                <Text style={styles.dateText}>{item.date}</Text>
                            </View>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={[styles.trendText, { color: trendColor }]}>
                                <Feather name={trendIcon as any} size={12} /> {item.trend}
                            </Text>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                    </View>
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
