import Card from "@/components/ui/Card";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function StatsCard() {
    const { t } = useTranslation();

    return (
        <Card>
            <Text style={styles.statsTitle}>{t("settings.statistics", "Thống kê")}</Text>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: "#0092B8" }]}>82</Text>
                    <Text style={styles.statLabel}>{t("settings.averageWQI", "WQI trung bình")}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: "#00A63E" }]}>4</Text>
                    <Text style={styles.statLabel}>{t("settings.activeSessions", "Phiên hoạt động")}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: "#45556C" }]}>2</Text>
                    <Text style={styles.statLabel}>{t("settings.unreadAlerts", "Cảnh báo chưa đọc")}</Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    statsTitle: { fontSize: 14, color: "#0F172B", marginBottom: 16, fontFamily: "Inter-SemiBold" },
    statsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statItem: { flex: 1, alignItems: "center" },
    statDivider: { width: 1, height: 30, backgroundColor: "#E2E8F0" },
    statValue: { fontSize: 18, marginBottom: 4, fontFamily: "Inter-SemiBold" },
    statLabel: { fontSize: 10, color: "#62748E", textAlign: "center", fontFamily: "Inter-Regular" },
});
