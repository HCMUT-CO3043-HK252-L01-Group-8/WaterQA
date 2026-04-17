import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SegmentedControlProps {
    options: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onChange }: SegmentedControlProps) {
    return (
        <View style={styles.container}>
            {options.map((option, index) => {
                const isActive = selectedIndex === index;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, isActive && styles.activeButton]}
                        onPress={() => onChange(index)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.text, isActive && styles.activeText]}>{option}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 6,
    },
    activeButton: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    text: {
        fontSize: 14,
        color: "#666666",
        fontWeight: "500",
    },
    activeText: {
        color: "#333333",
        fontWeight: "600",
    },
});
