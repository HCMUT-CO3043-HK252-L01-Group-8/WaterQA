import Card from "@/components/ui/Card";
import { StyleSheet, Text, View } from "react-native";

interface WqiCardProps {
    metrics: { wqi: number; pH: number; hardness: number; clo: number; ntu: number; lastUpdated: string };
}

export default function WqiCard({ metrics }: WqiCardProps) {
    const getWqiConfig = (wqi: number) => {
        if (wqi >= 80)
            return {
                title: "An toàn",
                bgColor: "#F0FDF4",
                borderColor: "#22C55E",
                badgeBg: "#86EFAC",
                textColor: "#14532D",
            };
        if (wqi >= 50)
            return {
                title: "Cảnh báo",
                bgColor: "#FEFCE8",
                borderColor: "#EAB308",
                badgeBg: "#FEF08A",
                textColor: "#713F12",
            };
        return {
            title: "Nguy hiểm",
            bgColor: "#FEF2F2",
            borderColor: "#EF4444",
            badgeBg: "#FECACA",
            textColor: "#7F1D1D",
        };
    };

    const config = getWqiConfig(metrics.wqi);

    return (
        <Card style={{ backgroundColor: config.bgColor, borderColor: config.borderColor, alignItems: "center" }}>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.subtitle}>Chỉ số chất lượng nước (WQI)</Text>

            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
                <Text style={[styles.scoreText, { color: config.textColor }]}>{metrics.wqi}</Text>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.pH}</Text>
                    <Text style={styles.label}>pH</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.hardness}</Text>
                    <Text style={styles.label}>Hardness (mg/l)</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.clo}</Text>
                    <Text style={styles.label}>Clo (mg/l)</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.ntu}</Text>
                    <Text style={styles.label}>NTU</Text>
                </View>
            </View>

            <Text style={styles.updateTime}>Cập nhật lần cuối: {metrics.lastUpdated}</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 32, fontFamily: "Inter-Bold" },
    subtitle: { fontSize: 14, color: "#45556C", marginTop: 4, marginBottom: 16, fontFamily: "Inter-Regular" },
    badge: { paddingHorizontal: 30, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
    scoreText: { fontSize: 18, fontFamily: "Inter-Bold" },
    metricsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 16 },
    metricItem: { alignItems: "center" },
    value: { fontSize: 18, color: "#1E293B", fontFamily: "Inter-Bold" },
    label: { fontSize: 12, color: "#64748B", marginTop: 4, fontFamily: "Inter-Regular" },
    updateTime: { fontSize: 11, color: "#64748B", fontFamily: "Inter-Regular" },
});
