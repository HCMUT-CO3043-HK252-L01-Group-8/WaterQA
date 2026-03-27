import React from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";

interface ToggleRowProps {
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    isLast?: boolean; // Prop mới: Nếu là dòng cuối cùng thì không cần khoảng cách bên dưới
}

export function ToggleRow({ title, description, value, onValueChange, isLast = false }: ToggleRowProps) {
    return (
        <View style={[styles.container, !isLast && styles.marginBottom]}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>

            <Switch
                // Căn chỉnh màu sắc giống hệt Figma
                trackColor={{ false: "#E2E8F0", true: "#00BCD4" }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor="#E2E8F0"
                onValueChange={onValueChange}
                value={value}
                // Trick nhỏ: Thu nhỏ nút switch trên iOS một chút để giống thiết kế thanh thoát của Figma hơn
                style={Platform.OS === "ios" ? { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] } : {}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // Đảm bảo text và switch luôn nằm giữa trên cùng 1 hàng
    },
    marginBottom: {
        marginBottom: 24, // Tăng khoảng cách giữa các dòng cho thoáng giống ảnh
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "400", // Chữ thường, không in đậm
        color: "#1A202C", // Màu đen ám xanh (nhìn hiện đại hơn đen tuyền)
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#718096", // Màu xám chữ mô tả
    },
});
