import StatBox from "@/components/ui/StatBox";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

interface StatusSummaryProps {
    wqiChange: string;
    sensorStatus: string;
    sensorIssue: string;
    isSafe: boolean;
}

export default function StatusSummary({ wqiChange, sensorStatus, sensorIssue, isSafe }: StatusSummaryProps) {
    const { t } = useTranslation();
    const changeColor = wqiChange.includes("+") ? "#00A63E" : "#E7000B";
    const sensorColor = isSafe ? "#00A63E" : "#E7000B";

    return (
        <View style={styles.row}>
            <StatBox
                label={t("home.compared", "So với hôm qua")}
                value={wqiChange}
                desc={t("home.wqiSubtitle", "Chỉ số WQI")}
                valueColor={changeColor}
            />
            <StatBox
                label={t("home.sensorStatus", "Trạng thái cảm biến")}
                value={sensorStatus}
                desc={sensorIssue}
                valueColor={sensorColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", marginHorizontal: 16, marginBottom: 20, gap: 14 },
});
