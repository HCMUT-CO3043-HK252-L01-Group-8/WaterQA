import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { useTranslation } from "react-i18next";

interface FilterAndExportProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onExport: () => void;
}

export default function FilterAndExport({ activeFilter, onFilterChange, onExport }: FilterAndExportProps) {
    const { t } = useTranslation();

    const filterOptions = [
        { label: t("history.daily", "Ngày"), value: "day" },
        { label: t("history.monthly", "Tháng"), value: "month" },
        { label: t("history.yearly", "Năm"), value: "year" },
    ];

    return (
        <View style={styles.filterActionSection}>
            <View style={styles.leftFilterGroup}>
                <Text style={styles.filterLabel}>{t("Xem theo:")}</Text>
                <CustomFilterTab options={filterOptions} activeOption={activeFilter} onOptionChange={onFilterChange} />
            </View>

            {Platform.OS === "web" && (
                <TouchableOpacity style={styles.exportBtn} onPress={onExport}>
                    <Feather name="download" size={14} color="#209FC1" style={styles.exportIcon} />
                    <Text style={styles.exportText}>{t("history.export", "Xuất báo cáo")}</Text>
                </TouchableOpacity>
            )}
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
    leftFilterGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    filterLabel: {
        fontSize: 13,
        color: "#64748B",
        fontFamily: "Inter-Medium",
    },
    exportBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    exportIcon: { marginRight: 6 },
    exportText: { fontSize: 12, color: "#0284C7", fontFamily: "Inter-SemiBold" },
});
