import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ThresholdModalProps {
    isVisible: boolean;
    onClose: () => void;
    currentValue: number;
    adminDefault: number;
    onSave: (value: number) => void;
}

export default function ThresholdModal({
    isVisible,
    onClose,
    currentValue,
    adminDefault,
    onSave,
}: ThresholdModalProps) {
    const { t } = useTranslation();
    const [tempValue, setTempValue] = useState(currentValue);

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t("settings.wqiThreshold", "Tùy chỉnh ngưỡng cảnh báo")}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={20} color="#62748E" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.desc}>
                        {t(
                            "settings.thresholdDesc",
                            "Ứng dụng sẽ gửi cảnh báo khi chỉ số WQI xuống dưới mức bạn thiết lập.",
                        )}
                    </Text>

                    <View style={styles.sliderContainer}>
                        <View style={styles.valueRow}>
                            <Text style={styles.currentValueText}>{tempValue}</Text>
                            <Text style={styles.unitText}>WQI</Text>
                        </View>

                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={tempValue}
                            onValueChange={setTempValue}
                            minimumTrackTintColor="#0891B2"
                            maximumTrackTintColor="#E2E8F0"
                            thumbTintColor="#0891B2"
                        />

                        <View style={styles.markerContainer}>
                            <View style={[styles.adminMarker, { left: `${adminDefault}%` }]} />
                            <Text style={[styles.adminLabel, { left: `${adminDefault - 15}%` }]}>
                                {t("settings.systemDefault", "Mặc định HT:")} {adminDefault}
                            </Text>
                        </View>
                    </View>

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
    sliderContainer: { marginBottom: 32 },
    valueRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginBottom: 10 },
    currentValueText: { fontSize: 42, color: "#0891B2", fontFamily: "Inter-Bold" },
    unitText: { fontSize: 16, color: "#62748E", marginLeft: 4, fontFamily: "Inter-SemiBold" },
    markerContainer: { height: 20, marginTop: 10, position: "relative" },
    adminMarker: { position: "absolute", top: -35, width: 2, height: 15, backgroundColor: "#94A3B8" },
    adminLabel: { position: "absolute", top: 5, fontSize: 10, color: "#94A3B8", fontFamily: "Inter-Medium" },
    saveBtn: { backgroundColor: "#0891B2", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
    saveBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter-SemiBold" },
});
