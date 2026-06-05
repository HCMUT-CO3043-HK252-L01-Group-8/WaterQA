import { Feather, Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get("window").height;

interface LocationSelectorProps {
    locations: string[];
    selectedLocation: string;
    onSelect: (location: string) => void;
}

export default function LocationSelector({ locations, selectedLocation, onSelect }: LocationSelectorProps) {
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

    return (
        <>
            <View style={styles.locationSection}>
                <TouchableOpacity style={styles.pickerBox} onPress={openModal} activeOpacity={0.7}>
                    <View style={styles.leftContent}>
                        <Feather name="navigation" size={20} color="#00A89D" />
                        <Text style={styles.pickerText}>{selectedLocation}</Text>
                    </View>
                    <Feather name="chevron-down" size={20} color="#666666" />
                </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} transparent={true} animationType="none" onRequestClose={() => closeModal()}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => closeModal()} />
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            { transform: [{ translateY: slideAnim }], paddingBottom: 24 + insets.bottom },
                        ]}
                    >
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>{t("home.selectLocation", "Chọn trạm quan trắc")}</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        {locations.map((loc, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.locationOption,
                                    selectedLocation === loc && styles.locationOptionSelected,
                                ]}
                                onPress={() => closeModal(() => onSelect(loc))}
                            >
                                <Text
                                    style={[
                                        styles.locationOptionText,
                                        selectedLocation === loc && styles.locationOptionTextSelected,
                                    ]}
                                >
                                    {loc}
                                </Text>
                                {selectedLocation === loc && (
                                    <Ionicons name="checkmark-circle" size={20} color="#00A89D" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    locationSection: { marginHorizontal: 16, marginBottom: 20 },
    pickerBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
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
    locationOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    locationOptionSelected: {
        backgroundColor: "#F0FDF4",
        borderRadius: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 0,
    },
    locationOptionText: { fontSize: 15, color: "#334155", fontFamily: "Inter-Regular" },
    locationOptionTextSelected: { color: "#00A89D", fontFamily: "Inter-SemiBold" },
});
