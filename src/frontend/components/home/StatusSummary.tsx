import StatBox from "@/components/ui/StatBox";
import { StyleSheet, View } from "react-native";

interface StatusSummaryProps {
    wqiChange: string;
    sensorStatus: string;
    sensorIssue: string;
    isSafe: boolean;
}

export default function StatusSummary({ wqiChange, sensorStatus, sensorIssue, isSafe }: StatusSummaryProps) {
    const changeColor = wqiChange.includes("+") ? "#00A63E" : "#E7000B";
    const sensorColor = isSafe ? "#00A63E" : "#E7000B";

    return (
        <View style={styles.row}>
            <StatBox label="So với hôm qua" value={wqiChange} desc="Chỉ số WQI" valueColor={changeColor} />
            <StatBox label="Trạng thái cảm biến" value={sensorStatus} desc={sensorIssue} valueColor={sensorColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", marginHorizontal: 16, marginBottom: 20, gap: 14 },
});
