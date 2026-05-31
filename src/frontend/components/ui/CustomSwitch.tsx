import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    thumbColor?: string;
    style?: StyleProp<ViewStyle>;
}

const SWITCH_WIDTH = 46;
const SWITCH_HEIGHT = 26;
const KNOB_SIZE = 22;
const PADDING = 2;
const MAX_TRANSLATE = SWITCH_WIDTH - KNOB_SIZE - PADDING * 2;

export default function CustomSwitch({
    value,
    onValueChange,
    disabled = false,
    activeColor = "#00A89D",
    inactiveColor = "#E2E8F0",
    thumbColor = "#FFFFFF",
    style,
}: CustomSwitchProps) {
    const translateX = useRef(new Animated.Value(value ? MAX_TRANSLATE : 0)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? MAX_TRANSLATE : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [value, translateX]);

    const toggleSwitch = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    return (
        <Pressable
            onPress={toggleSwitch}
            disabled={disabled}
            style={[
                styles.container,
                { backgroundColor: value ? activeColor : inactiveColor },
                disabled && styles.containerDisabled,
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.knob,
                    { backgroundColor: thumbColor, transform: [{ translateX }] },
                    disabled && styles.knobDisabled,
                ]}
            />
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
        opacity: 0.5,
    },
    knob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    knobDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
});
