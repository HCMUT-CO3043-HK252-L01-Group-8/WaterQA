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
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authServices } from "@/services/authServices";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string; otp: string }>();
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
            Alert.alert("Lỗi", "Thông tin xác thực không hợp lệ. Vui lòng thử lại từ đầu.");
            router.replace("/forgot-password");
            return;
        }

        setLoading(true);
        try {
            const response = await authServices.resetPassword(email, otp, newPassword);
            if (response.success) {
                Alert.alert("Thành công! 🎉", "Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập lại.", [
                    { text: "Đăng nhập", onPress: () => router.replace("/login") },
                ]);
            } else {
                Alert.alert("Lỗi", response.error || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error in RESET PASSWORD:", error)
            Alert.alert("Lỗi", "Không thể kết nối tới server. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/login")}>
                        <View style={styles.backIconCircle}>
                            <Ionicons name="close" size={20} color="#333" />
                        </View>
                        <Text style={styles.backText}>Hủy</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Mật khẩu</Text>
                        <Text style={[styles.title, { marginLeft: "20%" }]}>mới 🔒</Text>
                        <Text style={styles.subtitle}>
                            Mã OTP đã được xác thực. Vui lòng tạo mật khẩu mới cho tài khoản.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

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
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.7 }]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>Xác nhận & Lưu</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 30 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 30, alignSelf: "flex-start" },
    backIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    backText: { fontSize: 16, fontWeight: "500", color: "#333" },
    headerSection: { marginBottom: 32 },
    title: { fontSize: 48, fontWeight: "bold", color: "#00A89D", marginBottom: 12, lineHeight: 56 },
    subtitle: { fontSize: 14, color: "#666", lineHeight: 20 },
    formContainer: { width: "100%" },
    inputLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 52,
    },
    input: { flex: 1, height: "100%", color: "#333", fontSize: 15 },
    submitButton: {
        backgroundColor: "#00A89D",
        borderRadius: 10,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#00A89D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 12,
    },
    submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
