import { Feather } from "@expo/vector-icons";
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

interface SettingRowProps {
    title: string;
    subtitle?: string;
    iconName?: keyof typeof Feather.glyphMap;
    rightElement?: React.ReactNode;
    isToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    isLast?: boolean;
    onPress?: () => void;
}

function SettingRow({
    title,
    subtitle,
    iconName,
    rightElement,
    isToggle = false,
    toggleValue = false,
    onToggle,
    isLast = false,
    onPress,
}: SettingRowProps) {
    const handlePress = () => {
        if (isToggle && onToggle) {
            onToggle(!toggleValue);
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[styles.settingRow, isLast && styles.lastRow]}
            onPress={handlePress}
            activeOpacity={onPress || isToggle ? 0.7 : 1}
            disabled={!onPress && !isToggle}
        >
            <View style={styles.settingRowLeft}>
                {iconName && (
                    <View style={styles.settingIconBox}>
                        <Feather name={iconName} size={18} color="#45556C" />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>

            <View style={styles.settingRowRight}>
                {isToggle ? (
                    <Switch
                        trackColor={{ false: "#E2E8F0", true: "#00A89D" }}
                        thumbColor={"#FFFFFF"}
                        ios_backgroundColor="#E2E8F0"
                        onValueChange={onToggle}
                        value={toggleValue}
                        style={Platform.OS === "ios" ? { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] } : {}}
                    />
                ) : rightElement ? (
                    rightElement
                ) : (
                    onPress && <Feather name="chevron-right" size={20} color="#90A1B9" />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 14,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    lastRow: {
        borderBottomWidth: 0,
        paddingBottom: 0,
        marginBottom: 24,
    },
    settingRowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    settingIconBox: {
        width: 35,
        height: 35,
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    settingTitle: {
        fontSize: 14,
        color: "#0F172B",
        marginBottom: 2,
        fontFamily: "Inter-SemiBold",
    },
    settingSubtitle: {
        fontSize: 11,
        color: "#62748E",
        fontFamily: "Inter-Regular",
    },
    settingRowRight: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
});

export default SettingRow;
