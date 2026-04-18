import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface CardContainerProps extends ViewProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

export function CardContainer({ children, style, noPadding = false, ...props }: CardContainerProps) {
    return (
        <View style={[styles.card, !noPadding && styles.padding, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0", // Đổi màu viền cho tệp với màu xám nhạt của ToggleRow
        // Sử dụng boxShadow thay cho các thuộc tính shadow* và elevation cũ
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        marginBottom: 16,
    },
    padding: {
        padding: 16,
    },
});
