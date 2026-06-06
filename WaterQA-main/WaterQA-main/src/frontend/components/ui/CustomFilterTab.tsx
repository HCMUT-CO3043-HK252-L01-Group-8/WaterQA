import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface FilterOption {
    label: string;
    value: string;
}

interface CustomFilterTabProps {
    options: FilterOption[];
    activeOption: string;
    onOptionChange: (value: string) => void;
}

export default function CustomFilterTab({ options, activeOption, onOptionChange }: CustomFilterTabProps) {
    return (
        <View style={styles.filterTabs}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[styles.tabButton, activeOption === option.value && styles.tabButtonActive]}
                    onPress={() => onOptionChange(option.value)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeOption === option.value && styles.tabTextActive]}>
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    filterTabs: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
        padding: 4,
        alignSelf: "flex-start",
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    tabButtonActive: {
        backgroundColor: "#FFFFFF",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tabText: {
        fontSize: 11,
        color: "#64748B",
        fontFamily: "Inter-Regular",
    },
    tabTextActive: {
        color: "#00A89D",
        fontFamily: "Inter-SemiBold",
    },
});
