import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

interface AlertBannerProps {
    visible: boolean;
    type?: "error" | "warning" | "info";
    title: string;
    message: string;
    dateText?: string;
    onClose: () => void;
    onPressDetail?: () => void;
}

function AlertBanner({ visible, type = "error", title, message, dateText, onClose, onPressDetail }: AlertBannerProps) {
    const { t } = useTranslation();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateXAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(1);
            translateXAnim.setValue(0);
            opacityAnim.setValue(1);
        }
    }, [visible, scaleAnim, translateXAnim, opacityAnim]);

    if (!visible) return null;

    const handleClose = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.85, duration: 150, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(translateXAnim, { toValue: screenWidth, duration: 250, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]),
        ]).start(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onClose();
        });
    };

    const getTheme = () => {
        switch (type) {
            case "info":
                return {
                    bg: "#EFF6FF",
                    border: "#3B82F6",
                    icon: "#2563EB",
                    text: "#1D4ED8",
                    subText: "#1E3A8A",
                    iconName: "info" as const,
                };
            case "warning":
                return {
                    bg: "#FFFBEB",
                    border: "#F59E0B",
                    icon: "#D97706",
                    text: "#B45309",
                    subText: "#78350F",
                    iconName: "alert-triangle" as const,
                };
            case "error":
            default:
                return {
                    bg: "#FFF7ED",
                    border: "#FF6467",
                    icon: "#FF6467",
                    text: "#9F0712",
                    subText: "#C10007",
                    iconName: "alert-octagon" as const,
                };
        }
    };

    const theme = getTheme();

    return (
        <Animated.View
            style={[
                styles.alertCard,
                {
                    backgroundColor: theme.bg,
                    borderLeftColor: theme.border,
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
                },
            ]}
        >
            <View style={styles.alertTitleRow}>
                <View style={styles.titleContainer}>
                    <Feather name={theme.iconName} size={14} color={theme.icon} />
                    <Text style={[styles.alertTitle, { color: theme.text }]}> {title}</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                    <Feather name="x" size={16} color={theme.icon} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.alertDescription, { color: theme.subText }]}>
                {message}
                {dateText && `\n${t("common.time", "Thời gian")}: ${dateText}`}
            </Text>
            <View style={styles.alertActions}>
                {onPressDetail && (
                    <TouchableOpacity
                        onPress={onPressDetail}
                        style={[styles.detailButton, { backgroundColor: theme.border + "30" }]}
                    >
                        <Text style={[styles.detailButtonText, { color: theme.text }]}>
                            {t("notifications.details", "Chi tiết")}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleClose}>
                    <Text style={[styles.readButtonText, { color: theme.subText }]}>
                        {t("notifications.markAsRead", "Đánh dấu đã đọc")}
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    alertCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 12, padding: 16, borderLeftWidth: 4 },
    alertTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
    titleContainer: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 },
    alertTitle: { fontSize: 13, fontFamily: "Inter-SemiBold", flexShrink: 1 },
    closeBtn: { padding: 2 },
    alertDescription: { fontSize: 11, lineHeight: 18, marginBottom: 12, fontFamily: "Inter-Regular" },
    alertActions: { flexDirection: "row", alignItems: "center" },
    detailButton: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8, marginRight: 16 },
    detailButtonText: { fontSize: 11, fontFamily: "Inter-SemiBold" },
    readButtonText: { fontSize: 11, textDecorationLine: "underline", fontFamily: "Inter-Regular" },
});

export default AlertBanner;
