import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean; // 1. Bổ sung thêm prop disabled
}

const SWITCH_WIDTH = 52;
const SWITCH_HEIGHT = 30;
const KNOB_SIZE = 26;
const PADDING = 2;
const MAX_TRANSLATE = SWITCH_WIDTH - KNOB_SIZE - PADDING * 2;

export default function CustomSwitch({ value, onValueChange, disabled = false }: CustomSwitchProps) {
    const currentTheme = Colors[useColorScheme() ?? "light"];

    const translateX = useRef(new Animated.Value(value ? MAX_TRANSLATE : 0)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? MAX_TRANSLATE : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const toggleSwitch = () => {
        if (!disabled) { // Chỉ cho phép đổi trạng thái nếu không bị disabled
            onValueChange(!value);
        }
    };

    return (
        <Pressable
            onPress={toggleSwitch}
            disabled={disabled}
            style={[
                styles.container, 
                { backgroundColor: value ? currentTheme.primary : currentTheme.border },
                disabled && styles.containerDisabled // 2. Làm mờ riêng cái nút
            ]}
        >
            <Animated.View style={[
                styles.knob, 
                { transform: [{ translateX }] },
                disabled && styles.knobDisabled // 3. Tắt đổ bóng khi bị vô hiệu hóa
            ]} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SWITCH_WIDTH,
        height: SWITCH_HEIGHT,
        borderRadius: SWITCH_HEIGHT / 2,
        padding: PADDING,
        justifyContent: "center",
    },
    containerDisabled: {
        opacity: 0.5, // Làm mờ nút gạt đi 50%
    },
    knob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    knobDisabled: {
        shadowOpacity: 0, // Xóa shadow trên iOS
        elevation: 0,     // Xóa shadow trên Android (nguyên nhân gây lỗi lục giác)
    }
});