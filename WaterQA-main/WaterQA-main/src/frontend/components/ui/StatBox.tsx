import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface StatBoxProps {
    label: string;
    value: string | number;
    desc: string;
    valueColor?: string;
    bgColor?: string;
    borderColor?: string;
    icon?: keyof typeof Feather.glyphMap;
}

export default function StatBox({
    label,
    value,
    desc,
    valueColor = "#0F172B",
    bgColor = "#FFFFFF",
    borderColor = "#E2E8F0",
    icon,
}: StatBoxProps) {
    return (
        <View style={[styles.box, { backgroundColor: bgColor, borderColor }]}>
            <View style={styles.header}>
                {icon && <Feather name={icon} size={12} color={valueColor} style={styles.icon} />}
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
            <Text style={styles.desc}>{desc}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    box: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    icon: { marginRight: 6 },
    label: { fontSize: 11, color: "#45556C", fontFamily: "Inter-Regular" },
    value: { fontSize: 18, marginBottom: 4, fontFamily: "Inter-SemiBold" },
    desc: { fontSize: 10, color: "#64748B", fontFamily: "Inter-Regular" },
});
