import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Bạn quên{"\n"}mật khẩu?</Text>
                <Text style={styles.subtitle}>Nhập email và chúng tôi sẽ hỗ trợ bạn tạo lại mật khẩu mới</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Nhập email của bạn..."
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={() => router.push("/verify-code")}>
                        <Text style={styles.submitButtonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
        paddingTop: Platform.OS === "android" ? 40 : 10,
    },
    backText: { fontSize: 16, marginLeft: 4, fontWeight: "500" },
    title: { fontSize: 32, fontWeight: "bold", color: "#00A89D", marginBottom: 16, lineHeight: 40 },
    subtitle: { fontSize: 14, color: "#333", marginBottom: 40, lineHeight: 20 },
    formContainer: { marginBottom: 40 },
    inputLabel: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
    inputContainer: {
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        marginBottom: 24,
        paddingHorizontal: 16,
        height: 50,
        justifyContent: "center",
    },
    input: { height: "100%", color: "#333" },
    submitButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
