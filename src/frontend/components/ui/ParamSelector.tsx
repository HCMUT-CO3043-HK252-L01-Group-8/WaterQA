import { Feather, Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get("window").height;

interface ParameterOption {
    label: string;
    value: string;
}

interface ParamSelectorProps {
    parameters: ParameterOption[];
    selectedParam: string;
    onSelect: (paramValue: string) => void;
}

export default function ParamSelector({ parameters, selectedParam, onSelect }: ParamSelectorProps) {
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    const openModal = () => {
        setModalVisible(true);
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const closeModal = (callback?: () => void) => {
        Animated.sequence([
            Animated.timing(slideAnim, { toValue: screenHeight, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => {
            setModalVisible(false);
            if (callback) callback();
        });
    };

    const handleSelect = (paramValue: string) => {
        closeModal(() => {
            onSelect(paramValue);
        });
    };

    const currentParamLabel = parameters.find(p => p.value === selectedParam)?.label || "Chọn thông số";

    return (
        <View style={styles.wrapper}>
            
            <TouchableOpacity style={styles.pickerButton} onPress={openModal} activeOpacity={0.7}>
                <View style={styles.leftContent}>
                    <Ionicons name="options-outline" size={20} color="#00A89D" style={styles.icon} />
                    <Text style={styles.pickerText}>{currentParamLabel}</Text>
                </View>
                <Feather name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>

            <Modal transparent visible={isModalVisible} animationType="none" onRequestClose={() => closeModal()}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => closeModal()} />
                    <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 24 }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Chọn thông số quan trắc</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Feather name="x" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {parameters.map((param) => {
                            const isSelected = param.value === selectedParam;
                            return (
                                <TouchableOpacity
                                    key={param.value}
                                    style={[styles.paramOption, isSelected && styles.paramOptionSelected]}
                                    onPress={() => handleSelect(param.value)}
                                >
                                    <Text style={[styles.paramText, isSelected && styles.paramTextSelected]}>
                                        {param.label}
                                    </Text>
                                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#00A89D" />}
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { paddingHorizontal: 16, marginBottom: 16 },
    selectorLabel: { fontSize: 13, color: "#64748B", fontFamily: "Inter-Medium", marginBottom: 8 },
    pickerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    leftContent: { flexDirection: "row", alignItems: "center" },
    icon: { marginRight: 8 },
    pickerText: { fontSize: 15, color: "#1E293B", fontFamily: "Inter-SemiBold" },

    modalContainer: { flex: 1, justifyContent: "flex-end" },
    modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
    bottomSheet: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        width: "100%",
        zIndex: 10,
    },
    sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    sheetTitle: { fontSize: 18, fontFamily: "Inter-Bold", color: "#1E293B" },
    paramOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
        borderRadius: 8,
    },
    paramOptionSelected: { backgroundColor: "#F0FDFA" },
    paramText: { fontSize: 15, color: "#475569", fontFamily: "Inter-Medium" },
    paramTextSelected: { color: "#00A89D", fontFamily: "Inter-SemiBold" },
});