import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function VerifyCodeScreen() {
    const router = useRouter();

    // Array to hold refs for auto-focusing next input
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleChangeText = (text: string, index: number) => {
        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Nhập mã xác thực</Text>
                    <Text style={styles.subtitle}>
                        Đoạn mã 4 chữ số đã được gửi đến địa chỉ email của bạn, vui lòng nhập vào bên dưới
                    </Text>

                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={styles.otpInput}
                                keyboardType="numeric"
                                maxLength={1}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/login")}>
                            <Text style={styles.primaryButtonText}>Kiểm tra</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
                            <Text style={styles.secondaryButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F8F9FA" }, // Slightly gray background to make card pop
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    card: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 8 },
    subtitle: { fontSize: 12, color: "#666", marginBottom: 24, lineHeight: 18 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    otpInput: {
        width: 50,
        height: 60,
        backgroundColor: "#F5F8F8",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
    },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    primaryButton: {
        flex: 1,
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#00A89D",
        borderRadius: 8,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryButtonText: { color: "#00A89D", fontSize: 14, fontWeight: "bold" },
});
