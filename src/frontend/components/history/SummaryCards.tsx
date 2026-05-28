import StatBox from "@/components/ui/StatBox";
import { StyleSheet, View } from "react-native";

interface SummaryCardsProps {
    todayWqi: number;
    trendValue: string;
}

export default function SummaryCards({ todayWqi, trendValue }: SummaryCardsProps) {
    const isPositive = trendValue.includes("+");
    const trendColor = isPositive ? "#00A63E" : "#E7000B";

    return (
        <View style={styles.row}>
            <StatBox
                icon="droplet"
                label="Hôm nay"
                value={todayWqi}
                desc="WQI trung bình"
                valueColor="#0092B8"
                bgColor="#ECFEFF"
                borderColor="#0092B8"
            />
            <StatBox
                icon={isPositive ? "trending-up" : "trending-down"}
                label="so với Hôm qua"
                value={trendValue}
                desc="Chỉ số WQI"
                valueColor={trendColor}
                bgColor={isPositive ? "#F0FDF4" : "#FEF2F2"}
                borderColor={trendColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", marginHorizontal: 16, marginBottom: 20, gap: 14 },
});
