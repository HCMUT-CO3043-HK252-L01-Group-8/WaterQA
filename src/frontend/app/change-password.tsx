import { useState } from "react";
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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authServices } from "@/services/authServices";
import { useTranslation } from "react-i18next";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert(t("common.error", "Lỗi"), "Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert(t("common.error", "Lỗi"), "Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert(t("common.error", "Lỗi"), "Mật khẩu xác nhận không khớp.");
            return;
        }
        if (currentPassword === newPassword) {
            Alert.alert(t("common.error", "Lỗi"), "Mật khẩu mới không được trùng với mật khẩu hiện tại.");
            return;
        }

        setLoading(true);
        try {
            const response = await authServices.changePassword(currentPassword, newPassword, confirmPassword);
            if (response.success) {
                if (Platform.OS === "web") {
                    window.alert(t("common.success", "Thành công! 🎉") + "\n" + "Mật khẩu của bạn đã được thay đổi.");
                    router.back();
                } else {
                    Alert.alert(
                        t("common.success", "Thành công! 🎉"),
                        "Mật khẩu của bạn đã được thay đổi thành công.",
                        [{ text: "OK", onPress: () => router.back() }],
                    );
                }
            } else {
                Alert.alert(
                    t("common.error", "Lỗi"),
                    response.error || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.",
                );
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            Alert.alert(t("common.error", "Lỗi"), "Không thể kết nối tới server. Vui lòng thử lại sau.");
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
                        <Text style={styles.title}>{t("auth.changePasswordTitle", "Đổi mật khẩu")}</Text>
                        <Text style={styles.subtitle}>
                            {t("auth.changePasswordSubtitle", "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới")}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>{t("auth.currentPassword", "Mật khẩu hiện tại")}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder={t("auth.currentPasswordPlaceholder", "Nhập mật khẩu hiện tại")}
                                secureTextEntry={!showCurrent}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                <Ionicons name={showCurrent ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>{t("auth.newPassword", "Mật khẩu mới")}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder={t("auth.newPasswordPlaceholder", "Nhập mật khẩu (ít nhất 6 ký tự)")}
                                secureTextEntry={!showNew}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Ionicons name={showNew ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>{t("auth.confirmNewPassword", "Xác nhận mật khẩu")}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder={t("auth.confirmNewPasswordPlaceholder", "Nhập lại mật khẩu mới")}
                                secureTextEntry={!showConfirm}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.7 }]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {t("auth.saveAndConfirm", "Xác nhận & Lưu")}
                                </Text>
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
    title: { fontSize: 36, fontWeight: "bold", color: "#00A89D", marginBottom: 12, lineHeight: 44 },
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
