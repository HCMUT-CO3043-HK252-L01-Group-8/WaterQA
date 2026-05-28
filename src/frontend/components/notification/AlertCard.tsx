import Card from "@/components/ui/Card";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertData {
    type: "critical" | "warning";
    title: string;
    desc: string;
    time: string;
}

export default function AlertCard({ alert }: { alert: AlertData }) {
    const isCritical = alert.type === "critical";

    const iconName = isCritical ? "alert-octagon" : "alert-triangle";
    const mainColor = isCritical ? "#E7000B" : "#D97706";
    const iconBgColor = isCritical ? "#FFF0F0" : "#FFFBEB";
    const btnBgColor = isCritical ? "#FFE2E2" : "#FEF3C7";
    const btnTextColor = isCritical ? "#9F0712" : "#92400E";

    return (
        <Card style={styles.alertCardOverride}>
            <View style={[styles.alertIconBox, { backgroundColor: iconBgColor }]}>
                <Feather name={iconName} size={24} color={mainColor} />
            </View>
            <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.desc}</Text>
                <Text style={styles.alertTime}>
                    <Feather name="clock" size={10} color="#90A1B9" /> {alert.time}
                </Text>
                <View style={styles.alertActions}>
                    <TouchableOpacity style={[styles.detailBtn, { backgroundColor: btnBgColor }]}>
                        <Text style={[styles.detailBtnText, { color: btnTextColor }]}>Chi tiết</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.markReadText, { color: mainColor }]}>Đánh dấu đã đọc</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    alertCardOverride: {
        flexDirection: "row",
        marginHorizontal: 0,
        marginBottom: 0,
        padding: 14,
    },
    alertIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    alertContent: { flex: 1 },
    alertTitle: { fontSize: 13, color: "#0F172B", marginBottom: 4, fontFamily: "Inter-SemiBold" },
    alertDesc: { fontSize: 12, color: "#45556C", marginBottom: 2, fontFamily: "Inter-Regular", lineHeight: 18 },
    alertTime: { fontSize: 11, color: "#90A1B9", marginTop: 4, marginBottom: 10, fontFamily: "Inter-Regular" },
    alertActions: { flexDirection: "row", alignItems: "center", gap: 12 },
    detailBtn: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 8 },
    detailBtnText: { fontSize: 12, fontFamily: "Inter-SemiBold" },
    markReadText: { fontSize: 12, textDecorationLine: "underline", fontFamily: "Inter-Regular" },
});
