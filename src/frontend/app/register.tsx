import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Đăng ký</Text>
                <Text style={styles.subtitle}>Đăng ký tài khoản mới</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Tên</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập tên của bạn"
                        />
                    </View>

                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Nhập email của bạn"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.inputLabel}>Mật khẩu</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#00A89D"
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)}>
                        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                            {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
                        </View>
                        <Text style={styles.checkboxText}>Đồng ý với điều khoản và điều kiện</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.registerButton} onPress={() => router.replace("/(tabs)/home")}>
                        <Text style={styles.registerButtonText}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    title: { fontSize: 32, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 32 },
    formContainer: { marginBottom: 40 },
    inputLabel: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 50,
    },
    input: { flex: 1, height: "100%", color: "#333" },
    icon: { marginLeft: 10 },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#00A89D",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkboxChecked: { backgroundColor: "#00A89D" },
    checkboxText: { fontSize: 14, color: "#333" },
    registerButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    registerButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
