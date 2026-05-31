import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#ECFEFF";
const SECONDARY_COLOR = "#0891B2";
const BASE_SIZE = 10;

function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
        case "home":
            return <Feather name="home" size={18} color={color} />;
        case "history":
            return <AntDesign name="bar-chart" size={18} color={color} />;
        case "iot-dashboard":
            return <Feather name="activity" size={18} color={color} />;
        case "notification":
            return <Feather name="bell" size={18} color={color} />;
        case "settings":
            return <Feather name="settings" size={18} color={color} />;
        default:
            return <Feather name="home" size={18} color={color} />;
    }
}

const TabItem = ({ route, isFocused, label, onPress }: any) => {
    const progress = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isFocused ? 1 : 0, { mass: (route.name.length * BASE_SIZE) / 10 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", SECONDARY_COLOR]),
        };
    });

    const animatedMaskStyle = useAnimatedStyle(() => {
        return {
            maxWidth: progress.value * (route.name.length * BASE_SIZE + BASE_SIZE),
            marginLeft: progress.value * 8,
            opacity: progress.value,
        };
    });

    return (
        <AnimatedTouchableOpacity onPress={onPress} style={[styles.tabItem, animatedContainerStyle]}>
            {getIconByRouteName(route.name, isFocused ? PRIMARY_COLOR : SECONDARY_COLOR)}
            <Animated.Text numberOfLines={1} style={[styles.text, animatedMaskStyle]}>
                {label}
            </Animated.Text>
        </AnimatedTouchableOpacity>
    );
};

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { bottom: Math.max(20, insets.bottom + 10) }]}>
            {state.routes.map((route, index) => {
                if (["_sitemap", "+not-found"].includes(route.name)) return null;

                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                          ? options.title
                          : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <TabItem
                        key={route.key}
                        route={route}
                        isFocused={isFocused}
                        label={label as string}
                        onPress={onPress}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR,
        width: "85%",
        alignSelf: "center",
        borderRadius: 36 + 15 * 2,
        paddingHorizontal: 8,
        paddingVertical: 15,
        shadowColor: "#333333" + "CC",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 6,
    },
    tabItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 30,
    },
    text: {
        color: PRIMARY_COLOR,
        marginLeft: 8,
        fontWeight: "600",
    },
});

export default CustomNavBar;
