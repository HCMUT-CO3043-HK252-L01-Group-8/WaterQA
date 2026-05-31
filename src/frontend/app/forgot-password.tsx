import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authServices } from "@/services/authServices";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email của bạn");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert("Lỗi", "Địa chỉ email không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            const response = await authServices.forgotPassword(trimmedEmail);
            if (response?.success) {
                router.push({
                    pathname: "/verify-code",
                    params: { email: trimmedEmail },
                });
            } else {
                Alert.alert(t('common.error', 'Lỗi'), response.error || "Failed");
            }
        } catch (error) {
            console.error("Error in FORGOT PASSWORD:", error)
            Alert.alert(t('common.error', 'Lỗi'), "Network Error");
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
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <View style={styles.backIconCircle}>
                            <Ionicons name="chevron-back" size={20} color="#333" />
                        </View>
                        <Text style={styles.backText}>{t('common.back', 'Quay lại')}</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>{t('auth.forgotTitle1', 'Bạn quên')}</Text>
                        <Text style={[styles.title, { marginLeft: "25%" }]}>{t('auth.forgotTitle2', 'mật khẩu?')}</Text>
                        <Text style={styles.subtitle}>
                            {t('auth.forgotSubtitle', 'Để lại email và chúng tôi sẽ hỗ trợ')}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>{t('common.email', 'Email')}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.emailPlaceholder', 'Nhập email...')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>{t('common.continue', 'Tiếp tục')}</Text>
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
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        marginBottom: 24,
        paddingHorizontal: 16,
        height: 52,
        justifyContent: "center",
    },
    input: { height: "100%", color: "#333", fontSize: 15 },
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
    },
    submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
