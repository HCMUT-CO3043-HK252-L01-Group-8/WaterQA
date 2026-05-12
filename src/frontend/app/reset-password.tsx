import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as api from "../services/api";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string; otp: string }>();
    // useLocalSearchParams can return string | string[] on web, normalize to string
    const email = Array.isArray(params.email) ? params.email[0] : params.email;
    const otp = Array.isArray(params.otp) ? params.otp[0] : params.otp;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }
        if (!email || !otp) {
            console.error('[reset-password] Missing params:', { email, otp });
            Alert.alert("Lỗi", "Thông tin xác thực không hợp lệ. Vui lòng thử lại từ đầu.");
            router.replace("/forgot-password");
            return;
        }
        console.log('[reset-password] Calling resetPassword with email:', email, 'otp:', otp);

        setLoading(true);
        try {
            const response = await api.resetPassword(email, otp, newPassword);
            if (response.success) {
                if (Platform.OS === 'web') {
                    window.alert("Thành công! 🎉\nMật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập lại.");
                    router.replace("/login");
                } else {
                    Alert.alert(
                        "Thành công! 🎉",
                        "Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập lại.",
                        [{ 
                            text: "Đăng nhập", 
                            onPress: () => router.replace("/login")
                        }]
                    );
                }
            } else {
                Alert.alert("Lỗi", response.error || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            Alert.alert("Lỗi", "Không thể kết nối tới server. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.title}>Đặt mật khẩu mới</Text>
                    <Text style={styles.subtitle}>
                        Mã OTP đã được xác thực. Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                    </Text>

                    {/* Mật khẩu mới */}
                    <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                            secureTextEntry={!showPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#00A89D"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Xác nhận mật khẩu mới */}
                    <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Nhập lại mật khẩu mới"
                            secureTextEntry={!showConfirmPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                            <Ionicons
                                name={showConfirmPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#00A89D"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Nút xác nhận */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && { opacity: 0.6 }]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Xác nhận</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link quay về */}
                    <TouchableOpacity
                        style={styles.backLink}
                        onPress={() => router.replace("/login")}
                    >
                        <Text style={styles.backLinkText}>Quay về đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
    container: { flex: 1, padding: 24 },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
        paddingTop: Platform.OS === "android" ? 40 : 10,
    },
    backText: { fontSize: 16, marginLeft: 4, fontWeight: "500" },
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
    title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 8 },
    subtitle: { fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 20 },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 50,
    },
    input: { flex: 1, height: "100%", color: "#333" },
    submitButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    backLink: {
        marginTop: 16,
        alignItems: "center",
    },
    backLinkText: { color: "#00A89D", fontSize: 14, fontWeight: "600" },
});
