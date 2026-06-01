import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ThresholdModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    desc: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    currentValue: number;
    adminDefault?: number;
    onSave: (value: number) => void;
}

export default function ThresholdModal({
    isVisible,
    onClose,
    title,
    desc,
    unit,
    min,
    max,
    step,
    currentValue,
    adminDefault,
    onSave,
}: ThresholdModalProps) {
    const { t } = useTranslation();
    const [tempValue, setTempValue] = useState(currentValue);

    useEffect(() => {
        setTempValue(currentValue);
    }, [currentValue, isVisible]);

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={20} color="#62748E" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.desc}>{desc}</Text>

                    <View style={styles.sliderContainer}>
                        <View style={styles.valueRow}>
                            <Text style={styles.currentValueText}>{tempValue.toFixed(step < 1 ? 1 : 0)}</Text>
                            <Text style={styles.unitText}>{unit}</Text>
                        </View>

                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={min}
                            maximumValue={max}
                            step={step}
                            value={tempValue}
                            onValueChange={setTempValue}
                            minimumTrackTintColor="#0891B2"
                            maximumTrackTintColor="#E2E8F0"
                            thumbTintColor="#0891B2"
                        />

                        <View style={styles.minMaxRow}>
                            <Text style={styles.minMaxText}>
                                {min} {unit}
                            </Text>
                            <Text style={styles.minMaxText}>
                                {max} {unit}
                            </Text>
                        </View>
                    </View>

                    {adminDefault !== undefined && (
                        <View style={styles.suggestionBox}>
                            <Feather name="info" size={16} color="#0891B2" />
                            <Text style={styles.suggestionText}>
                                {t("settings.adminDefaultHint", "Khuyến nghị từ hệ thống:")}{" "}
                                <Text style={styles.suggestionBold}>
                                    {adminDefault} {unit}
                                </Text>
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => {
                            onSave(tempValue);
                            onClose();
                        }}
                    >
                        <Text style={styles.saveBtnText}>{t("common.saveSettings", "Lưu thiết lập")}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    content: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    title: { fontSize: 18, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    desc: { fontSize: 13, color: "#62748E", fontFamily: "Inter-Regular", lineHeight: 20, marginBottom: 24 },
    sliderContainer: { marginBottom: 24 },
    valueRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginBottom: 10 },
    currentValueText: { fontSize: 42, color: "#0891B2", fontFamily: "Inter-Bold" },
    unitText: { fontSize: 16, color: "#62748E", marginLeft: 4, fontFamily: "Inter-SemiBold" },
    minMaxRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, marginTop: -5 },
    minMaxText: { fontSize: 11, color: "#94A3B8", fontFamily: "Inter-Medium" },
    suggestionBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECFEFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#A5F3FC",
    },
    suggestionText: { fontSize: 13, color: "#0891B2", marginLeft: 8, fontFamily: "Inter-Regular", flex: 1 },
    suggestionBold: { fontFamily: "Inter-SemiBold" },
    saveBtn: { backgroundColor: "#0891B2", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
    saveBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter-SemiBold" },
});
