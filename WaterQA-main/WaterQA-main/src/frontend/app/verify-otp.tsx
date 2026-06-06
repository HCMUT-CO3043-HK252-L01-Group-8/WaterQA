import React, { useRef, useState } from "react";
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

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleOtpChange = (text: string, index: number) => {
        // Chỉ lấy ký tự số cuối cùng được nhập
        const digit = text.replace(/[^0-9]/g, "").slice(-1);
        const newValues = [...otpValues];
        newValues[index] = digit;
        setOtpValues(newValues);

        // Tự động chuyển sang ô tiếp theo
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            if (otpValues[index]) {
                // Xoá ký tự ở ô hiện tại
                const newValues = [...otpValues];
                newValues[index] = "";
                setOtpValues(newValues);
            } else if (index > 0) {
                // Chuyển về ô trước
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const otp = otpValues.join("");
        if (otp.length < OTP_LENGTH) {
            Alert.alert("Lỗi", `Vui lòng nhập đủ ${OTP_LENGTH} chữ số`);
            return;
        }
        if (!email) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin email. Vui lòng thử lại từ đầu.");
            router.replace("/forgot-password");
            return;
        }

        setLoading(true);
        try {
            const response = await api.verifyOTP(email, otp);
            if (response.success) {
                // OTP hợp lệ, chuyển tới trang đổi mật khẩu
                router.push({
                    pathname: "/reset-password",
                    params: { email: email, otp: otp },
                });
            } else {
                Alert.alert("Lỗi", response.error || "Mã OTP không đúng hoặc đã hết hạn");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            Alert.alert("Lỗi", "Không thể kết nối tới server. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) return;
        try {
            const response = await api.forgotPassword(email);
            if (response.success) {
                Alert.alert("Đã gửi lại", "Mã OTP mới đã được gửi vào email của bạn");
                setOtpValues(Array(OTP_LENGTH).fill(""));
                inputRefs.current[0]?.focus();
            } else {
                Alert.alert("Lỗi", response.error || "Không thể gửi lại mã OTP");
            }
        } catch {
            Alert.alert("Lỗi", "Không thể kết nối tới server");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.title}>Nhập mã xác thực</Text>

                    {/* Banner thông báo OTP đã gửi */}
                    <View style={styles.infoBanner}>
                        <Ionicons name="mail" size={16} color="#00A89D" />
                        <Text style={styles.infoBannerText}>
                            Mã OTP đã được gửi đến hộp thư của bạn. Kiểm tra cả thư mục Spam.
                        </Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Nhập mã OTP <Text style={styles.bold}>6 chữ số</Text> đã gửi đến{"\n"}
                        <Text style={styles.emailText}>{email || "email của bạn"}</Text>
                    </Text>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {Array(OTP_LENGTH)
                            .fill(0)
                            .map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[
                                        styles.otpInput,
                                        otpValues[index] ? styles.otpInputFilled : null,
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={otpValues[index]}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectTextOnFocus
                                />
                            ))}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.primaryButton, loading && { opacity: 0.6 }]}
                            onPress={handleVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Tiếp tục</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleResendOTP}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryButtonText}>Gửi lại mã</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 8 },
    subtitle: { fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 20 },
    bold: { fontWeight: "bold", color: "#333" },
    emailText: { color: "#00A89D", fontWeight: "600" },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        gap: 8,
    },
    otpInput: {
        width: 44,
        height: 44,
        backgroundColor: "#F5F8F8",
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#E0E0E0",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
    },
    otpInputFilled: {
        borderColor: "#00A89D",
        backgroundColor: "#F0FAFA",
    },
    infoBanner: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#E8F8F7",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        gap: 8,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 12,
        color: "#00A89D",
        lineHeight: 18,
    },
    buttonRow: { flexDirection: "row", gap: 12 },
    primaryButton: {
        flex: 1,
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#00A89D",
        borderRadius: 8,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryButtonText: { color: "#00A89D", fontSize: 15, fontWeight: "bold" },
});
