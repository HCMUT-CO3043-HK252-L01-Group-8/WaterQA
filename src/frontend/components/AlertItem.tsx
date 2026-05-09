import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export type AlertType = "critical" | "warning" | "info" | "success";

interface AlertItemProps {
    type: AlertType;
    title: string;
    descriptions: string[];
    time: string;
    onDetailPress?: () => void;
    onReadPress?: () => void;
}

const getAlertConfig = (type: AlertType) => {
    switch (type) {
        case "critical":
            return { iconName: "alert-circle", bg: "#FFF0F0", btnBg: "#FFE2E2", text: "#9F0712", link: "#C10007" };
        case "warning":
            return { iconName: "alert-triangle", bg: "#FFFBEB", btnBg: "#FEF3C7", text: "#B45309", link: "#D97706" };
        case "info":
            return { iconName: "info", bg: "#EFF6FF", btnBg: "#DBEAFE", text: "#1D4ED8", link: "#2563EB" };
        case "success":
            return { iconName: "check-circle", bg: "#F0FDF4", btnBg: "#DCFCE7", text: "#15803D", link: "#16A34A" };
    }
};

export default function AlertItem({ type, title, descriptions, time, onDetailPress, onReadPress }: AlertItemProps) {
    const config = getAlertConfig(type);

    return (
        <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                <Feather name={config.iconName as any} size={20} color={config.text} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {descriptions.map((desc, index) => (
                    <Text key={index} style={styles.desc}>
                        {desc}
                    </Text>
                ))}
                <Text style={styles.time}>{time}</Text>

                {(onDetailPress || onReadPress) && (
                    <View style={styles.actions}>
                        {onDetailPress && (
                            <TouchableOpacity
                                style={[styles.detailBtn, { backgroundColor: config.btnBg }]}
                                onPress={onDetailPress}
                            >
                                <Text style={[styles.detailBtnText, { color: config.text }]}>Chi tiết</Text>
                            </TouchableOpacity>
                        )}
                        {onReadPress && (
                            <TouchableOpacity onPress={onReadPress}>
                                <Text style={[styles.markReadText, { color: config.link }]}>Đánh dấu đã đọc</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    content: { flex: 1 },
    title: { fontSize: 13, fontWeight: "bold", color: "#0F172B", marginBottom: 4 },
    desc: { fontSize: 12, color: "#45556C", marginBottom: 2 },
    time: { fontSize: 11, color: "#90A1B9", marginTop: 4, marginBottom: 10 },
    actions: { flexDirection: "row", alignItems: "center", gap: 12 },
    detailBtn: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 8 },
    detailBtnText: { fontSize: 12, fontWeight: "500" },
    markReadText: { fontSize: 12, textDecorationLine: "underline" },
});
