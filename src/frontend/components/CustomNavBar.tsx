import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#ECFEFF";
const SECONDARY_COLOR = "#0891B2";

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    bottom: Math.max(20, insets.bottom + 10),
                },
            ]}
        >
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
                    <AnimatedTouchableOpacity
                        layout={LinearTransition.springify().mass(0.5)}
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabItem, { backgroundColor: isFocused ? SECONDARY_COLOR : "transparent" }]}
                    >
                        {getIconByRouteName(route.name, isFocused ? PRIMARY_COLOR : SECONDARY_COLOR)}
                        {isFocused && (
                            <Animated.Text
                                entering={FadeIn.duration(200)}
                                exiting={FadeOut.duration(200)}
                                style={styles.text}
                            >
                                {label as string}
                            </Animated.Text>
                        )}
                    </AnimatedTouchableOpacity>
                );
            })}
        </View>
    );

    function getIconByRouteName(routeName: string, color: string) {
        switch (routeName) {
            case "home":
                return <Feather name="home" size={18} color={color} />;
            case "history":
                return <AntDesign name="bar-chart" size={18} color={color} />;
            case "notification":
                return <Feather name="bell" size={18} color={color} />;
            case "settings":
                return <Feather name="settings" size={18} color={color} />;
            default:
                return <Feather name="home" size={18} color={color} />;
        }
    }
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR,
        width: "70%",
        alignSelf: "center",
        borderRadius: 40,
        paddingHorizontal: 12,
        paddingVertical: 15,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    tabItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 36,
        paddingHorizontal: 13,
        borderRadius: 30,
    },
    text: {
        color: PRIMARY_COLOR,
        marginLeft: 8,
        fontWeight: "600",
    },
});

export default CustomNavBar;
