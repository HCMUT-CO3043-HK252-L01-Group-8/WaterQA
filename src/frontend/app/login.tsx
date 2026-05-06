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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as api from "../services/api";

// Cần thiết để đóng browser popup sau khi xác thực trên web
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("myemail@gmail.com");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Cấu hình Google OAuth - cần EXPO_PUBLIC_GOOGLE_CLIENT_ID trong .env.local
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
    });

    // Xử lý response từ Google OAuth
    React.useEffect(() => {
        if (response?.type === "success") {
            handleGoogleSuccess(response);
        } else if (response?.type === "error") {
            setGoogleLoading(false);
            Alert.alert("Lỗi", "Đăng nhập Google thất bại: " + (response.error?.message || "Không xác định"));
        } else if (response?.type === "dismiss") {
            setGoogleLoading(false);
        }
    }, [response]);

    // Decode JWT id_token (base64url) để lấy payload mà không cần verify
    const decodeIdToken = (idToken: string) => {
        try {
            const parts = idToken.split('.');
            if (parts.length !== 3) return null;
            // Thêm padding nếu cần
            const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const padded = payload + '=='.slice((payload.length + 3) % 4 === 0 ? 4 : (payload.length + 3) % 4);
            return JSON.parse(atob(padded));
        } catch {
            return null;
        }
    };

    const handleGoogleSuccess = async (successResponse: AuthSession.AuthSessionResult) => {
        if (successResponse.type !== "success") return;

        try {
            const tokenResponse = (successResponse as any).authentication;
            const accessToken = tokenResponse?.accessToken;
            // Trên Expo Web dùng Authorization Code flow, id_token có trong params
            const idToken = (successResponse as any).params?.id_token || tokenResponse?.idToken;

            let userInfo: { name?: string; email?: string; picture?: string } | null = null;

            if (accessToken) {
                // Native: lấy profile từ Google UserInfo API
                const userInfoResponse = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                userInfo = await userInfoResponse.json();
                console.log("Google user info (native):", userInfo);
            } else if (idToken) {
                // Web: decode id_token để lấy thông tin người dùng
                const decoded = decodeIdToken(idToken);
                console.log("Decoded id_token (web):", decoded);
                if (decoded) {
                    userInfo = {
                        name: decoded.name,
                        email: decoded.email,
                        picture: decoded.picture,
                    };
                }
            }

            if (userInfo?.email) {
                // Gửi Google user info tới backend để tạo/update user
                try {
                    const backendResponse = await api.loginWithGoogle(
                        userInfo.name || 'Google User',
                        userInfo.email,
                        userInfo.picture || ''
                    );
                    if (backendResponse.success) {
                        const userData = backendResponse.user;
                        localStorage.setItem('userName', userData.name || userInfo.name || 'Google User');
                        localStorage.setItem('userEmail', userData.email || userInfo.email);
                        router.replace("/(tabs)/home");
                    } else {
                        Alert.alert('Lỗi', backendResponse.error || 'Không thể hoàn thành đăng nhập');
                    }
                } catch (backendError) {
                    console.error("Backend login error:", backendError);
                    Alert.alert('Lỗi', 'Không thể kết nối tới server');
                }
            } else {
                // Không lấy được thông tin user
                console.error("Không lấy được thông tin Google user", { tokenResponse, params: (successResponse as any).params });
                Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản Google. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Google login error:", error);
            Alert.alert('Lỗi', 'Đăng nhập Google thất bại. Vui lòng thử lại.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        setLoading(true);
        try {
            const response = await api.login(email, password);
            
            if (response.success) {
                // Lưu thông tin người dùng vào localStorage
                const userData = response.user;
                localStorage.setItem('userName', userData.email.split('@')[0]);
                localStorage.setItem('userEmail', userData.email);
                router.replace("/(tabs)/home");
            } else {
                const errorMessage = response.error || 'Đăng nhập thất bại';
                Alert.alert('Lỗi', errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Lỗi', 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Kiểm tra xem Google Client ID có được cấu hình không
        if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
            Alert.alert(
                'Chưa cấu hình Google',
                'Google Client ID chưa được cài đặt.\n\nVui lòng thêm EXPO_PUBLIC_GOOGLE_CLIENT_ID vào file .env.local\n\nXem hướng dẫn trong README để tạo Google OAuth Client ID.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Kiểm tra xem request đã sẵn sàng
        if (!request) {
            Alert.alert('Lỗi', 'Google login chưa sẵn sàng. Vui lòng thử lại.');
            return;
        }

        setGoogleLoading(true);
        try {
            await promptAsync();
        } catch (error) {
            console.error('Google login error:', error);
            setGoogleLoading(false);
            Alert.alert('Lỗi', 'Không thể mở trang đăng nhập Google. Vui lòng thử lại.');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // TODO: Integrate Facebook Sign-In
            Alert.alert('Facebook Login', 'Chức năng này sẽ được cập nhật sớm');
        } catch (error) {
            Alert.alert('Lỗi', 'Đăng nhập Facebook thất bại');
        }
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
                    <TouchableOpacity 
                        style={[styles.loginButton, loading && { opacity: 0.6 }]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Social Logins */}
                <View style={styles.socialContainer}>
                    {/* Google Login */}
                    <TouchableOpacity 
                        style={[styles.socialButton, googleLoading && styles.socialButtonLoading]} 
                        onPress={handleGoogleLogin}
                        disabled={googleLoading || !request}
                    >
                        {googleLoading ? (
                            <ActivityIndicator size="small" color="#DB4437" />
                        ) : (
                            <FontAwesome5 name="google" size={18} color="#DB4437" />
                        )}
                        <Text style={styles.socialButtonText}>
                            {googleLoading ? "Đang mở Google..." : "Đăng nhập với Google"}
                        </Text>
                    </TouchableOpacity>

                    {/* Facebook Login */}
                    <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
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
        gap: 10,
    },
    socialButtonLoading: {
        opacity: 0.7,
        backgroundColor: "#F5F8F8",
    },
    socialButtonText: {
        color: "#00A89D",
        fontSize: 16,
        fontWeight: "500",
    },
});
