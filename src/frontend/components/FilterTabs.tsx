import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface FilterTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    containerStyle?: ViewStyle;
}

export default function FilterTabs({ tabs, activeTab, onTabChange, containerStyle }: FilterTabsProps) {
    return (
        <View style={[styles.filterTabs, containerStyle]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, isActive && styles.tabButtonActive]}
                        onPress={() => onTabChange(tab)}
                    >
                        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    filterTabs: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
        padding: 4,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    tabButtonActive: {
        backgroundColor: "#FFFFFF",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabText: {
        fontSize: 11,
        color: "#45556C",
    },
    tabTextActive: {
        color: "#0092B8",
        fontWeight: "600",
    },
});
