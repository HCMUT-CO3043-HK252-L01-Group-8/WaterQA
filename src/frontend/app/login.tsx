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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("myemail@gmail.com");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        router.dismissAll();
        router.prefetch("/(tabs)/home")
        router.replace("/(tabs)/home")
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
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Đăng nhập</Text>
                        <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>
                    </View>

                    <View style={styles.formContainer}>
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
                            <Ionicons name="checkmark-circle" size={20} color="#00A89D" style={styles.icon} />
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

                        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.socialContainer}>
                        <View style={styles.dividerRow}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity style={styles.googleButton}>
                            <FontAwesome5 name="google" size={18} color="#DB4437" />
                            <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
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
        paddingBottom: 30,
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
        marginBottom: 20,
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
    forgotPasswordText: {
        color: "#00A89D",
        textAlign: "right",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 30,
    },
    loginButton: {
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
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    socialContainer: {
        marginTop: 40,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#EEEEEE",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#999",
        fontSize: 13,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        height: 52,
        backgroundColor: "#FFFFFF",
    },
    googleButtonText: {
        color: "#333",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 12,
    },
});
