import { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authServices } from "@/services/authServices";

export default function VerifyCodeScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [countdown, setCountdown] = useState(60);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerifyCode = async (finalCode: string) => {
        if (finalCode.length === 6) {
            Keyboard.dismiss();
            if (!email) {
                Alert.alert("Lỗi", "Không tìm thấy thông tin email.");
                return;
            }

            setLoading(true);
            try {
                const response = await authServices.verifyOTP(email, finalCode);
                if (response.success) {
                    // Dùng replace để đóng modal và mở trang Đổi mật khẩu
                    router.replace({
                        pathname: "/reset-password",
                        params: { email, otp: finalCode },
                    });
                } else {
                    Alert.alert("Lỗi", response.error || "Mã OTP không đúng hoặc đã hết hạn");
                }
            } catch (error) {
                console.error("Error in VERIFY CODE:", error)
                Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResendCode = async () => {
        if (!email) return;
        try {
            const response = await authServices.forgotPassword(email);
            if (response.success) {
                setCountdown(60); // Reset bộ đếm
                setCode(["", "", "", "", "", ""]); // Xóa trắng các ô nhập
                inputRefs.current[0]?.focus();
            } else {
                Alert.alert("Lỗi", response.error || "Không thể gửi lại mã.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Lỗi mạng khi gửi lại mã.");
        }
    };

    const handleChangeText = (text: string, index: number) => {
        if (text.length > 1) {
            const pastedCode = text
                .replace(/[^0-9]/g, "")
                .slice(0, 6)
                .split("");
            const newCode = ["", "", "", "", "", ""];
            pastedCode.forEach((char, i) => {
                newCode[i] = char;
            });
            setCode(newCode);

            const lastIndex = pastedCode.length - 1;
            if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
            if (pastedCode.length === 6) handleVerifyCode(pastedCode.join(""));
            return;
        }

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text.length === 1) {
            if (index < 5) inputRefs.current[index + 1]?.focus();
            else if (index === 5) handleVerifyCode(newCode.join(""));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            if (code[index] === "" && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newCode = [...code];
                newCode[index - 1] = "";
                setCode(newCode);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.card}>
                    <Text style={styles.title}>Nhập mã xác thực</Text>
                    <Text style={styles.subtitle}>
                        Đoạn mã 6 chữ số đã được gửi đến địa chỉ email{" "}
                        <Text style={{ fontWeight: "bold", color: "#00A89D" }}>{email}</Text>, vui lòng nhập vào bên
                        dưới
                    </Text>

                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                style={styles.otpInput}
                                keyboardType="numeric"
                                maxLength={6}
                                value={code[index]}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                editable={!loading}
                            />
                        ))}
                    </View>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Chưa nhận được mã? </Text>
                        <TouchableOpacity disabled={countdown > 0 || loading} onPress={handleResendCode}>
                            <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
                                Gửi lại {countdown > 0 ? `(${countdown}s)` : ""}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                            onPress={() => handleVerifyCode(code.join(""))}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Kiểm tra</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.back()}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    card: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 12 },
    subtitle: { fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 20 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    otpInput: {
        width: 42,
        height: 56,
        backgroundColor: "#F5F8F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",
        color: "#00A89D",
    },
    resendContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 32 },
    resendText: { fontSize: 14, color: "#666" },
    resendLink: { fontSize: 14, color: "#00A89D", fontWeight: "bold" },
    resendLinkDisabled: { color: "#A0A0A0" },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    primaryButton: {
        flex: 1,
        backgroundColor: "#00A89D",
        borderRadius: 10,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#00A89D",
        borderRadius: 10,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryButtonText: { color: "#00A89D", fontSize: 15, fontWeight: "bold" },
});
