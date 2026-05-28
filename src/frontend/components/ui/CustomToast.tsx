import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface CustomToastProps {
    visible: boolean;
    topInset: number;
    message: string;
    type?: "success" | "error" | "info";
}

function CustomToast({ visible, topInset, message, type = "success" }: CustomToastProps) {
    const toastAnim = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
        Animated.timing(toastAnim, {
            toValue: visible ? Math.max(topInset + 10, 50) : -150,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, topInset, toastAnim]);

    const getTheme = () => {
        switch (type) {
            case "error":
                return { bg: "#EF4444", icon: "close-circle" as const };
            case "info":
                return { bg: "#3B82F6", icon: "information-circle" as const };
            case "success":
            default:
                return { bg: "#00A89D", icon: "checkmark-circle" as const };
        }
    };

    const theme = getTheme();

    return (
        <Animated.View
            style={[styles.toastContainer, { backgroundColor: theme.bg, transform: [{ translateY: toastAnim }] }]}
        >
            <Ionicons name={theme.icon} size={20} color="#FFFFFF" />
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        top: 0,
        left: 32,
        right: 32,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    toastText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter-SemiBold", marginLeft: 8, textAlign: "center" },
});

export default CustomToast;
