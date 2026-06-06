import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authServices } from "@/services/authServices";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập các thông tin bắt buộc.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Lỗi", "Định dạng email không hợp lệ.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        if (!agreeTerms) {
            Alert.alert("Lỗi", "Bạn cần đồng ý với các điều khoản và điều kiện để tiếp tục.");
            return;
        }

        setLoading(true);
        try {
            const res = await authServices.signup(name.trim(), email.trim(), phone.trim(), password);

            if (res.success) {
                if (Platform.OS === "web") {
                    window.alert(t("common.success", "Thành công!"));
                    router.replace("/login");
                } else {
                    Alert.alert(t("common.success", "Thành công! 🎉"), "Tạo tài khoản thành công", [
                        { text: t("auth.loginBtn", "Đăng nhập"), onPress: () => router.replace("/login") },
                    ]);
                }
            } else {
                Alert.alert(t("common.error", "Lỗi"), res.error || "Lỗi đăng ký.");
            }
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            Alert.alert(t("common.error", "Lỗi"), error?.error || "Error");
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
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={loading}>
                        <View style={styles.backIconCircle}>
                            <Ionicons name="chevron-back" size={20} color="#333" />
                        </View>
                        <Text style={styles.backText}>{t("common.back", "Quay lại")}</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>{t("auth.registerTitle", "Đăng ký")}</Text>
                        <Text style={styles.subtitle}>{t("auth.registerSubtitle", "Đăng ký tài khoản mới")}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>
                            {t("auth.displayName", "Tên hiển thị")} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder={t("auth.namePlaceholder", "Nhập họ tên")}
                                editable={!loading}
                            />
                        </View>

                        <Text style={styles.inputLabel}>
                            {t("common.email", "Email")} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t("auth.emailPlaceholder", "Nhập email")}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        <Text style={styles.inputLabel}>
                            {t("auth.phoneNumber", "Số điện thoại")} <Text style={styles.optional}>(tùy chọn)</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t("auth.phonePlaceholder", "Nhập số điện thoại")}
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>

                        <Text style={styles.inputLabel}>
                            {t("auth.passwordLabel", "Mật khẩu")} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t("auth.passwordHint", "Ít nhất 6 ký tự")}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color="#999"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>
                            {t("auth.confirmPassword", "Xác nhận mật khẩu")} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder={t("auth.confirmPasswordPlaceholder", "Nhập lại mật khẩu")}
                                secureTextEntry={!showConfirmPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color="#999"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setAgreeTerms(!agreeTerms)}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                                {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <Text style={styles.checkboxText}>{t("auth.agreeTerms", "Đồng ý với điều khoản")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.registerButton, (!agreeTerms || loading) && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={!agreeTerms || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.registerButtonText}>{t("auth.registerTitle", "Đăng ký")}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace("/login")}>
                            <Text style={styles.loginLinkText}>
                                {t("auth.alreadyHaveAccount", "Đã có tài khoản? ")}{" "}
                                <Text style={styles.loginLinkBold}>{t("auth.loginBtn", "Đăng nhập")}</Text>
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
    scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
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
    title: { fontSize: 48, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#666" },
    formContainer: { width: "100%" },
    inputLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
    required: { color: "#E53935", fontWeight: "600" },
    optional: { color: "#999", fontWeight: "400", fontSize: 12 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    input: { flex: 1, height: "100%", color: "#333", fontSize: 15 },
    icon: { marginLeft: 10 },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 32 },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
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
        borderRadius: 10,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#00A89D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    registerButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    loginLink: { alignItems: "center", paddingVertical: 8 },
    loginLinkText: { fontSize: 14, color: "#666" },
    loginLinkBold: { color: "#00A89D", fontWeight: "600" },
});
