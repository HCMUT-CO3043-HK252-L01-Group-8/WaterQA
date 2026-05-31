import Card from "@/components/ui/Card";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface WqiCardProps {
    metrics: { wqi: number; pH: number; hardness: number; clo: number; ntu: number; lastUpdated: string };
}

export default function WqiCard({ metrics }: WqiCardProps) {
    const { t } = useTranslation();

    const getWqiConfig = (wqi: number) => {
        if (wqi >= 80)
            return {
                title: t("home.wqiTitle", "An toàn"),
                bgColor: "#F0FDF4",
                borderColor: "#22C55E",
                badgeBg: "#86EFAC",
                textColor: "#14532D",
            };
        if (wqi >= 50)
            return {
                title: t("notifications.filterWarning", "Cảnh báo"),
                bgColor: "#FEFCE8",
                borderColor: "#EAB308",
                badgeBg: "#FEF08A",
                textColor: "#713F12",
            };
        return {
            title: t("notifications.filterCritical", "Nguy hiểm"),
            bgColor: "#FEF2F2",
            borderColor: "#EF4444",
            badgeBg: "#FECACA",
            textColor: "#7F1D1D",
        };
    };

    const config = getWqiConfig(metrics.wqi);

    return (
        <Card style={{ backgroundColor: config.bgColor, borderColor: config.borderColor, borderWidth: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View>
                    <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
                        <Text style={[styles.scoreText, { color: config.textColor }]}>{config.title}</Text>
                    </View>
                    <Text style={[styles.title, { color: config.textColor }]}>{metrics.wqi}</Text>
                    <Text style={styles.subtitle}>{t("home.wqiSubtitle", "Chỉ số chất lượng nước (WQI)")}</Text>
                </View>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.pH}</Text>
                    <Text style={styles.label}>{t("home.pH", "pH")}</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.hardness}</Text>
                    <Text style={styles.label}>{t("home.hardness", "Hardness (mg/l)")}</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.clo}</Text>
                    <Text style={styles.label}>{t("home.chlorine", "Clo (mg/l)")}</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.value}>{metrics.ntu}</Text>
                    <Text style={styles.label}>{t("home.turbidity", "NTU")}</Text>
                </View>
            </View>

            <Text style={styles.updateTime}>
                {t("home.lastUpdate", "Cập nhật lần cuối: ")} {metrics.lastUpdated}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 32, fontFamily: "Inter-Bold" },
    subtitle: { fontSize: 14, color: "#45556C", marginTop: 4, marginBottom: 16, fontFamily: "Inter-Regular" },
    badge: { paddingHorizontal: 30, paddingVertical: 6, borderRadius: 20, marginBottom: 20, alignSelf: "flex-start" },
    scoreText: { fontSize: 18, fontFamily: "Inter-Bold" },
    metricsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 16 },
    metricItem: { alignItems: "center" },
    value: { fontSize: 18, color: "#0F172B", marginBottom: 2, fontFamily: "Inter-Bold" },
    label: { fontSize: 11, color: "#62748E", fontFamily: "Inter-Medium" },
    updateTime: { fontSize: 11, color: "#62748E", fontFamily: "Inter-Regular", textAlign: "center" },
});
