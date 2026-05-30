import StatBox from "@/components/ui/StatBox";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

interface SummaryCardsProps {
    todayWqi: number;
    trendValue: string;
}

export default function SummaryCards({ todayWqi, trendValue }: SummaryCardsProps) {
    const { t } = useTranslation();
    const isPositive = trendValue.includes("+");
    const trendColor = isPositive ? "#00A63E" : "#E7000B";

    return (
        <View style={styles.row}>
            <StatBox
                icon="droplet"
                label={t("history.today", "Hôm nay")}
                value={todayWqi}
                desc={t("history.avgWqi", "WQI trung bình")}
                valueColor="#0092B8"
                bgColor="#ECFEFF"
                borderColor="#0092B8"
            />
            <StatBox
                icon={isPositive ? "trending-up" : "trending-down"}
                label={t("history.comparedToYesterday", "so với Hôm qua")}
                value={trendValue}
                desc={t("home.wqiSubtitle", "Chỉ số WQI")}
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
