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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);

    const handleRegister = () => {
        router.dismissAll()
        router.prefetch("/(tabs)/home")
        router.replace("/(tabs)/home")
    }

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
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Đăng ký</Text>
                        <Text style={styles.subtitle}>Đăng ký tài khoản mới</Text>
                    </View>

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
                                    color="#999"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                secureTextEntry={!showConfirmPassword}
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
                        >
                            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                                {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <Text style={styles.checkboxText}>Đồng ý với điều khoản và điều kiện</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        alignSelf: "flex-start",
    },
    backIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    backText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    headerSection: {
        marginBottom: 32,
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#00A89D",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
    },
    formContainer: {
        width: "100%",
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
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
    input: {
        flex: 1,
        height: "100%",
        color: "#333",
        fontSize: 15,
    },
    icon: {
        marginLeft: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 32,
    },
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
    checkboxChecked: {
        backgroundColor: "#00A89D",
    },
    checkboxText: {
        fontSize: 14,
        color: "#333",
    },
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
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
