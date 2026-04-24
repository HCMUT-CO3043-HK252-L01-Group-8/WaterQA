import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("myemail@gmail.com");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Execute authentication logic here
        // On success, navigate to the main tabs:
        router.replace("/(tabs)/home");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                {/* Header / Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#000" />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                {/* Titles */}
                <Text style={styles.title}>Đăng nhập</Text>
                <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
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
                        <Ionicons name="checkmark" size={20} color="#00A89D" style={styles.icon} />
                    </View>

                    {/* Password Input */}
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
                                color="#00A89D"
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Logins */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome5 name="google" size={18} color="#DB4437" />
                        <Text style={styles.socialButtonText}>Đăng nhập với Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome5 name="facebook" size={18} color="#4267B2" />
                        <Text style={styles.socialButtonText}>Đăng nhập với Facebook</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
        paddingTop: Platform.OS === "android" ? 40 : 10,
    },
    backText: {
        fontSize: 16,
        marginLeft: 4,
        fontWeight: "500",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#00A89D",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 32,
    },
    formContainer: {
        marginBottom: 40,
    },
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
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 50,
    },
    input: {
        flex: 1,
        height: "100%",
        color: "#333",
    },
    icon: {
        marginLeft: 10,
    },
    forgotPasswordText: {
        color: "#00A89D",
        textAlign: "right",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    socialContainer: {
        marginTop: "auto",
        marginBottom: 40,
        gap: 16,
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        backgroundColor: "#FFFFFF",
    },
    socialButtonText: {
        color: "#00A89D",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 10,
    },
});
