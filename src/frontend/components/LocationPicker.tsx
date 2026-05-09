import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LocationPickerProps {
    title?: string;
    value?: string;
    onPress?: () => void;
}

export default function LocationPicker({ title = "Vị trí", value = "Select Location", onPress }: LocationPickerProps) {
    return (
        <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity style={styles.pickerBox} onPress={onPress}>
                <Text style={styles.pickerText}>{value}</Text>
                <Feather name="chevron-down" size={16} color="#666666" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    locationSection: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#000000", marginRight: 16 },
    pickerBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pickerText: { fontSize: 14, color: "#333333" },
});
