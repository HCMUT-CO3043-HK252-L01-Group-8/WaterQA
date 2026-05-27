import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as api from "../services/api";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Validate
        if (!name.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên của bạn");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập email");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Lỗi", "Địa chỉ email không hợp lệ");
            return;
        }
        if (!password || password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }
        if (!agreeTerms) {
            Alert.alert("Lỗi", "Vui lòng đồng ý với điều khoản và điều kiện");
            return;
        }

        setLoading(true);
        try {
            const response = await api.signup(
                name.trim(),
                email.trim(),
                phoneNumber.trim(),
                password
            );

            console.log('Signup response:', response);

            if (response.success) {
                if (Platform.OS === 'web') {
                    window.alert("Đăng ký thành công! 🎉\nTài khoản của bạn đã được tạo. Vui lòng đăng nhập.");
                    console.log('Navigating to login...');
                    router.replace("/login");
                } else {
                    Alert.alert(
                        "Đăng ký thành công! 🎉",
                        "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
                        [{ 
                            text: "Đăng nhập ngay", 
                            onPress: () => {
                                console.log('Navigating to login...');
                                router.replace("/login");
                            }
                        }]
                    );
                }
            } else {
                console.error('Registration failed:', response.error);
                Alert.alert("Lỗi", response.error || "Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Register error:", error);
            Alert.alert("Lỗi", "Không thể kết nối tới server. Vui lòng kiểm tra kết nối.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={20} color="#000" />
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Đăng ký</Text>
                    <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

                    <View style={styles.formContainer}>
                        {/* Tên */}
                        <Text style={styles.inputLabel}>Tên hiển thị <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Nhập tên của bạn"
                                editable={!loading}
                            />
                        </View>

                        {/* Email */}
                        <Text style={styles.inputLabel}>Email <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Nhập email của bạn"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        {/* Số điện thoại */}
                        <Text style={styles.inputLabel}>Số điện thoại <Text style={styles.optional}>(tùy chọn)</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Nhập số điện thoại"
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>

                        {/* Mật khẩu */}
                        <Text style={styles.inputLabel}>Mật khẩu <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Ít nhất 6 ký tự"
                                secureTextEntry={!showPassword}
                                editable={!loading}
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

                        {/* Xác nhận mật khẩu */}
                        <Text style={styles.inputLabel}>Xác nhận mật khẩu <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                secureTextEntry={!showConfirmPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color="#00A89D"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Điều khoản */}
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setAgreeTerms(!agreeTerms)}
                            disabled={loading}
                        >
                            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                                {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <Text style={styles.checkboxText}>Đồng ý với điều khoản và điều kiện</Text>
                        </TouchableOpacity>

                        {/* Nút Đăng ký */}
                        <TouchableOpacity
                            style={[styles.registerButton, (!agreeTerms || loading) && { opacity: 0.6 }]}
                            onPress={handleRegister}
                            disabled={!agreeTerms || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.registerButtonText}>Đăng ký</Text>
                            )}
                        </TouchableOpacity>

                        {/* Link đăng nhập */}
                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => router.replace("/login")}
                        >
                            <Text style={styles.loginLinkText}>
                                Đã có tài khoản?{" "}
                                <Text style={styles.loginLinkBold}>Đăng nhập</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
        paddingTop: Platform.OS === "android" ? 40 : 10,
    },
    backText: { fontSize: 16, marginLeft: 4, fontWeight: "500" },
    title: { fontSize: 32, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 32 },
    formContainer: { marginBottom: 20 },
    inputLabel: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
    required: { color: "#E53935", fontWeight: "600" },
    optional: { color: "#999", fontWeight: "400", fontSize: 12 },
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
        borderWidth: 1.5,
        borderColor: "#00A89D",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkboxChecked: { backgroundColor: "#00A89D" },
    checkboxText: { fontSize: 14, color: "#333", flex: 1 },
    registerButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    registerButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    loginLink: { alignItems: "center", paddingVertical: 8 },
    loginLinkText: { fontSize: 14, color: "#666" },
    loginLinkBold: { color: "#00A89D", fontWeight: "600" },
});
