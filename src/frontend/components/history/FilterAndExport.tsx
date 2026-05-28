import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterAndExportProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onExport: () => void;
}

export default function FilterAndExport({ activeFilter, onFilterChange, onExport }: FilterAndExportProps) {
    const filterOptions = [
        { label: "Ngày", value: "day" },
        { label: "Tháng", value: "month" },
        { label: "Năm", value: "year" },
    ];

    return (
        <View style={styles.filterActionSection}>
            <CustomFilterTab options={filterOptions} activeOption={activeFilter} onOptionChange={onFilterChange} />

            <TouchableOpacity style={styles.exportBtn} onPress={onExport}>
                <Feather name="download" size={14} color="#209FC1" style={styles.exportIcon} />
                <Text style={styles.exportText}>Xuất báo cáo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    filterActionSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 16,
    },
    filterTabs: { flexDirection: "row", backgroundColor: "#F1F5F9", borderRadius: 8, padding: 4 },
    tabButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    tabButtonActive: {
        backgroundColor: "#FFFFFF",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabText: { fontSize: 11, color: "#45556C", fontFamily: "Inter-Regular" },
    tabTextActive: { color: "#0092B8", fontFamily: "Inter-SemiBold" },

    exportBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#F1F5F9",
        borderRadius: 8,
    },
    exportIcon: { marginRight: 6 },
    exportText: { fontSize: 12, color: "#209FC1", fontFamily: "Inter-SemiBold" },
});
