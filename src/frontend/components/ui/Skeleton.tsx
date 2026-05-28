import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface SkeletonContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const SkeletonContainer = ({ children, style }: SkeletonContainerProps) => {
    const fadeAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
            ]),
        ).start();
    }, [fadeAnim]);

    return <Animated.View style={[{ opacity: fadeAnim }, style]}>{children}</Animated.View>;
};

interface SkeletonBlockProps {
    style?: StyleProp<ViewStyle>;
}

export const SkeletonBlock = ({ style }: SkeletonBlockProps) => {
    return <View style={[styles.skeletonBlock, style]} />;
};

const styles = StyleSheet.create({
    skeletonBlock: {
        backgroundColor: "#E2E8F0",
        borderRadius: 12,
    },
});
